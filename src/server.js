/** @format */

import express from "express";
import http from "http";

import "regenerator-runtime/runtime";
import cors from "cors";
import * as bodyParser from "body-parser";
import router from "./routes";
import { connect } from "mongoose";
import path from "path";
import dotenv from "dotenv";
import morgan from "morgan";

var cron = require('node-cron');
dotenv.config();
const app = express();
// var server = http.createServer(app);
// var io = socketIO(server, {
//   cors: {
//     origin: "*",
//     methods: ["GET", "POST"],
//   },
// });
// io.on("connection", function (socket) {
//   console.log("a user connected with socket id", socket.id);
// });

const port = process.env.PORT || 8080;
const server = http.createServer(app);

//setInterval(updateStatus, 20000);
const url = `${process.env.MONGODB_URI_PROTOCOL}://${process.env.MONGODB_URI_USER}:${process.env.MONGODB_URI_PASSWORD}@${process.env.MONGODB_URI_HOST}/${process.env.MONGODB_URI_DATABASE}`;
console.log(`Trying to connect with: ${url}`);
connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    require("../src/seeders");
  })
  .catch((err) => {
    console.log("Error in database connection", err.message);
  });

app.use(morgan("dev"));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ limit: "100mb" }));

const corsOption = {
   origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  exposedHeaders: ["x-auth-token", "authorization"],
};
app.use(cors(corsOption));

//app.use(cors());
app.use(express.static(path.join(__dirname, "..", "public")));
app.use(express.static(path.join(__dirname, "..", "build")));

app.use("/", router);

app.get("/*", function (req, res) {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.use("**", (_, res) => {
  return res.sendFile(path.join(__dirname, "..", "build", "index.html"));
});

server.listen(port, function () {
  console.log(`Example app listening on port ${port}!`);
});




