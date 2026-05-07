const mongoose = require("mongoose");

const CounterSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    seq: { type: Number, required: true, default: 0 }
  },
  { collection: "counters", timestamps: true }
);

const Counter = mongoose.model("Counter", CounterSchema);

async function getNextSequence(name) {
  const doc = await Counter.findOneAndUpdate(
    { name },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  ).lean();
  return doc.seq;
}

module.exports = { Counter, getNextSequence };

