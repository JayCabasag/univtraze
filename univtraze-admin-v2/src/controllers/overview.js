const overviewModel = require('./../models/overview')
const diseaseReportsModel = require('./../models/disease-reports')

module.exports = class Overview {
    static async getOverview(){
        try {
            const resolvedCasesTotal = await overviewModel.getPendingCasesTotal();
            const diseaseReportsTotal = await overviewModel.getDiseaseReportsTotal();
            const pendingCasesTotal = await overviewModel.getActiveCasesTotal();
            const emergencyReportsTotal = await overviewModel.getEmergencyReportsTotal();

            return {
                resolvedCasesTotal: resolvedCasesTotal.total || 0, 
                diseaseReportsTotal: diseaseReportsTotal.total || 0,
                pendingCasesTotal: pendingCasesTotal.total || 0,
                emergencyReportsTotal: emergencyReportsTotal.total || 0
            }
        } catch (error) {
            throw error
        }
    }

    static async getDiseaseReportsData(){
        try {
            const monthlyDiseaseReports = await diseaseReportsModel.getMonthlyDiseaseReports();
            return monthlyDiseaseReports
        } catch (error) {
            throw error
        }
    }

    static async getDiseaseReportsStatusTotal(){
        try {
            const casesStatusTotal = await diseaseReportsModel.getCaseStatusTotal();
            return casesStatusTotal
        } catch (error) {
            throw error
        }
    }
}