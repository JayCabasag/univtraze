const express = require("express");

const app = express();
const port = 3000;
const userRouter = require("./routes/users")

app.set("view engine", "ejs");

app.get("/", (req, res) => {
    res.render("index")
});

app.use("/users", userRouter)

app.listen(port, () => {
    console.clear();
    console.log("Listeneing on port: ", port)
})