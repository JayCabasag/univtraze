const express = require("express")
const router = express.Router();
const controller = require("../controllers/rooms")

router.get("/", async (req, res) => {
    const rooms = await controller.getAllRooms();
    console.log(rooms)
    return res.render("rooms", { rooms })
})

module.exports = router