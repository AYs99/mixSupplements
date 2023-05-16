const mongoose = require("mongoose");
// require("../Models/classModel");

const Class = mongoose.model("classes");
const Child = mongoose.model("children");

exports.getAllClasses = (req, res, next) => {
  Class.find()
    .then((data) => res.status(200).json(data))
    .catch((error) => next(error));
};

exports.addClass = (req, res, next) => {
  const classBeingAdded = new Class({
    _id: req.body._id,
    name: req.body.name,
    supervisor: req.body.supervisor,
    children: req.body.children,
  });
  // Child.find(req.body.children)
  //   .then((children) => {
  //     const ok = children.some((child, index, children) =>
  //       children.includes(child)
  //     );
  //     if (ok) return classBeingAdded;
  //     else {
  //       throw new Error(
  //         "not all children exist. please check the added children"
  //       );
  //     }
  //   })
  classBeingAdded
    .save()
    .then((object) => {
      res.status(201).json(object);
    })
    .catch((error) => next(error));
};

exports.updateClass = (req, res, next) => {
  Class.findByIdAndUpdate(req.body._id, req.body)
    .then((object) => {
      res.status(200).json(object);
    })
    .catch((error) => next(error));
};

exports.getClassById = (req, res, next) => {
  Class.findOne({ _id: req.params.id })
    .then((object) => {
      if (object === null) throw new Error("Class is not found");
      res.status(200).json(object);
    })
    .catch((error) => next(error));
};

exports.deleteClass = (req, res, next) => {
  Class.deleteOne({ _id: req.body._id })
    .then((object) => res.status(200).json(object))
    .catch((error) => next(error));
};

exports.getClassChildrenInfo = (req, res, next) => {
  Class.findOne({ _id: req.params.id })
    .populate("children")
    .then((object) => {
      if (
        req.decodedToken.id == object.supervisor ||
        req.decodedToken.role == "admin"
      )
        res.status(200).json(object);
      else {
        const error = new Error("not authorized");
        error.status = 403;
        throw error;
      }
    })
    .catch((error) => next(error));
};

exports.getClassSupervisorInfo = (req, res, next) => {
  Class.findOne({ _id: req.params.id }, { name: 1, supervisor: 1, _id: 0 })
    .populate("supervisor")
    .then((object) => res.status(200).json(object))
    .catch((error) => next(error));
};
