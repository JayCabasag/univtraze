const roomModel = require("../models/rooms");

module.exports = class Rooms {
    static async getAllRooms(){
        try {
            const rooms = await roomModel.getRooms();
            return rooms            
        } catch (error) {
            throw error
        }
    }

    static async createRoom(room){
        try {
            const isRoomExists = await roomModel.isRoomExists(room);
            if (isRoomExists){
                return { status: 403, message: "Already exists" }
            }
            await roomModel.createRoom(room);
            return { status: 200, message: "Room created successfully"}
        } catch (error) {
            throw error
        }
    }
}