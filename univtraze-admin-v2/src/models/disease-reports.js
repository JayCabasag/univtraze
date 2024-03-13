const pool = require("../configs/dbConfig");

module.exports = class DiseaseReports {
    static async getDiseaseReports(){
        try {
             // For pool initialization, see above
             const [rows, _fields] = await pool.query('SELECT * from disease_reports;');
             // Connection is automatically released when query resolves
             return rows
        } catch (error) {
            throw error
        }
    }

    static async getMonthlyDiseaseReports(){
        try {
            // For pool initialization, see above
            const [rows, _fields] = await pool.query('SELECT MONTH(created_at) AS month, COUNT(*) AS count FROM disease_reports GROUP BY MONTH(created_at);');
            // Connection is automatically released when query resolves
            return rows
        } catch (error) {
            throw error   
        }
    }
}