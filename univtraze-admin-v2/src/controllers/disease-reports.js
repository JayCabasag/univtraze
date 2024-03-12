const model = require("../models/disease-reports")
module.exports = class DiseaseReports {
    static async getDiseaseReports(){
        try {
            const diseaseReports = await model.getDiseaseReports();
            return diseaseReports
        } catch (error) {
            throw error
        }
    }
}