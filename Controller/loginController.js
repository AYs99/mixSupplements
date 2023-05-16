// const jwt = require("jsonwebtoken");
// const mongoose = require("mongoose");
// const bcrypt = require("bcrypt");
// const Teacher = mongoose.model("teachers");

// exports.isLoggedIn = (req, res, next) => {
//   if (req.get("authorization")) {
//     try {
//       const token = req.get("authorization").split(" ")[1];
//       req.decodedToken = jwt.verify(token, process.env.secretKey);
//       res.status(200).json("User is logged in");
//     } catch (error) {
//       next(error);
//     }
//   }
// };

// exports.isAuthenticated = (req, res, next) => {
//   let token;
//   let validTokens;
//   let stayLoggedIn = req.body.stayLoggedIn;
//   let expirationTime;
//   stayLoggedIn ? null : { expiresIn: "1d" };
//   Teacher.findOne({
//     userName: req.body.userName,
//   })
//     .then((user) => {
//       if (!user) {
//         let error = new Error("Invalid userName or password.");
//         error.status = 422;
//         throw error;
//       }
//       if (bcrypt.compareSync(req.body.password, user.password)) {
//         token = jwt.sign(
//           {
//             userName: user.userName,
//             id: user._id,
//             role: user.role,
//           },
//           process.env.secretKey,
//           expirationTime
//         );
//         validTokens = user.tokens || [];
//         validTokens = validTokens.filter((t) => {
//           try {
//             jwt.verify(t, process.env.secretKey);
//             return true;
//           } catch (error) {
//             return false;
//           }
//         });
//         return Teacher.findByIdAndUpdate(user._id, {
//           tokens: [...validTokens, { token, signedAt: Date.now().toString() }],
//         });
//       } else {
//         const error = new Error("Invalid userName or password.");
//         error.status = 422;
//         throw error;
//       }
//     })
//     .then((user) => {
//       res.status(200).json({ data: "ok", token });
//     })
//     .catch((error) => next(error));
// };

//------------------------------------------------------------------------------

const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Teacher = mongoose.model("teachers");

exports.isLoggedIn = (req, res, next) => {
  if (req.get("authorization")) {
    try {
      const token = req.get("authorization").split(" ")[1];
      req.decodedToken = jwt.verify(token, process.env.secretKey);
      res.status(200).json("User is logged in");
    } catch (error) {
      next(error);
    }
  }
};

exports.isAuthenticated = (req, res, next) => {
  let token;
  let validTokens;
  let stayLoggedIn = req.body.stayLoggedIn;
  let expirationTime;
  let numOfDays = 1;
  stayLoggedIn
    ? (expirationTime = null)
    : (expirationTime = { expiresIn: numOfDays + "d" });
  Teacher.findOne({
    userName: req.body.userName,
  })
    .then((user) => {
      if (!user) {
        let error = new Error("Invalid userName or password.");
        error.status = 422;
        throw error;
      }
      if (bcrypt.compareSync(req.body.password, user.password)) {
        token = jwt.sign(
          {
            userName: user.userName,
            id: user._id,
            role: user.role,
          },
          process.env.secretKey,
          expirationTime
        );
        validTokens = user.tokens || [];
        if (validTokens.length)
          validTokens = validTokens.filter((t) => {
            const timeDiff = (Date.now() - t.signedAt) / 1000;
            if (timeDiff < numOfDays * 86400) return true;
          });
        return Teacher.findByIdAndUpdate(user._id, {
          tokens: [...validTokens, { token, signedAt: Date.now() }],
        });
      } else {
        const error = new Error("Invalid userName or password.");
        error.status = 422;
        throw error;
      }
    })
    .then((user) => {
      res.status(200).json({ data: "ok", token });
    })
    .catch((error) => next(error));
};
