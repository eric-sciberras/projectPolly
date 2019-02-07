const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CharacteristicsSchema = new mongoose.Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  politician: {
    type: String,
    ref: "Politician",
    required: true
  },
  trustworthy: { type: Number, min: -1, max: 10, default: "" },
  accountable: { type: Number, min: -1, max: 10, default: "" },
  empathetic: { type: Number, min: -1, max: 10, default: "" },
  knowledgeable: { type: Number, min: -1, max: 10, default: "" },
  respectful: { type: Number, min: -1, max: 10, default: "" }
});

const Characteristics = mongoose.model(
  "Characteristics",
  CharacteristicsSchema
);

module.exports = Characteristics;
