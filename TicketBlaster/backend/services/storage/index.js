const express = require("express");
const dotenv = require("dotenv");
const storage = require("./handlers/storage");
const db = require("../../pkg/db");

dotenv.config({ path: `${__dirname}/../../../.env` });

db.init();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.post("/api/v1/storage", storage.uploadImage, (req, res) => { 
  return res.status(200).send({
  status: "Successfully uploaded an image",
  data: req.file.filename
})});

app.listen(process.env.PORTSTORAGE, (err) => {
  err 
  ? console.log(err)
  : console.log(`Service [storage] successfully started at port ${process.env.PORTSTORAGE}`);
});