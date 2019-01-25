const mongoose = require("mongoose");
const shortid = require("shortid");
// const scrapeTwitter = require("scrape-twitter");

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

    website: String,
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

    // promise: [
    //   {
    //     body: String,
    //     source: String,
    //     protected: Boolean,
    //     user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
    //   }
    // ],
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

// //Characteristics Average
// PoliticianSchema.virtual("averageCharacteristics").get(function() {
//   let totalVotes = [0, 0, 0, 0, 0];
//   //let totalscores = [0, 0, 0, 0, 0];

//   let averageCharacteristics = {
//     trustworthy: 0,
//     accountable: 0,
//     empathetic: 0,
//     knowledgeable: 0,
//     respectful: 0
//   };
//   // this.characteristics = array of characteristics (all users ratings for all characteristics)
//   // characteristicSet = a users rating for all characteristics
//   // characteristic[i] = a users rating for a single characteristic
//   for (characteristicSet in this.characteristics) {
//     for (let i = 0; i < characteristicSet.length; i++) {
//       if (characteristicSet != -1) {
//         averageCharacteristics[i] += characteristicSet[i];
//         totalVotes[i] += 1;
//       }
//     }
//   }
//   for (let i = 0; i < averageCharacteristics.length; i++) {
//     // div by 0 here
//     if (totalVotes[i] == 0) {
//       averageCharacteristics[i] = 0;
//     } else {
//       averageCharacteristics[i] = averageCharacteristics[i] / totalVotes[i];
//     }
//   }
//   return averageCharacteristics;
// });

PoliticianSchema.set("toObject", { virtuals: true });
PoliticianSchema.set("toJSON", { virtuals: true });

const Politician = mongoose.model("Politician", PoliticianSchema);

module.exports = Politician;
