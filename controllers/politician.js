const Politician = require("../models/Politician");
const PromiseMade = require("../models/Promise");
const Characteristics = require("../models/Characteristics");
const View = require("../models/View");
const Twitter = require("twitter");
const toTitleCase = require("../utils/toTitleCase");
var slugify = require("slugify");

let client = new Twitter({
  consumer_key: process.env.TWITTER_KEY,
  consumer_secret: process.env.TWITTER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

/** Post a politician to the Database */
exports.postPolitician = (req, res, next) => {
  const politician = new Politician({
    name: toTitleCase(req.body.name, " "),
    originalAuthor: req.user._id,
    politicalParty: toTitleCase(slugify(req.body.politicalParty, " ")),
    twitterName: req.body.twitterHandle,
    electorate: toTitleCase(slugify(req.body.electorate, " ")),
    title: toTitleCase(req.body.title)
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
    politicalParty: toTitleCase(slugify(req.body.politicalParty, " ")),
    twitterName: req.body.twitterHandle,
    electorate: toTitleCase(req.body.electorate),
    title: toTitleCase(req.body.title)
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

exports.searchByParty = (req, res) => {
  let twitterNames = [];
  // ensures the param is in the correct format before quering the db
  let politicalPartyToFind = toTitleCase(req.params.party.replace(/(-)/g, " "));
  console.log(politicalPartyToFind);
  Politician.find(
    { politicalParty: politicalPartyToFind },
    (err, politicians) => {
      if (err) res.send(err);
      for (let i = 0; i < politicians.length; i++) {
        twitterNames.push(politicians[i].twitterName);
      }
      getPictures(twitterNames).then(pictures => {
        res.render("search", {
          title: politicalPartyToFind,
          politicians,
          pictures
        });
      });
    }
  );
};

async function getPictures(twitterNames) {
  return Promise.all(
    twitterNames.map(function(twitterName) {
      let result = getPoliticiansProfilePic(twitterName);
      return result;
    })
  );
}

let getPoliticiansProfilePic = twitterName => {
  return new Promise((resolve, reject) => {
    client
      .get("users/show", { screen_name: twitterName })
      .then(results => {
        resolve(results.profile_image_url_https.replace("_normal", ""));
      })
      .catch(err => {
        console.log(err);
        resolve(null);
      });
  });
};

exports.searchByElectorate = (req, res) => {
  let twitterNames = [];
  let electorateToFind = toTitleCase(req.params.party.replace(/(-)/g, " "));

  Politician.find({ electorate: electorateToFind }, (err, politicians) => {
    if (err) res.send(err);
    for (let i = 0; i < politicians.length; i++) {
      twitterNames.push(politicians[i].twitterName);
    }
    getPictures(twitterNames).then(pictures => {
      res.render("search", {
        title: electorateToFind,
        politicians,
        pictures
      });
    });
  });
};

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

/** Return A list of distinct electorates For search query */
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
  //let getPolitician = Politician.findById(req.params.shortId).exec();

  let getPolitician = Politician.aggregate([
    { $match: { _id: req.params.shortId } },
    {
      $group: {
        _id: "$_id",
        name: { $first: "$name" },
        title: { $first: "$title" },
        electorate: { $first: "$electorate" },
        politicalParty: { $first: "$politicalParty" },
        twitterName: { $first: "$twitterName" }
      }
    }
  ]).exec();

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
      return results.profile_image_url_https.replace("_normal", "");
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
        match: { user: userId },
        select: "vote"
      })
    )
    .then(results =>
      PromiseMade.populate(results, {
        path: "reputationVote",
        match: { user: userId },
        select: "vote"
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
        match: { user: userId },
        select: "vote"
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
      //console.log(results[0]);
      res.render("politician", {
        title: results[0][0].name,
        politician: results[0][0],
        usersRating: results[1],
        averageRatings: results[2][0],
        promises: results[3],
        views: results[4],
        profilePicture: results[5]
      });
    })
    .catch(err => res.send(err));
};
