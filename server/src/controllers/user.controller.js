const User = require("../models/User");

async function getAllUsers(req, res, next) {
  try {
    const users = await User.find({}).sort({ id: 1 }).lean();
    res.json(
      users.map((u) => {
        delete u._id;
        delete u.__v;
        return u;
      })
    );
  } catch (e) {
    next(e);
  }
}

async function login(req, res, next) {
  try {
    const { username, password } = req.body ?? {};
    const user = await User.findOne({ username, pass: password }).lean();

    if (user) {
      delete user._id;
      delete user.__v;
      return res.json({
        success: true,
        user,
        message: "Đăng nhập thành công"
      });
    }

    return res.json({
      success: false,
      message: "Tên đăng nhập hoặc mật khẩu không đúng"
    });
  } catch (e) {
    next(e);
  }
}

async function getUserById(req, res, next) {
  try {
    const id = Number.parseInt(req.params.id, 10);
    const user = await User.findOne({ id }).lean();
    if (!user) return res.status(404).json({ message: "Not found" });
    delete user._id;
    delete user.__v;
    return res.json(user);
  } catch (e) {
    next(e);
  }
}

module.exports = { getAllUsers, login, getUserById };

