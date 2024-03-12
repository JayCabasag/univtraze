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
}