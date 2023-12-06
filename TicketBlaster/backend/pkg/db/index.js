const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config({ path: `${__dirname}/../../../.env`});

const { MONGO_USERNAME, MONGO_PASSWORD, MONGO_DATABASE } = process.env;

const init = async () => {
  try {
    const db = `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@cluster0.tonpgxf.mongodb.net/${MONGO_DATABASE}?retryWrites=true&w=majority`;
    await mongoose.connect(db);
    console.log("Successfully connected to DataBase");
  } catch (err) {
    console.log("Error connecting to DataBase", err);
  }
};

module.exports = { 
  init
};