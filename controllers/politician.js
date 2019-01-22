const { promisify } = require('util');
const Politician = require('../models/Politician');
const toTitleCase = require('../utils/toTitleCase');


/** Post a politician to the Database */
exports.postPolitician = (req, res, next) => {
  const politician = new Politician({
    name: req.body.name
  });
  Politician.findOne({ name: req.body.name }, (err, existingPolitician) => {
    if (err) { return next(err); }
    if (existingPolitician) {
      req.flash('errors', { msg: 'Politician Already Exists' });
      return res.redirect('/politician');
    }
    politician.save((err) => {
      if (err) { return next(err); }
        res.redirect('/politician');
      req.flash('successMessage', 'Politician Successfully Added');
    });
  });
};
/** Get a Politicians profile page */
exports.getPolitician = (req, res) => {
  res.render('addPolitician', {
    title: 'Politician'
  });
};
    


/** Return A list of Politicians For search query */
exports.getListOfPolitician = (req, res, next) => {
  Politician.find({},'name _id',function postResponse(err, politicians){
    if (err)
      res.send(err);
    res.json(politicians);
  }); 
};

// /** Return A list of Politicians For search query */
// exports.getListOfPolitician = (req, res, next) => {
//   Politician.find({},function postResponse(err, politicians){
//     if (err)
//       res.send(err);
//     let names = []
//     for (let i = 0; i < politicians.length; i++){
//       names.push(politicians[i].name);
//     }
//     res.json(names);
//   }); 
// };

/** Get a Politicians profile page */
exports.getPoliticianPage = (req, res) => {
  res.render('politician', {
    title: 'Politician'
  });
};
        