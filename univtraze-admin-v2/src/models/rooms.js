const pool = require("../configs/dbConfig");

module.exports = class Rooms {
    static async getRooms(){
        try {
            // For pool initialization, see above
            const [rows, _fields] = await pool.query('SELECT * from rooms');
            // Connection is automatically released when query resolves
            return rows
        } catch (err) {
            throw err
        }
    }
    static async isRoomExists(room){
        try {
            // For pool initialization, see above
            const [rows, _fields] = await pool.query(`SELECT * from rooms where room_number = ${room.room_number} AND room_name = ${room.room_name}' AND building_name = '${room.building_name}'`);
            // Connection is automatically released when query resolves
            return !rows[0]
        } catch (err) {
            throw err
        }
    }

    static async createRoom(room){
        try {
            // For pool initialization, see above
            const [rows, _fields] = await pool.query(`INSERT INTO rooms (room_number, room_name, building_name) values (${room.room_number}, '${room.room_name}', '${room.building_name}')`);
            // Connection is automatically released when query resolves
            return rows
        } catch (err) {
            throw err
        }
    }
}