const overviewModel = require('./../models/overview')

module.exports = class Overview {
    static async getOverview(){
        try {
            const activeCasesTotal = await overviewModel.getDiseaseReportsTotal();
            const diseaseReportsTotal = await overviewModel.getDiseaseReportsTotal();
            const pendingCasesTotal = await overviewModel.getPendingCasesTotal();
            const emergencyReportsTotal = await overviewModel.getPendingCasesTotal();
            
            return {
                activeCasesTotal: activeCasesTotal.total || 0, 
                diseaseReportsTotal: diseaseReportsTotal.total || 0,
                pendingCasesTotal: pendingCasesTotal.total || 0,
                emergencyReportsTotal: emergencyReportsTotal.total || 0
            }
        } catch (error) {
            throw error
        }
    }
}