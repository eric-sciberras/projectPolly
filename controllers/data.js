const { promisify } = require("util");
const Politician = require("../models/Politician");
const PromiseMade = require("../models/Promise");
// const User = require("../models/User");
const findUsersRating = require("../utils/findUsersRating");

exports.postCharacteristics = (req, res, next) => {
  Politician.findOne({ shortId: req.params.shortId }, function postResponse(
    err,
    politician
  ) {
    if (err) {
      res.send(err);
    }
    // Look check to see if there is already an entry made by the user
    // if there is; update it
    let index = findUsersRating(politician, req.user._id);

    let newCharacteristics = {
      trustworthy: req.body.trustworthy,
      accountable: req.body.accountable,
      empathetic: req.body.empathetic,
      knowledgeable: req.body.knowledgeable,
      respectful: req.body.respectful,
      userId: req.user._id
    };
    // No entry so lets make one
    if (index != -1) {
      politician.characteristics[index] = newCharacteristics;
    } else {
      politician.characteristics.push(newCharacteristics);
    }
    politician.save();

    req.flash("success", {
      msg: "Score is sucessfully submitted"
    });
    res.redirect("/politician/" + req.params.shortId);
  });
};

exports.postPromise = (req, res, next) => {
  const promiseMade = new PromiseMade({
    title: req.body.promiseTitle,
    description: req.body.promiseDescription,
    source: req.body.promiseSource,
    user_id: req.user._id,
    politician_id: req.params.shortId
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
