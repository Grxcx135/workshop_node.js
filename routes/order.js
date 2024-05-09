var express = require("express");
var router = express.Router();

const ordersModel = require("../models/ordermodel");

router.get("/", async function (req, res, next) {
  try {
    let order = await ordersModel.find();
    return res.status(201).send({
      data: order,
      message: "success",
      success: true,
    });
  } catch (error) {
    return res.status(500).send({
      message: "create fail",
      success: false,
    });
  }
});

module.exports = router;
