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
    origin: ["https://e-commerce-frontend-2s7i.onrender.com"],
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use("/api/v1/user", userRoute);
app.use("/api/v1/product", productRoute);
app.use("/api/v1/review", reviewRoute);
app.use("/api/v1/order", orderRoute);

app.get("/", (req, res) => {
  res.status(201).json({ message: "Connected to Backend!" });
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
const DB = process.env.MONGODB_URI;

mongoose.connect(DB);

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
