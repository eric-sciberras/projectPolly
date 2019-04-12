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
    .then(() => {
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
  PromiseMade.findById(req.params.id, (err, promiseMade) => {
    if (err) {
      return next(err);
    }

    if (promiseMade) {
      promiseMade.title = req.body.promiseTitle || "";
      promiseMade.description = req.body.promiseDescription || "";
      promiseMade.source = req.body.promiseSource || "";
      if (promiseMade.author == req.user.id) {
        promiseMade.save(err => {
          req.flash("success", {
            msg: "Promise Updated"
          });
          res.redirect("/politician/" + req.params.shortId + "#promises");
        });
      } else {
        req.flash("errors", {
          msg: "You are not authorised to edit this promise"
        });
        res.redirect("/politician/" + req.params.shortId + "#promises");
      }
    } else {
      req.flash("errors", {
        msg: "Promise Not Found"
      });
      res.redirect("/politician/" + req.params.shortId + "#promises");
    }
  });
};

exports.deletePromise = (req, res) => {
  PromiseMade.findById(req.params.id, (err, promiseMade) => {
    if (promiseMade) {
      if (promiseMade.author == req.user.id) {
        PromiseMade.findByIdAndDelete(req.params.id)
          .then(PromiseVote.deleteMany({ promise: req.params.id }).exec())
          .then(
            PromiseReputationVote.deleteMany({
              promise: req.params.id
            })
          )
          .then(() => {
            req.flash("success", {
              msg: "Promise Deleted"
            });
            res.redirect("/politician/" + req.params.shortId + "#promises");
          })
          .catch(err => res.send(err));
      } else {
        req.flash("errors", {
          msg: "You are not authorised to delete this promise"
        });
        res.redirect("/politician/" + req.params.shortId + "#promises");
      }
    } else {
      req.flash("errors", {
        msg: "Promise Not Found"
      });
      res.redirect("/politician/" + req.params.shortId + "#promises");
    }
  });
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
