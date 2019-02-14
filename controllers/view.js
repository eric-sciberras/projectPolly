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
  View.findById(req.params.id, (err, view) => {
    if (err) {
      return next(err);
    }

    if (view) {
      view.title = req.body.viewTitle || "";
      view.description = req.body.viewDescription || "";
      view.source = req.body.viewSource || "";
      if (view.author == req.user.id) {
        view.save(err => {
          req.flash("success", {
            msg: "Promise Updated"
          });
          res.redirect("/politician/" + req.params.shortId + "#views");
        });
      } else {
        req.flash("errors", {
          msg: "You are not authorised to edit this view"
        });
        res.redirect("/politician/" + req.params.shortId + "#views");
      }
    } else {
      req.flash("errors", {
        msg: "View Not Found"
      });
      res.redirect("/politician/" + req.params.shortId + "#views");
    }
  });
};

exports.deleteView = (req, res) => {
  View.findById(req.params.id, (err, view) => {
    if (view) {
      if (view.author == req.user.id) {
        view
          .findByIdAndDelete(req.params.id)
          .then(
            ViewReputationVote.deleteMany({
              view: req.params.id
            }).exec()
          )
          .then(() => {
            req.flash("success", {
              msg: "View Deleted"
            });
            res.redirect("/politician/" + req.params.shortId + "#views");
          })
          .catch(err => res.send(err));
      } else {
        req.flash("errors", {
          msg: "You are not authorised to delete this View"
        });
        res.redirect("/politician/" + req.params.shortId + "#views");
      }
    } else {
      req.flash("errors", {
        msg: "View Not Found"
      });
      res.redirect("/politician/" + req.params.shortId + "#views");
    }
  });
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
