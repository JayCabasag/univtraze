const express = require("express");
const path = require("path");

const app = express();
const port = 3000;
const indexRouter = require("./routes/index")
const attendanceRouter = require("./routes/attendance")
const authRouter = require("./routes/auth")
const roomRouter = require("./routes/rooms")
const diseaseReportRouter = require("./routes/disease-reports")

app.set("views", path.join(__dirname, "views"))
app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "../public")))
app.use("/", indexRouter)
app.use("/attendance", attendanceRouter)
app.use("/auth", authRouter)
app.use("/rooms", roomRouter)
app.use("/disease-reports", diseaseReportRouter)

app.listen(port, () => {
    console.clear();
    console.log("Listeneing on port:", port)
})