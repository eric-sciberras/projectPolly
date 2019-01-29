const mongoose = require("mongoose");

const PromiseSchema = new mongoose.Schema(
  {
    user_id: { type: String, ref: "User", required: true },
    politician_id: { type: String, ref: "Politician", required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    source: { type: String, required: true },

    // One promise can have many votes from other users
    // Votes allow users to decide If a promise was
    // delivered, partially delivered or broken
    votes: [
      {
        user_id: { type: String, ref: "User", required: true },
        vote: Number
      }
    ],

    // Users can upvote or downvote the promise entry itself if they feel
    // It contains errors or is biased
    repuation: [
      {
        user_id: { type: String, ref: "User", required: true },
        reputation: Number
      }
    ]
  },
  { timestamps: true }
);

// just a reminder that i need to set these to enable these so the
// virtual properties (if any) are included when I retrieve a promise

// PromiseSchema.set("toObject", { virtuals: true });
// PromiseSchema.set("toJSON", { virtuals: true });

const Promise = mongoose.model("Promise", PromiseSchema);

module.exports = Promise;
