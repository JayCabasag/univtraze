const model = require("./../models/emergency-reports")

module.exports = class EmergencyReports {
    static async getEmergencyReports(){
        try {
            const emergencyReports = await model.getEmergencyReports();
            return emergencyReports
        } catch (error) {
            throw error
        }
    }
}