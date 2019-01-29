const mongoose = require("mongoose");
const shortid = require("shortid");

const PoliticianSchema = new mongoose.Schema(
  {
    shortId: {
      type: String,
      default: shortid.generate
    },
    name: { type: String, unique: true },
    electorate: String,
    title: String,
    twitterName: String,
    politicalParty: String,

    // website: String,
    picture: String,

    characteristics: [
      {
        trustworthy: { type: Number, min: -1, max: 10, default: -1 },
        accountable: { type: Number, min: -1, max: 10, default: -1 },
        empathetic: { type: Number, min: -1, max: 10, default: -1 },
        knowledgeable: { type: Number, min: -1, max: 10, default: -1 },
        respectful: { type: Number, min: -1, max: 10, default: -1 },
        userId: { type: String },
        _id: false
      }
    ]

    // view: [
    //   {
    //     body: String,
    //     source: String,
    //     user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
    //   }
    // ]
  },
  { timestamps: true }
);

PoliticianSchema.virtual("averageTrustworthy").get(function() {
  return calculateAverage(this.characteristics, "trustworthy");
});

PoliticianSchema.virtual("averageAccountable").get(function() {
  return calculateAverage(this.characteristics, "accountable");
});

PoliticianSchema.virtual("averageEmpathetic").get(function() {
  return calculateAverage(this.characteristics, "empathetic");
});

PoliticianSchema.virtual("averageKnowledgeable").get(function() {
  return calculateAverage(this.characteristics, "knowledgeable");
});

PoliticianSchema.virtual("averageRespectful").get(function() {
  return calculateAverage(this.characteristics, "respectful");
});

function calculateAverage(characteristicSet, characteristic) {
  let numberOfVotes = 0;
  let totalscore = 0;
  let averageScore = 0;
  if (characteristicSet) {
    for (let i = 0; i < characteristicSet.length; i++) {
      if (characteristicSet[i] != -1) {
        totalscore += characteristicSet[i][characteristic];
        numberOfVotes += 1;
      }
    }
    if (numberOfVotes != 0) {
      averageScore = totalscore / numberOfVotes;
    }
  }
  return averageScore;
}

PoliticianSchema.set("toObject", { virtuals: true });
PoliticianSchema.set("toJSON", { virtuals: true });

const Politician = mongoose.model("Politician", PoliticianSchema);

module.exports = Politician;
