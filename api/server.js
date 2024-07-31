const mongoose = require("mongoose");
const dotenv = require("dotenv");
const express = require("express");
dotenv.config();
const app = express();
const socketIo = require("socket.io");
const http = require("http");
const cors = require("cors");

const userRoute = require("./routes/userRoute");
const productRoute = require("./routes/productRoute");
const reviewRoute = require("./routes/reviewRoute");
const AppError = require("./utils/AppError");
const blogSocket = require("./socket/blogSocket");
const commentSocket = require("./socket/commentSocket");
const orderRoute = require("./routes/orderRoute");
const { completeOrder } = require("./controllers/orderController");
const errorHandler = require("./controllers/errorHandling");

// set Socket.io event listners
const server = http.createServer(app);
const io = socketIo(server);
blogSocket(io);
commentSocket(io);

// set routes and middleware
app.use(express.json({ limit: "10kb" }));
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:5173"],
    // allowedHeaders: ["Content-Type"],
  })
);

app.use("/api/v1/user", userRoute);
app.use("/api/v1/product", productRoute);
app.use("/api/v1/review", reviewRoute);
app.use("/api/v1/order", orderRoute);

app.use(express.static(`${__dirname}/build/client/dist`));
app.all("*", (req, res, next) => {
  res.sendFile(`${__dirname}/build/client/dist/index.html`);
});
app.all("*", (req, res, next) => {
  const error = new AppError(
    `this url (${req.originalUrl}) || (${req.url}) is not valid`,
    404
  );
  next(error);
});

app.use(errorHandler);
const port = process.env.PORT || 3000;
const DB =
  "mongodb+srv://bakhaled310:ml5sQ8Tc3Pda6LPY@cluster0.4llkhxl.mongodb.net/e-commerce";

mongoose.connect(DB);

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
