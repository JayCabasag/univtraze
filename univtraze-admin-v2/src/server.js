const express = require("express");
const path = require("path");

const app = express();
const port = 3000;
const indexRouter = require("./routes/index")
const userRouter = require("./routes/users")
const authRouter = require("./routes/auth")

app.set("views", path.join(__dirname, "views"))
app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "../public")))
app.use("/", indexRouter)
app.use("/users", userRouter)
app.use("/auth", authRouter)

app.listen(port, () => {
    console.clear();
    console.log("Listeneing on port:", port)
})