const mongoose = require("mongoose");
const { getNextSequence } = require("./Counter");

const ChiTieuSchema = new mongoose.Schema(
  {
    id: { type: Number, unique: true, index: true },
    ngay: { type: Date, required: true },
    nguoiMua: { type: Number, required: true, index: true },
    moTa: { type: String, required: true, trim: true },
    giaTien: { type: mongoose.Schema.Types.Decimal128, required: true },
    vuong: { type: Boolean, default: false },
    quan: { type: Boolean, default: false },
    cuong: { type: Boolean, default: false }
  },
  { collection: "chi_tieu", timestamps: false }
);

ChiTieuSchema.pre("save", async function preSave(next) {
  try {
    if (!this.id) this.id = await getNextSequence("chi_tieu");
    next();
  } catch (e) {
    next(e);
  }
});

ChiTieuSchema.set("toJSON", {
  transform: (_doc, ret) => {
    if (ret.giaTien && typeof ret.giaTien === "object" && ret.giaTien.toString) {
      ret.giaTien = Number.parseFloat(ret.giaTien.toString());
    }
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

module.exports = mongoose.model("ChiTieu", ChiTieuSchema);

