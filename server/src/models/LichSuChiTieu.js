const mongoose = require("mongoose");
const { getNextSequence } = require("./Counter");

const LichSuChiTieuSchema = new mongoose.Schema(
  {
    id: { type: Number, unique: true, index: true },
    tuNgay: { type: String, required: true }, // yyyy-MM-dd
    denNgay: { type: String, required: true }, // yyyy-MM-dd
    tongChiTieu: { type: mongoose.Schema.Types.Decimal128, required: true },
    tongVuong: { type: mongoose.Schema.Types.Decimal128, required: true },
    tongCuong: { type: mongoose.Schema.Types.Decimal128, required: true },
    tongQuan: { type: mongoose.Schema.Types.Decimal128, required: true },
    ngayTao: { type: Date }
  },
  { collection: "lich_su_chi_tieu", timestamps: false }
);

LichSuChiTieuSchema.pre("save", async function preSave(next) {
  try {
    if (!this.ngayTao) this.ngayTao = new Date();
    if (!this.id) this.id = await getNextSequence("lich_su_chi_tieu");
    next();
  } catch (e) {
    next(e);
  }
});

LichSuChiTieuSchema.set("toJSON", {
  transform: (_doc, ret) => {
    for (const k of ["tongChiTieu", "tongVuong", "tongCuong", "tongQuan"]) {
      const v = ret[k];
      if (v && typeof v === "object" && v.toString) ret[k] = Number.parseFloat(v.toString());
    }
    if (ret.ngayTao instanceof Date) ret.ngayTao = ret.ngayTao.toISOString();
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

module.exports = mongoose.model("LichSuChiTieu", LichSuChiTieuSchema);

