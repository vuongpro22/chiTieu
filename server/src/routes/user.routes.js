const express = require("express");
const { getAllUsers, login, getUserById } = require("../controllers/user.controller");

const router = express.Router();

router.post("/user/login", login);
router.get("/user", getAllUsers);
router.get("/user/:id", getUserById);

module.exports = router;

