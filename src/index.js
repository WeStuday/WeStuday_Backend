

require("dotenv").config();
const express = require("express");
const app = express();

const mongoose = require("mongoose");
const dbConn = require("./../config/dbConn");
const cookieParser = require('cookie-parser')
const authRoute = require('../Routes/authRoute')
const levelRoute = require('./../Routes/levelRoute')
const gradeRoute = require('./../Routes/gradeRoute')
const semesterRoute = require('./../Routes/semesterRoute')
const subjectRoute = require('./../Routes/subjectRoute')
const chapterRoute = require('./../Routes/chapterRoute')
const fileRoute = require('./../Routes/fileRouter')

mongoose.set('strictQuery', true);
const PORT = process.env.PORT || 5000;
dbConn();
app.use(express.json())
app.use(cookieParser())

app.use("/", levelRoute)
app.use("/", gradeRoute)
app.use("/", semesterRoute)
app.use("/", subjectRoute)
app.use("/", chapterRoute)
app.use("/file", fileRoute)
app.use('/auth', authRoute)
app.use("/uploads", express.static("uploads"));

mongoose.connection.once("open", () => {
    console.log("Connected to DB");
    app.listen(PORT, () => console.log(`Running on port ${PORT}`));
});

mongoose.connection.on('error', err => {
    console.log(err)
})