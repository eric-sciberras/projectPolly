const { promisify } = require("util");
const Politician = require("../models/Politician");
const User = require("../models/User");
const findUsersRating = require("../utils/findUsersRating");

exports.postCharacteristics = (req, res, next) => {
  console.log(req.params.id);
  Politician.findOne({ _id: req.params.id }, function postResponse(
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
    res.redirect("/politician/" + req.params.id);
  });
};
