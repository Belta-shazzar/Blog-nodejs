require("dotenv").config();
require("express-async-errors");

const express = require("express");
const connectDB = require("./config/connectDB");

// Routers
const userRouter = require("./routes/userRoute");
const articleRouter = require("./routes/articleRoute");
const subUserRouter = require("./routes/subUserRoute")

// error handler
const errorHandlerMiddleware = require("./middleware/error-handler");

const app = express();

app.use(express.json());

app.use("/api/v1/user", userRouter);
app.use("/api/v1/article", articleRouter);
app.use("/api/v1/subscription", subUserRouter)

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
