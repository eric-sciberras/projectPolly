const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PromiseVoteSchema = new mongoose.Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  promise: { type: Schema.Types.ObjectId, ref: "Promise", required: true },
  politician: {
    type: String,
    ref: "Politician",
    required: true
  },
  vote: String
});

const PromiseVote = mongoose.model("PromiseVote", PromiseVoteSchema);

module.exports = PromiseVote;
