const pool = require("../configs/dbConfig");

module.exports = class EmergencyReports {
    static async getEmergencyReports(){
        try {
            // For pool initialization, see above
            const [rows, _fields] = await pool.query('SELECT * from emergency_reports;');
            // Connection is automatically released when query resolves
            return rows
        } catch (error) {
            throw error
        }
    }
}