const { promisify } = require("util");
const Politician = require("../models/Politician");
const User = require("../models/User");

exports.postCharacteristics = (req, res, next) => {
  console.log(req.params.id);
  Politician.findOne({ _id: req.params.id }, function postResponse(
    err,
    politician
  ) {
    if (err) {
      res.send(err);
    }
    // console.log(politician);
    let found = false;
    // Look check to see if there is already an entry made by the user
    // if there is; update it
    if (politician.characteristics) {
      for (var i = 0; i < politician.characteristics.length; i++) {
        if (politician.characteristics[i].userId == req.user._id) {
          // Found it
          found = true;
          break;
        }
      }
    }
    // console.log("USER ID" + req.user._id);
    let newCharacteristics = {
      trustworthy: req.body.trustworthy,
      accountable: req.body.accountable,
      empathetic: req.body.empathetic,
      knowledgeable: req.body.knowledgeable,
      respectful: req.body.respectful,
      userId: req.user._id
    };
    // No entry so lets make one
    if (found) {
      politician.characteristics[i] = newCharacteristics;
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
