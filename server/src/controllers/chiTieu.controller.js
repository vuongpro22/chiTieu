const ChiTieu = require("../models/ChiTieu");
const ChiTieu2 = require("../models/ChiTieu2");
const User = require("../models/User");

function parseYyyyMmDd(dateStr) {
  // dateStr: yyyy-MM-dd
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

async function getAllChiTieu(req, res, next) {
  try {
    const items = await ChiTieu.find({}).sort({ id: 1 }).lean();
    res.json(
      items.map((it) => {
        delete it._id;
        delete it.__v;
        if (it.giaTien && it.giaTien.toString) it.giaTien = Number.parseFloat(it.giaTien.toString());
        return it;
      })
    );
  } catch (e) {
    next(e);
  }
}

async function createChiTieu(req, res, next) {
  try {
    const payload = req.body ?? {};
    const doc = new ChiTieu({
      ngay: payload.ngay ? new Date(payload.ngay) : undefined,
      nguoiMua: payload.nguoiMua,
      moTa: payload.moTa,
      giaTien: payload.giaTien,
      vuong: Boolean(payload.vuong),
      quan: Boolean(payload.quan),
      cuong: Boolean(payload.cuong)
    });
    const saved = await doc.save();
    res.json(saved.toJSON());
  } catch (e) {
    next(e);
  }
}

async function deleteChiTieuById(req, res, next) {
  try {
    const id = Number.parseInt(req.params.id, 10);
    await ChiTieu.deleteOne({ id });
    res.json({});
  } catch (e) {
    next(e);
  }
}

async function clearAllChiTieu(req, res, next) {
  try {
    const all = await ChiTieu.find({}).lean();
    for (const c of all) {
      const backup = new ChiTieu2({
        ngay: c.ngay,
        nguoiMua: c.nguoiMua != null ? String(c.nguoiMua) : null,
        moTa: c.moTa,
        giaTien: c.giaTien,
        vuong: c.vuong,
        quan: c.quan,
        cuong: c.cuong
      });
      // eslint-disable-next-line no-await-in-loop
      await backup.save();
    }
    await ChiTieu.deleteMany({});
    res.json({});
  } catch (e) {
    next(e);
  }
}

async function totalByBuyer(req, res, next) {
  try {
    const grouped = await ChiTieu.aggregate([
      {
        $group: {
          _id: "$nguoiMua",
          total: { $sum: { $toDouble: "$giaTien" } }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const buyerIds = grouped.map((g) => g._id).filter((x) => x != null);
    const users = await User.find({ id: { $in: buyerIds } }).lean();
    const nameById = new Map(users.map((u) => [u.id, u.fullname]));

    res.json(
      grouped.map((g) => ({
        buyerId: g._id,
        buyerName: nameById.get(g._id) ?? "Unknown",
        total: g.total
      }))
    );
  } catch (e) {
    next(e);
  }
}

async function chiTieu2ByDateRange(req, res, next) {
  try {
    const fromParts = parseYyyyMmDd(req.query.from);
    const toParts = parseYyyyMmDd(req.query.to);
    if (!fromParts || !toParts) return res.status(400).json({ message: "Invalid date range" });

    const from = startOfDayUtc(fromParts);
    const to = endOfDayUtc(toParts);

    const items = await ChiTieu2.find({ ngay: { $gte: from, $lte: to } })
      .sort({ ngay: 1, id: 1 })
      .lean();

    res.json(
      items.map((it) => {
        delete it._id;
        delete it.__v;
        if (it.giaTien && it.giaTien.toString) it.giaTien = Number.parseFloat(it.giaTien.toString());
        return it;
      })
    );
  } catch (e) {
    next(e);
  }
}

module.exports = {
  getAllChiTieu,
  createChiTieu,
  deleteChiTieuById,
  clearAllChiTieu,
  totalByBuyer,
  chiTieu2ByDateRange
};

