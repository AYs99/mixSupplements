require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");

const server = express();

let port = process.env.PORT || 8080;

server.listen(port,() => {
    console.log("listening",port);
});
// mongoose.connect("mongodb://127.0.0.1:27017/nurserySystem")
//         .then(() => {
//             console.log("connected to database");
//             server.listen(port,() => {
//                 console.log("listening",port);
//             });
//         })
//         .catch(error => {console.log("problem in database"+error);})


//Cross-Origin Resource Sharing
// !needs attention to link front and back
server.use(cors())

// logging
server.use(morgan('tiny'));

//request content types
server.use(express.json());

//routes
server.get('/',(request,response,next) => {
    response.json({message:"This is the main page"});
});

// not found
server.use((request,response,next) => {
    response.status(404).json({message:"Page Not Found"});
});

// error handling
// !needs attention in production to handle it
server.use((error,request,response,next) => {
    response.status(500).json({message:error+""});
});