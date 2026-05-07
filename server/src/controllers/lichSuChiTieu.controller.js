const LichSuChiTieu = require("../models/LichSuChiTieu");
const ChiTieu2 = require("../models/ChiTieu2");

function parseYyyyMmDd(dateStr) {
  const [y, m, d] = String(dateStr).split("-").map((x) => Number.parseInt(x, 10));
  if (!y || !m || !d) return null;
  return { y, m, d };
}

function startOfDayUtc({ y, m, d }) {
  return new Date(Date.UTC(y, m - 1, d, 0, 0, 0, 0));
}

function endOfDayUtc({ y, m, d }) {
  return new Date(Date.UTC(y, m - 1, d, 23, 59, 59, 999));
}

async function createLichSu(req, res, next) {
  try {
    const payload = req.body ?? {};
    const doc = new LichSuChiTieu({
      tuNgay: payload.tuNgay,
      denNgay: payload.denNgay,
      tongChiTieu: payload.tongChiTieu,
      tongVuong: payload.tongVuong,
      tongCuong: payload.tongCuong,
      tongQuan: payload.tongQuan,
      ngayTao: payload.ngayTao ? new Date(payload.ngayTao) : undefined
    });
    const saved = await doc.save();
    res.json(saved.toJSON());
  } catch (e) {
    next(e);
  }
}

async function getAllLichSu(req, res, next) {
  try {
    const items = await LichSuChiTieu.find({}).sort({ id: 1 }).lean();
    res.json(
      items.map((it) => {
        delete it._id;
        delete it.__v;
        for (const k of ["tongChiTieu", "tongVuong", "tongCuong", "tongQuan"]) {
          const v = it[k];
          if (v && v.toString) it[k] = Number.parseFloat(v.toString());
        }
        if (it.ngayTao instanceof Date) it.ngayTao = it.ngayTao.toISOString();
        return it;
      })
    );
  } catch (e) {
    next(e);
  }
}

async function deleteLichSu(req, res, next) {
  try {
    const pass = String(req.query.pass ?? "");
    if (pass !== "251272") {
      return res.status(500).json({ message: "Sai pass!" });
    }

    const id = Number.parseInt(req.params.id, 10);
    const lichSu = await LichSuChiTieu.findOne({ id }).lean();
    if (lichSu) {
      const fromParts = parseYyyyMmDd(lichSu.tuNgay);
      const toParts = parseYyyyMmDd(lichSu.denNgay);
      if (fromParts && toParts) {
        const from = startOfDayUtc(fromParts);
        const to = endOfDayUtc(toParts);
        await ChiTieu2.deleteMany({ ngay: { $gte: from, $lte: to } });
      }
    }

    await LichSuChiTieu.deleteOne({ id });
    res.json({});
  } catch (e) {
    next(e);
  }
}

module.exports = { createLichSu, getAllLichSu, deleteLichSu };

