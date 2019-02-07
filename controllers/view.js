const ViewReputationVote = require("../models/ViewReputationVote");
const View = require("../models/View");

exports.postView = (req, res, next) => {
  const view = new View({
    title: req.body.viewTitle,
    description: req.body.viewDescription,
    source: req.body.viewSource,
    author: req.user._id,
    politician: req.params.shortId
  });
  view.save(err => {
    if (err) {
      return next(err);
    }
    req.flash("success", {
      msg: "A new view has successfully been added."
    });
    res.redirect("/politician/" + req.params.shortId);
  });
};

exports.editView = (req, res) => {
  let updateView = View.findByIdAndUpdate(req.params.id, {
    title: req.body.viewTitle,
    description: req.body.viewDescription,
    source: req.body.viewSource
  }).exec();

  updateView
    .then(() => {
      req.flash("success", {
        msg: "View Updated"
      });
      res.redirect("/politician/" + req.params.shortId + "#views");
    })
    .catch(err => res.send(err));
};

exports.deleteView = (req, res) => {
  let deleteView = View.findByIdAndDelete(req.params.id).exec();
  let deleteReputationVotes = ViewReputationVote.deleteMany({
    view: req.params.id
  }).exec();

  deleteView
    .then(deleteReputationVotes)
    .then(() => {
      req.flash("success", {
        msg: "View Deleted"
      });
      res.redirect("/politician/" + req.params.shortId + "#views");
    })
    .catch(err => res.send(err));
};

exports.postReputationVote = (req, res) => {
  ViewReputationVote.findOneAndUpdate(
    { view: req.params._id, user: req.user._id },
    {
      user: req.user._id,
      view: req.params._id,
      politician: req.params.shortId,
      vote: req.body.vote
    },
    { upsert: true, new: true }
  )
    .then(ReputationVote => {
      View.updateOne(
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
      res.redirect("/politician/" + req.params.shortId + "#views");
    })
    .catch(err => res.send(err));
};
