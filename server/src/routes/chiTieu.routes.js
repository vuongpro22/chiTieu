const express = require("express");
const {
  getAllChiTieu,
  createChiTieu,
  deleteChiTieuById,
  clearAllChiTieu,
  totalByBuyer,
  chiTieu2ByDateRange
} = require("../controllers/chiTieu.controller");

const router = express.Router();

router.get("/chi-tieu", getAllChiTieu);
router.post("/chi-tieu", createChiTieu);
router.delete("/chi-tieu/clear-all", clearAllChiTieu);
router.delete("/chi-tieu/:id(\\d+)", deleteChiTieuById);
router.get("/chi-tieu/total-by-buyer", totalByBuyer);
router.get("/chi-tieu/chi-tieu2", chiTieu2ByDateRange);

module.exports = router;

