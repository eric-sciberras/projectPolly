const Characteristics = require("../models/Characteristics");

exports.postCharacteristics = (req, res, next) => {
  let newCharacteristicSet = {
    trustworthy: req.body.trustworthy,
    accountable: req.body.accountable,
    empathetic: req.body.empathetic,
    knowledgeable: req.body.knowledgeable,
    respectful: req.body.respectful,
    user: req.user._id,
    politician: req.params.shortId
  };

  /* 
  since forms need a value, no vote for a characteristic is a "-1"
  However this means that an incorrect average is calculated.
  To fix this whenever a post is made "-1" is mapped to null and when the
  avg is taken that value is ignored.
  */
  Object.keys(newCharacteristicSet).map(function(key, index) {
    if (newCharacteristicSet[key] == -1) {
      newCharacteristicSet[key] = "";
    }
  });
  let updateCharacteristics = Characteristics.findOneAndUpdate(
    { politician: req.params.shortId, user: req.user._id },
    newCharacteristicSet,
    { upsert: true }
  ).exec();

  updateCharacteristics
    .then(() => {
      req.flash("success", {
        msg: "Score is sucessfully submitted"
      });
      res.redirect("/politician/" + req.params.shortId);
    })
    .catch(err => res.send(err));
};
