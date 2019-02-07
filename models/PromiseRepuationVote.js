const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PromiseReputationVoteSchema = new mongoose.Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  promise: { type: Schema.Types.ObjectId, ref: "Promise", required: true },
  politician: {
    type: String,
    ref: "Politician",
    required: true
  },
  vote: Number
});

const PromiseReputationVote = mongoose.model(
  "PromiseReputationVote",
  PromiseReputationVoteSchema
);

module.exports = PromiseReputationVote;
