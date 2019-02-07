const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ViewSchema = new mongoose.Schema(
  {
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    politician: {
      type: String,
      ref: "Politician",
      required: true
    },
    title: { type: String, required: true },
    description: { type: String, required: true },
    source: { type: String, required: true },

    reputationVote: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ViewReputationVote"
      }
    ]
  },
  { timestamps: true }
);

const View = mongoose.model("View", ViewSchema);

module.exports = View;
