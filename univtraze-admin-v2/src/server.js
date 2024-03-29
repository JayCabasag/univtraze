require('dotenv').config()
const express = require("express");
const path = require("path");
const app = express();
const port = process.env.PORT || 3000;

const indexRouter = require("./routes/index")
const attendanceRouter = require("./routes/attendance")
const authRouter = require("./routes/auth")
const roomRouter = require("./routes/rooms")
const diseaseReportRouter = require("./routes/disease-reports")
const emergencyReportRouter = require("./routes/emergency-reports")

app.set("views", path.join(__dirname, "views"))
app.set("view engine", "ejs");

app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")))
app.use("/", indexRouter)
app.use("/attendance", attendanceRouter)
app.use("/auth", authRouter)
app.use("/rooms", roomRouter)
app.use("/disease-reports", diseaseReportRouter)
app.use("/emergency-reports", emergencyReportRouter)

app.listen(port, () => {
    console.clear();
    console.log("Listeneing on port:", port)
})