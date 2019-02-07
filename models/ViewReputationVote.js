const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ViewReputationVoteSchema = new mongoose.Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  view: { type: Schema.Types.ObjectId, ref: "View", required: true },
  politician: {
    type: String,
    ref: "Politician",
    required: true
  },
  vote: Number
});

const ViewReputationVote = mongoose.model(
  "ViewReputationVote",
  ViewReputationVoteSchema
);

module.exports = ViewReputationVote;
