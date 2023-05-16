const mongoose = require("mongoose");
const Teacher = mongoose.model("teachers");

exports.logout = (req, res, next) => {
  try {
    const token = req.get("authorization").split(" ")[1];
    Teacher.findOneAndUpdate(
      { _id: req.decodedToken.id },
      { $pull: { tokens: { token } } }
    )
      .then((user) => {
        res.status(200).json("logged out.");
      })
      .catch((error) => next(error));
  } catch (error) {
    next(error);
  }
};
