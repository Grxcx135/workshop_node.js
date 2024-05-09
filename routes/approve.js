var express = require("express");
var router = express.Router();
const users = require("../models/user_model");

router.put("/:id", async function (req, res, next) {
  try {
    // let status = req.body.status;

    const astat = await users.findById(req.params.id);
    const newS = !astat.status;
    let update = await users.findByIdAndUpdate(
      req.params.id,
      { status: newS },
      { new: true }
    );

    return res.status(201).send({
      data: update.status,
      message: update.firstname + " approve success",
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
