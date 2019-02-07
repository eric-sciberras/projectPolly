const Politician = require("../models/Politician");
const PromiseMade = require("../models/Promise");
const Characteristics = require("../models/Characteristics");
const View = require("../models/View");

/** Post a politician to the Database */
exports.postPolitician = (req, res, next) => {
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

/** Return A list of Politicians For search query */
exports.getListOfPoliticians = (req, res, next) => {
  Politician.find({}, "name _id", function postResponse(err, politicians) {
    if (err) res.send(err);
    res.json(politicians);
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
    // projct to make a rep array here
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
    getViews
  ];

  Promise.all(promises)
    .then(results => {
      res.render("politician", {
        title: results[0].name,
        politician: results[0],
        usersRating: results[1],
        averageRatings: results[2][0],
        promises: results[3],
        views: results[4]
      });
    })
    .catch(err => res.send(err));
};
