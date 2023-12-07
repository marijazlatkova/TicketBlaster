const express = require("express");
const cookieParser = require("cookie-parser");
const auth = require("./handlers/auth");
const db = require("../../pkg/db");

const app = express();

db.init();
app.use(express.json());
app.use(cookieParser());

app.post("/api/v1/auth/create-account", auth.createAccount);
app.post("/api/v1/auth/login", auth.login);
app.post("/api/v1/auth/forgot-password", auth.forgotPassword);
app.post("/api/v1/auth/refresh-token", auth.refreshToken);
app.post("/api/v1/auth/reset-password", auth.resetPassword);

app.listen(process.env.PORTAUTH, (err) => {
  err
  ? console.log(err)
  : console.log(`Service [auth] successfully started at port ${process.env.PORTAUTH}`);
});