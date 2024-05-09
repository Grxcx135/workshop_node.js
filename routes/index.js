var express = require("express");
var router = express.Router();
const users = require("../models/user_model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

router.post("/login", async function (req, res, next) {
  try {
    let { password, username } = req.body;
    let user = await users.findOne({
      username: username,
    });
    if (!user) {
      return res.status(500).send({
        message: "username fail!!",
        success: false,
      });
    }
    const checkPassword = await bcrypt.compare(password, user.password);
    if (!checkPassword) {
      return res.status(500).send({
        message: "password fail!1",
        success: false,
      });
    }

    const { _id, firstname, lastname, role, status } = user;
    const token = jwt.sign(
      {
        _id: user._id,
        firstname: user.firstname,
        lastname: user.lastname,
        role: user.role,
        status: user.status,
      },
      process.env.JWT_KEY
    );

    if (user.status != true) {
      return res.status(200).send({
        token: token,
        message: "wait for admin approve",
      });
    }

    return res.status(201).send({
      data: { token: token },
      message: "login success",
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      message: "login fail",
      success: false,
    });
  }
});

module.exports = router;
