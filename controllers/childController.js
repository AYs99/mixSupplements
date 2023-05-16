const mongoose = require("mongoose");
// require("../Models/childModel");

const Child = mongoose.model("children");
const Class = mongoose.model("classes");

exports.getAllChildren = (req, res, next) => {
  Child.find()
    .then((data) => res.status(200).json(data))
    .catch((error) => next(error));
};

exports.addChild = (req, res, next) => {
  const childBeingAdded = new Child({
    _id: req.body._id,
    fullName: req.body.fullName,
    age: req.body.age,
    level: req.body.level,
    address: req.body.address,
  });
  childBeingAdded
    .save()
    .then((object) => {
      res.status(201).json(object);
    })
    .catch((error) => next(error));
};

exports.updateChild = (req, res, next) => {
  Child.findByIdAndUpdate(req.body._id, req.body)
    .then((object) => {
      res.status(200).json(object);
    })
    .catch((error) => next(error));
};

exports.getChildById = (req, res, next) => {
  Child.findOne({ _id: req.params.id })
    .then((object) => {
      if (object === null) throw new Error("Child is not found");
      res.status(200).json(object);
    })
    .catch((error) => next(error));
};

exports.getChildClassInfo = (req, res, next) => {
  Class.find({ children: req.params.id })
    .then((object) => {
      res.status(200).json(object);
    })
    .catch((error) => next(error));
};

exports.deleteChild = (req, res, next) => {
  Class.updateMany(
    { children: req.body._id },
    { $pull: { children: req.body._id } }
  )
    .then(() => Child.deleteOne({ _id: req.body._id }))
    .then((object) => {
      if (object === null) throw new Error("Child is not found");
      res.status(200).json(object);
    })
    .catch((error) => next(error));
};
