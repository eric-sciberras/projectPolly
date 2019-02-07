const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PromiseSchema = new mongoose.Schema(
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

    promiseVote: [{ type: mongoose.Schema.Types.ObjectId, ref: "PromiseVote" }],

    reputationVote: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "PromiseReputationVote"
      }
    ]
  },
  { timestamps: true }
);

const Promise = mongoose.model("Promise", PromiseSchema);

module.exports = Promise;
