const mongoose = require("mongoose");
const Teacher = mongoose.model("teachers");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

exports.isLoggedIn = (req, res, next) => {
  if (req.get("authorization")) {
    try {
      const token = req.get("authorization").split(" ")[1];
      req.decodedToken = jwt.verify(token, process.env.secretKey);
      res.status(200).json("Please log out first");
    } catch (error) {
      next(error);
    }
  }
};

exports.signUp = (req, res, next) => {
  const encryptedPassword = bcrypt.hashSync(req.body.password, 10);
  const teacherBeingAdded = new Teacher({
    _id: new mongoose.Types.ObjectId(),
    fullName: req.body.fullName,
    userName: req.body.userName,
    password: encryptedPassword,
    email: req.body.email,
    image: req.body.image,
    role: req.body.role,
  });
  teacherBeingAdded
    .save()
    .then((object) => {
      res.status(201).json(object);
    })
    .catch((error) => next(error));
};
