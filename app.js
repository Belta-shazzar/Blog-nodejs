require("dotenv").config();
require('express-async-errors');

const express = require("express");
const connectDB = require("./config/connectDB");
const userRouter = require("./routes/userRoute");

// error handler
const errorHandlerMiddleware = require("./middleware/error-handler")
const app = express();

app.use(express.json());

app.use("/api/v1/blog", userRouter);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO);
    app.listen(port, console.log(`server is listening on port ${port}...`));
  } catch (error) {
    console.log(error);
  }
};

start();
