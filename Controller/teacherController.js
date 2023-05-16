const mongoose = require("mongoose");
// require("../Models/teacherModel");
// require("../Models/classModel");

const Teacher = mongoose.model("teachers");
const Class = mongoose.model("classes");

exports.getAllTeachers = (req, res, next) => {
  Teacher.find()
    .then((data) => res.status(200).json(data))
    .catch((error) => next(error));
};

exports.addTeacher = (req, res, next) => {
  const teacherBeingAdded = new Teacher({
    _id: new mongoose.Types.ObjectId(),
    fullName: req.body.fullName,
    userName: req.body.userName,
    password: req.body.password,
    email: req.body.email,
    image: req.body.image,
    role: "teacher",
  });
  teacherBeingAdded
    .save()
    .then((object) => {
      res.status(201).json(object);
    })
    .catch((error) => next(error));
};

exports.updateTeacher = (req, res, next) => {
  if (req.decodedToken.id == req.body._id || req.decodedToken.role == "admin") {
    Teacher.findByIdAndUpdate(req.body._id, req.body)
      .then((object) => {
        res.status(200).json(object);
      })
      .catch((error) => next(error));
  } else res.status(403).json("You cannot change another teacher's data");
};

exports.getTeacherById = (req, res, next) => {
  Teacher.findOne({ _id: req.params.id })
    .then((object) => {
      if (object === null) throw new Error("Teacher is not found");
      res.status(200).json(object);
    })
    .catch((error) => next(error));
};

exports.getAllClassSupervisors = (req, res, next) => {
  Class.find({}, { _id: 0, name: 1, supervisor: 1 })
    .populate("supervisor")
    .then((object) => res.status(200).json(object))
    .catch((error) => next(error));
};

exports.deleteTeacher = (req, res, next) => {
  if (req.decodedToken.id == req.body._id || req.decodedToken.role == "admin") {
    Class.updateMany(
      { supervisor: req.body._id },
      { $set: { supervisor: null } }
    )
      .then(() => Teacher.deleteOne({ _id: req.body._id }))
      .then((object) => res.status(200).json(object))
      .catch((error) => next(error));
  } else res.status(403).json("You cannot delete another teacher's data");
};
