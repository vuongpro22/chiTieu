const express = require("express");
const { createLichSu, getAllLichSu, deleteLichSu } = require("../controllers/lichSuChiTieu.controller");

const router = express.Router();

router.post("/lich-su-chi-tieu", createLichSu);
router.get("/lich-su-chi-tieu", getAllLichSu);
router.delete("/lich-su-chi-tieu/:id", deleteLichSu);

module.exports = router;

