const express = require("express");
const proxy = require("express-http-proxy");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config({ path: `${__dirname}/../../../.env` });

const app = express();

app.use(cors({
  origin: "http://localhost:3000"
}));

app.use(express.static("public"));

app.use(
  "/api/v1/auth",
  proxy("http://localhost:10001", {
    proxyReqPathResolver: (req) =>
      `http://localhost:10001/api/v1/auth/${req.url}`,
  })
);

app.use(
  "/api/v1/storage",
  proxy("http://localhost:10002", {
    proxyReqPathResolver: (req) =>
      `http://localhost:10002/api/v1/storage/${req.url}`,
  })
);

app.use(
  "/api/v1/events",
  proxy("http://localhost:10003", {
    proxyReqPathResolver: (req) =>
      `http://localhost:10003/api/v1/events/${req.url}`,
  })
);

app.use(
  "/api/v1/ecommerce",
  proxy("http://localhost:10004", {
    proxyReqPathResolver: (req) =>
      `http://localhost:10004/api/v1/ecommerce/${req.url}`,
  })
);

app.use(
  "/api/v1/users",
  proxy("http://localhost:10005", {
    proxyReqPathResolver: (req) =>
      `http://localhost:10005/api/v1/users/${req.url}`,
  })
);

app.use(
  "/",
  proxy("http://localhost:3000", {
    proxyReqPathResolver: (req) => `http://localhost:3000/${req.url}`,
  })
);

app.listen(process.env.PORTPROXY, (err) => {
  err 
  ? console.log(err)
  : console.log(`Service [proxy] successfully started on port ${process.env.PORTPROXY}`);
});