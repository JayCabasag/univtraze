const model = require("../models/rooms");

module.exports = class Rooms {
    static async getAllRooms(){
        try {
            const rooms = await model.getRooms();
            return rooms            
        } catch (error) {
            throw error
        }
    }
}