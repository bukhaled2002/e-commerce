const mongoose = require("mongoose");
const dotenv = require("dotenv");
const express = require("express");
dotenv.config();
const app = express();
const userRoute = require("./routes/userRoute");
app.use(express.json({ limit: "10kb" }));
app.use("/api/v1/user", userRoute);

app.all("*", (req, res, next) => {
  const error = new AppError(
    `this url (${req.originalUrl}) || (${req.url}) is not valid`,
    404
  );
  next(error);
});
const port = undefined || 3000;
const DB =
  "mongodb+srv://bakhaled310:ml5sQ8Tc3Pda6LPY@cluster0.4llkhxl.mongodb.net/e-commerce";

mongoose.connect(DB);

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
