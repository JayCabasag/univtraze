const pool = require("../configs/dbConfig");

module.exports = class Attendance {
    static async getAttendances(){
        try {
            // For pool initialization, see above
            const [rows, _fields] = await pool.query('SELECT a.*, b.room_number, b.room_name, b.building_name FROM visited_rooms as a LEFT JOIN rooms as b ON a.room_id = b.id;');
            // Connection is automatically released when query resolves
            return rows
        } catch (err) {
            throw err
        }
    }
}