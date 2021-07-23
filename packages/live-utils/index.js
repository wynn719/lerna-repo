const express = require("express");
const app = express();

app.use("/", (res, req) => {
  req.json({
    code: 0,
    msg: "succ",
  });
});

app.listen(() => {
  console.log("app boot");
});
