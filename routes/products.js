var express = require("express");
var router = express.Router();
const productModel = require("../models/product");
const mongoose = require("mongoose");
const ordersModel = require("../models/ordermodel");
const jwt = require("jsonwebtoken");

router.post("/", async function (req, res, next) {
  try {
    const { product_name, price, amount } = req.body;
    let newProduct = new productModel({
      product_name: product_name,
      price: price,
      amount: amount,
    });
    let product = await newProduct.save();
    return res.status(201).send({
      data: product,
      message: "create success",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: "create fail",
      success: false,
    });
  }
});

router.get("/", async function (req, res, next) {
  try {
    let product = await productModel.find();
    return res.status(201).send({
      data: product,
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

router.get("/:id", async function (req, res, next) {
  try {
    let id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send({
        message: "id Invalid",
        success: false,
        error: ["id is not a ObjectId"],
      });
    }

    let product = await productModel.findById(id);
    return res.status(200).send({
      data: product,
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

router.put("/:id", async function (req, res, next) {
  try {
    let id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send({
        message: "id Invalid",
        success: false,
        error: ["id is not a ObjectId"],
      });
    }
    await productModel.updateOne(
      { _id: new mongoose.Types.ObjectId(id) },
      { $set: req.body }
    );

    let product = await productModel.findById(id);
    return res.status(201).send({
      data: product,
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

router.delete("/:id", async function (req, res, next) {
  try {
    let id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send({
        message: "id Invalid",
        success: false,
        error: ["id is not a ObjectId"],
      });
    }
    await productModel.deleteOne({ _id: new mongoose.Types.ObjectId(id) });
    let product = await productModel.find();
    return res.status(200).send({
      // data: product,
      message: "delete success",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: "create fail",
      success: false,
    });
  }
});

router.post("/:id/order", async function (req, res, next) {
  try {
    const { amount } = req.body;
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send({
        message: "id Invalid",
        success: false,
        error: ["id is not a ObjectId"],
      });
    }

    const token = req.headers.authorization.split("Bearer ")[1];
    const decoded_token = jwt.decode(token);
    console.log(decoded_token);

    let product = await productModel.findById(id);
    let newOrder = new ordersModel({
      username: decoded_token.firstname,
      products_name: product.product_name,
      amount: amount,
    });
    let orders = await newOrder.save();
    return res.status(201).send({
      data: orders,
      message: "create success",
      success: true,
    });
  } catch (error) {
    return res.status(500).send({
      message: "create fail",
      success: false,
    });
  }
});

router.get("/:id/order", async function (req, res, next) {
  try {
    let id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send({
        message: "id Invalid",
        success: false,
        error: ["id is not a ObjectId"],
      });
    }
    let product = await productModel.findById(id);
    let orderShow = await ordersModel.find({
      products_name: product.product_name,
    });
    return res.status(200).send({
      data: orderShow,
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
