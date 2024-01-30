const express = require("express");
const mongoose = require("mongoose");
const bodyparser = require("body-parser");
const cors = require("cors");

require("dotenv").config();

const app = express();

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.use(cors());
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("connected to mongodb");
  })
  .catch((error) => {
    console.log("Failed to connect to mongodb", error);
  });

app.get("/", (req, res) => {
  res.status(200).json("Server is up and running!");
});

const authRoutes = require("./routes/auth");
const quizRoutes = require("./routes/quiz");

app.use("/api", authRoutes);
app.use("/api", quizRoutes);
