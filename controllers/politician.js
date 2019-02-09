const Politician = require("../models/Politician");
const PromiseMade = require("../models/Promise");
const Characteristics = require("../models/Characteristics");
const View = require("../models/View");
const Twitter = require("twitter");

let client = new Twitter({
  consumer_key: process.env.TWITTER_KEY,
  consumer_secret: process.env.TWITTER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

/** Post a politician to the Database */
exports.postPolitician = (req, res, next) => {
  console.log("here");
  const politician = new Politician({
    name: req.body.name,
    originalAuthor: req.user._id,
    politicalParty: req.body.politicalParty,
    twitterName: req.body.twitterHandle,
    electorate: req.body.electorate,
    title: req.body.title
  });
  Politician.findOne({ name: req.body.name }, (err, existingPolitician) => {
    if (err) {
      return next(err);
    }
    if (existingPolitician) {
      req.flash("errors", { msg: "Politician Already Exists" });
      res.redirect("/addPolitician");
    }
    politician.save(err => {
      if (err) {
        return next(err);
      }
      req.flash("success", {
        msg: "A new politician has successfully been added."
      });
      res.redirect("/");
    });
  });
};

exports.editPolitician = (req, res, next) => {
  const updatedPolitician = {
    politicalParty: req.body.politicalParty,
    twitterName: req.body.twitterHandle,
    electorate: req.body.electorate,
    title: req.body.title
  };
  Politician.findOneAndUpdate(
    { _id: req.params.shortId },
    updatedPolitician,
    (err, existingPolitician) => {
      if (err) {
        return next(err);
      }
      req.flash("success", {
        msg: "successfully Updated"
      });
      res.redirect("/politician/" + req.params.shortId);
    }
  );
};

exports.getAddPoliticianPage = (req, res) => {
  res.render("addPolitician", {
    title: "Politician"
  });
};

exports.searchByParty = (req, res, next) => {
  let party = req.params.party.replace("-", " ");
  Politician.find({ politicalParty: party }, (err, politicians) => {
    if (err) res.send(err);
    // for (let i = 0; i < politicians.length; i++) {
    //   picts[i] = client
    //     .get("users/show", { screen_name: politician.twitterName })
    //     .then(results => {
    //       return results.profile_image_url_https.replace("_normal", "_bigger");
    //     })
    //     .catch(err => {
    //       console.log(err);
    //       return null;
    //     });
    // }
    res.render("search", {
      politicians
    });
  });
};

// let getPoliticiansProfilePic =>(twitterName) client
//   .get("users/show", { screen_name: twitterName })
//   .then(results => {
//     return results.profile_image_url_https.replace("_normal", "_bigger");
//   })
//   .catch(err => {
//     console.log(err);
//     return null;
//   });

exports.searchByElectorate = (req, res, next) => {};

exports.getListOfPoliticians = (req, res, next) => {
  Politician.aggregate(
    [
      {
        $group: {
          _id: "$_id",
          display: { $first: "$name" }
        }
      }
    ],
    function postResponse(err, names) {
      if (err) res.send(err);
      console.log(names);
      res.json(names);
    }
  );
};

/** Return A list of distinct parties For search query */
exports.getListOfParties = (req, res, next) => {
  Politician.collection.distinct("politicalParty", function postResponse(
    err,
    parties
  ) {
    if (err) res.send(err);
    console.log(parties);
    res.json(parties);
  });
};

exports.getListOfElectorates = (req, res, next) => {
  Politician.collection.distinct("electorate", function postResponse(
    err,
    electorates
  ) {
    if (err) res.send(err);
    res.json(electorates);
  });
};

exports.getPoliticianPage = (req, res) => {
  let userId = req.user ? req.user._id : null;
  // Gets the politicans info, along with their assigned polictical promises and Views
  let getPolitician = Politician.findById(req.params.shortId).exec();

  // Gets the user's vote they made for the polictian's characteristics
  let getUsersCharacteristics = Characteristics.findOne({
    politician: req.params.shortId,
    user: userId
  }).exec();

  let getPoliticiansProfilePic = getPolitician
    .then(politician => {
      console.log(politician);
      return client.get("users/show", { screen_name: politician.twitterName });
    })
    .then(results => {
      return results.profile_image_url_https.replace("_normal", "_bigger");
    })
    .catch(err => {
      console.log(err);
      return null;
    });

  // Gets the averages and count from all users votes about the polictian's characteristics
  let getCharacteristicsStats = Characteristics.aggregate([
    { $match: { politician: req.params.shortId } },
    {
      $group: {
        _id: null,
        trustworthy: { $avg: "$trustworthy" },
        accountable: { $avg: "$accountable" },
        empathetic: { $avg: "$empathetic" },
        knowledgeable: { $avg: "$knowledgeable" },
        respectful: { $avg: "$respectful" },
        count: { $sum: 1 }
      }
    }
  ]).exec();

  let getPromisesMade = PromiseMade.aggregate([
    { $match: { politician: req.params.shortId } },
    { $unwind: { path: "$reputationVote", preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: "promisereputationvotes",
        localField: "reputationVote",
        foreignField: "_id",
        as: "repVotes"
      }
    },
    { $unwind: { path: "$repVotes", preserveNullAndEmptyArrays: true } },
    {
      $group: {
        _id: "$_id",
        title: { $first: "$title" },
        author: { $first: "$author" },
        politician: { $first: "$politician" },
        description: { $first: "$description" },
        source: { $first: "$source" },
        reputation: { $sum: "$repVotes.vote" },
        promiseVote: { $first: "$promiseVote" },
        reputationVote: { $addToSet: "$reputationVote" }
      }
    },
    { $sort: { reputation: -1 } }
  ])
    .then(results =>
      PromiseMade.populate(results, {
        path: "promiseVote",
        match: { user: userId }
      })
    )
    .then(results =>
      PromiseMade.populate(results, {
        path: "reputationVote",
        match: { user: userId }
      })
    )
    .catch(err => console.log(err));

  let getViews = View.aggregate([
    { $match: { politician: req.params.shortId } },
    { $unwind: { path: "$reputationVote", preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: "viewreputationvotes",
        localField: "reputationVote",
        foreignField: "_id",
        as: "repVotes"
      }
    },
    { $unwind: { path: "$repVotes", preserveNullAndEmptyArrays: true } },
    {
      $group: {
        _id: "$_id",
        title: { $first: "$title" },
        author: { $first: "$author" },
        politician: { $first: "$politician" },
        description: { $first: "$description" },
        source: { $first: "$source" },
        reputation: { $sum: "$repVotes.vote" },
        reputationVote: { $addToSet: "$reputationVote" }
      }
    },
    { $sort: { reputation: -1 } }
  ])
    .then(results =>
      View.populate(results, {
        path: "reputationVote",
        match: { user: userId }
      })
    )
    .catch(err => console.log(err));

  let promises = [
    getPolitician,
    getUsersCharacteristics,
    getCharacteristicsStats,
    getPromisesMade,
    getViews,
    getPoliticiansProfilePic
  ];

  Promise.all(promises)
    .then(results => {
      console.log(results[5]);
      res.render("politician", {
        title: results[0].name,
        politician: results[0],
        usersRating: results[1],
        averageRatings: results[2][0],
        promises: results[3],
        views: results[4],
        profilePicture: results[5]
      });
    })
    .catch(err => res.send(err));
};
