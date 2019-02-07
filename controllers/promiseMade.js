const PromiseMade = require("../models/Promise");
const PromiseVote = require("../models/PromiseVote");
const PromiseReputationVote = require("../models/PromiseRepuationVote");
const mongoose = require("mongoose");

exports.postPromise = (req, res, next) => {
  const promiseMade = new PromiseMade({
    title: req.body.promiseTitle,
    description: req.body.promiseDescription,
    source: req.body.promiseSource,
    author: req.user._id,
    politician: req.params.shortId
  });
  promiseMade.save(err => {
    if (err) {
      return next(err);
    }
    req.flash("success", {
      msg: "A new promise has successfully been added."
    });
    res.redirect("/politician/" + req.params.shortId);
  });
};

exports.postPromiseVote = (req, res, next) => {
  PromiseVote.findOneAndUpdate(
    { promise: req.params._id, user: req.user._id },
    {
      user: req.user._id,
      promise: req.params._id,
      politician: req.params.shortId,
      vote: req.body.vote
    },
    { upsert: true, new: true }
  )
    .then(PromisedVote => {
      PromiseMade.updateOne(
        { _id: req.params._id },
        {
          $addToSet: {
            promiseVote: PromisedVote._id
          }
        }
      ).exec();
    })
    .then(promiseVote => {
      req.flash("success", {
        msg: "Vote Submitted"
      });
      res.redirect("/politician/" + req.params.shortId + "#promises");
    })
    .catch(err => res.send(err));
};

exports.getPromiseData = (req, res, next) => {
  let promiseData = PromiseVote.aggregate([
    { $match: { promise: new mongoose.Types.ObjectId(req.query.promiseId) } },
    {
      $group: {
        _id: "$vote",
        count: { $sum: 1 }
      }
    }
  ]).exec();

  promiseData
    .then(data => {
      let votesFound = false;
      let results = ["0", "0", "0"];
      let tags = ["1", "0", "-1"];
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < data.length; j++) {
          if (data[j]._id == tags[i]) {
            results[i] = data[j].count;
            votesFound = true;
            break;
          }
        }
      }
      if (votesFound) {
        res.send(results);
      } else {
        res.send();
      }
    })
    .catch(err => res.send(err));
};

exports.editPromise = (req, res) => {
  let updatePromise = PromiseMade.findByIdAndUpdate(req.params.id, {
    title: req.body.promiseTitle,
    description: req.body.promiseDescription,
    source: req.body.promiseSource
  }).exec();

  updatePromise
    .then(() => {
      req.flash("success", {
        msg: "Promise Updated"
      });
      res.redirect("/politician/" + req.params.shortId + "#promises");
    })
    .catch(err => res.send(err));
};

exports.deletePromise = (req, res) => {
  let deletePromise = PromiseMade.findByIdAndDelete(req.params.id).exec();
  let deleteVotes = PromiseVote.deleteMany({ promise: req.params.id }).exec();
  let deleteReputationVotes = PromiseReputationVote.deleteMany({
    promise: req.params.id
  }).exec();

  deletePromise
    .then(deleteVotes)
    .then(deleteReputationVotes)
    .then(() => {
      req.flash("success", {
        msg: "Promise Deleted"
      });
      res.redirect("/politician/" + req.params.shortId + "#promises");
    })
    .catch(err => res.send(err));
};

exports.postReputationVote = (req, res) => {
  PromiseReputationVote.findOneAndUpdate(
    { promise: req.params._id, user: req.user._id },
    {
      user: req.user._id,
      promise: req.params._id,
      politician: req.params.shortId,
      vote: req.body.vote
    },
    { upsert: true, new: true }
  )
    .then(ReputationVote => {
      PromiseMade.updateOne(
        { _id: req.params._id },
        {
          $addToSet: {
            reputationVote: ReputationVote._id
          }
        }
      ).exec();
    })
    .then(() => {
      req.flash("success", {
        msg: "Reputation Vote Submitted"
      });
      res.redirect("/politician/" + req.params.shortId + "#promises");
    })
    .catch(err => res.send(err));
};
