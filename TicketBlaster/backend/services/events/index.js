const express = require("express");
const cors = require("cors");
const db = require("../../pkg/db");
const events = require("./handlers/events");
const storage = require("../storage/handlers/storage");

db.init();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.post("/api/v1/events", storage.uploadImage, events.create);
app.patch("/api/v1/events/:id", events.update);
app.delete("/api/v1/events/:id", events.remove);
app.get("/api/v1/events", events.getAll);
app.get("/api/v1/events/:id", events.getOne);

app.listen(process.env.PORTEVENTS, (err) => {
  err
  ? console.log(err)
  : console.log(`Service [events] successfully started at port ${process.env.PORTEVENTS}`);
});