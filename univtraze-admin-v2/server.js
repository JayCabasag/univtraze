const express = require("express");

const app = express();
const port = 3000;
const indexRouter = require("./routes/index")
const userRouter = require("./routes/users")
const authRouter = require("./routes/auth")

app.set("view engine", "ejs");

app.use("/", indexRouter)
app.use("/users", userRouter)
app.use("/auth", authRouter)

app.listen(port, () => {
    console.clear();
    console.log("Listeneing on port:", port)
})