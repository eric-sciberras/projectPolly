const mongoose = require("mongoose");
const shortid = require("shortid");
const promise = require("./Promise");
const Schema = mongoose.Schema;

const PoliticianSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: shortid.generate
    },
    name: { type: String, unique: true },
    electorate: String,
    title: String,
    twitterName: String,
    politicalParty: String,
    originalAuthor: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    //picture: String,

    characteristics: [{ type: Schema.Types.ObjectId, ref: "Characteristics" }],

    promises: [{ type: Schema.Types.ObjectId, ref: "Promise" }]
  },
  { timestamps: true }
);

const Politician = mongoose.model("Politician", PoliticianSchema);

module.exports = Politician;
