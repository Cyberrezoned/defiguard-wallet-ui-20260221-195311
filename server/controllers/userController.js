const User = require("../models/userModel");
//const Room = require("../models/roomModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

/**
 * @desc authenticate user (login)
 * @route GET /api/users/login
 * @access public
 */
module.exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user)
      return res.json({ msg: "Incorrect Username or Password", status: false });

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid)
      return res.json({ 
        msg: "Incorrect Username or Password", 
        status: false 
      });

    delete user.password;

    return res.json({ status: true, user });
  } 
  catch (ex) {
    next(ex);
  }
};

/**
 * @desc Register new user
 * @route GET /api/users/
 * @access public
 */
module.exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const usernameCheck = await User.findOne({ username });

    if (usernameCheck)
      return res.json({ msg: "Username already used", status: false });

    const emailCheck = await User.findOne({ email });

    if (emailCheck)
      return res.json({ msg: "Email already used", status: false });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      username,
      password: hashedPassword,
    });
    delete user.password;

    return res.json({ status: true, user });
  } 
  catch (ex) {
    next(ex);
  }
};

/**
 * @desc get currently authenticated user (login)
 * @route GET /api/users/me
 * @access private
 */
module.exports.getCurrentUser = async (req, res) => {
  try {
    const responseData = req.user;

    return res.json({ status: true, user: responseData });
  }
  catch (ex) {
    next(ex);
  }
};

/**
 * @desc get all user (login)
 * @route GET /api/users
 * @access private
 */
module.exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({ _id: { $ne: req.params.id } }).select([
      "email",
      "username",
      "avatarImage",
      "_id",
    ]);
    return res.json(users);
  } 
  catch (ex) {
    next(ex);
  }
};

module.exports.setAvatar = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const avatarImage = req.body.image;
    const userData = await User.findByIdAndUpdate(
      userId,
      {
        isAvatarImageSet: true,
        avatarImage,
      },
      { new: true }
    );
    return res.json({
      isSet: userData.isAvatarImageSet,
      image: userData.avatarImage,
    });
  } 
  catch (ex) {
    next(ex);
  }
};

module.exports.logOut = (req, res, next) => {
  try {
    if (!req.params.id) return res.json({ msg: "User id is required " });
    onlineUsers.delete(req.params.id);
    return res.status(200).send();
  } 
  catch (ex) {
    next(ex);
  }
};

/**
 * @desc generate JWT
 */
module.exports.generateToken = (id) => {
  const options = {
    expiresIn: "1d",
  };
  return jwt.sign({ id }, process.env.JWT_SECRET, options);
};


