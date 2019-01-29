const { promisify } = require("util");
const Politician = require("../models/Politician");
const PromiseMade = require("../models/Promise");
const toTitleCase = require("../utils/toTitleCase");
const findUsersRating = require("../utils/findUsersRating");

/** Post a politician to the Database */
exports.postPolitician = (req, res, next) => {
  const politician = new Politician({
    name: req.body.name,
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
      return res.redirect("/politician");
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

exports.getPolitician = (req, res) => {
  res.render("addPolitician", {
    title: "Politician"
  });
};

/** Return A list of Politicians For search query */
exports.getListOfPolitician = (req, res, next) => {
  Politician.find({}, "name shortId", function postResponse(err, politicians) {
    if (err) res.send(err);
    res.json(politicians);
  });
};

/** Get a Politicians profile page */
exports.getPoliticianPage = (req, res) => {
  Politician.findOne({ shortId: req.params.shortId }, function postResponse(
    err,
    politician
  ) {
    if (err) {
      res.send(err);
    }
    let index = findUsersRating(politician, req.user._id);
    let usersRating = {
      trustworthy: -1,
      accountable: -1,
      empathetic: -1,
      knowledgeable: -1,
      respectful: -1,
      userId: req.user._id
    };
    if (index != -1) {
      usersRating = politician.characteristics[index];
    }
    // Note: promiseMade is the schema for promises made by politicians
    // not the javascript promises asynchronous stuff
    PromiseMade.find(
      { politician_id: req.params.shortId },
      function postResponse(err, promisesMade) {
        res.render("politician", {
          title: politician.name,
          politician,
          usersRating,
          promisesMade
        });
      }
    );
  });
};
