const express = require("express")
const router = express.Router();
const controller = require("../controllers/rooms")

router.get("/", async (req, res) => {
    const rooms = await controller.getAllRooms();
    console.log(rooms)
    return res.render("rooms", { rooms, route: "/rooms" })
})

// API
router.post("/", async (req, res) => {
    try {
        const result = await controller.createRoom(req.body);
        return res.status(result.status).json({
            message: result.message
        })   
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: "Internal server error"
        })
    }
})

module.exports = router