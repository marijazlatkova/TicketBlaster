const express = require("express");
const cors = require("cors");
const db = require("../../pkg/db");
const users = require("./handlers/users");
const storage = require("../storage/handlers/storage");

db.init();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/api/v1/users", users.getAll);
app.get("/api/v1/users/:id", users.getOne);
app.delete("/api/v1/users/:id", users.remove);
app.patch("/api/v1/users/image/:id", storage.uploadImage, users.update);
app.patch("/api/v1/users/role/:id", users.upgradeDegrade);
app.patch("/api/v1/users/password/:id", users.changePassword);

app.listen(process.env.PORTUSERS, (err) => {
  err 
  ? console.log(err)
  : console.log(`Service [users] successfully started at port ${process.env.PORTUSERS}`);
});