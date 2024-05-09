var express = require("express");
var router = express.Router();
var multer = require("multer");
var bcypt = require("bcrypt");
const Users = require("../models/user_model");
const jwt = require("jsonwebtoken");
const verifyToken = require("../middleware/jwt_decode");

// /* ------- Config Upload file ------- */
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, './public/images')
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
//     cb(null, uniqueSuffix + '_' + file.originalname)
//   }
// })
// const upload = multer({ storage: storage })

/* ------- Start API Users ------- */
/* GET users listing. */
router.get("/", verifyToken, async function (req, res, next) {
  try {
    const user = await Users.find();
    return res.status(200).send({
      data: user,
      message: "success",
      success: true,
    });
  } catch (error) {
    res.status(500).send({
      message: "fail",
      success: false,
    });
  }
});

/* POST */
router.post("/", async function (req, res, next) {
  try {
    let { username, password, firstname, lastname, email, role, status } =
      req.body;
    let hashPassword = await bcypt.hash(password, 10);

    const newUser = new Users({
      username,
      password: hashPassword,
      firstname,
      lastname,
      email,
      role,
      status,
    });

    let user = await newUser.save();

    return res.status(200).send({
      data: {
        _id: user._id,
        username,
        firstname,
        lastname,
        email,
        role,
        status,
      },
      message: "create success",
      success: true,
    });
  } catch (error) {
    res.status(500).send({
      message: "create fail",
      success: false,
    });
  }
});

/* PUT */
router.put("/:id", async function (req, res, next) {
  try {
    let {
      username,
      password: hashPassword,
      firstname,
      lastname,
      email,
      role,
    } = req.body;

    let update = await Users.findByIdAndUpdate(
      req.params.id,
      { username, password: hashPassword, firstname, lastname, email, role },
      { new: true }
    );

    res.status(200).send(update);
  } catch (error) {
    res.status(500).send(error.toString());
  }
});

/* DELETE */
router.delete("/:id", async function (req, res, next) {
  try {
    let delete_user = await Users.findByIdAndDelete(req.params.id);

    res.status(200).send(delete_user);
  } catch (error) {
    res.status(500).send(error.toString());
  }
});

module.exports = router;
