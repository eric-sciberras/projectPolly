const mongoose = require('mongoose');
const shortid = require('shortid');

const PoliticianSchema = new mongoose.Schema({
  _id: {
  'type': String,
  'default': shortid.generate
  },
  name: { type: String, unique: true },
  electorate: String
  // website: String,
  // picture: String,
  // politicalParty: String,

  // promises: {
  //     promise: String
  // },

}, { timestamps: true });

const Politician = mongoose.model('Politician', PoliticianSchema);

module.exports = Politician;