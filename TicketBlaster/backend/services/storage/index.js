const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const storage = require("./handlers/storage");
const db = require("../../pkg/db");
const path = require("path");

dotenv.config({ path: `${__dirname}/../../../.env` });

db.init();

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use("/images", express.static(path.join(__dirname, "../../public/images")));

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