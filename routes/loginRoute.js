const express = require("express");
const controller = require("../Controller/loginController");
const { loginArray } = require("./../Middlewares/validations/loginValidation");
const validationResult = require("../Middlewares/validations/validationResult");
const router = express.Router();

router
  .route("/login")
  .get(controller.isLoggedIn)
  .post(loginArray, validationResult, controller.isAuthenticated);

module.exports = router;
