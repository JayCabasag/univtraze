const pool = require("./../configs/dbConfig");

module.exports = class Overview {
    static async getDiseaseReportsTotal(){
        try {
            // For pool initialization, see above
            const [rows, _fields] = await pool.query('SELECT * FROM disease_reports');
            // Connection is automatically released when query resolves
            console.log(rows)
            return rows
        } catch (err) {
            throw err
        }
    }
    static async getEmergencyReportsTotal(){
        try {
            // For pool initialization, see above
            const [rows, _fields] = await pool.query('SELECT count(id) as count FROM emergency_reports');
            // Connection is automatically released when query resolves
            return rows
        } catch (err) {
            throw err
        }
    }
    static async getActiveCasesTotal(){
        try {
            // For pool initialization, see above
            const [rows, _fields] = await pool.query('SELECT * FROM disease_reports where status = 0');
            // Connection is automatically released when query resolves
            return rows
        } catch (err) {
            throw err
        }
    }
    static async getPendingCasesTotal(){
        try {
            // For pool initialization, see above
            const [rows, _fields] = await pool.query('SELECT * FROM disease_reports where status = 1');
            // Connection is automatically released when query resolves
            return rows
        } catch (err) {
            throw err
        }
    }
}