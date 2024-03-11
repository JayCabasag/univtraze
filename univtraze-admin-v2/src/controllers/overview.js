const overviewModel = require('./../models/overview')

module.exports = class Overview {
    static async getOverview(){
        try {
            const activeCasesTotal = await overviewModel.getDiseaseReportsTotal();
            // const diseaseReportsTotal = await overviewModel.getDiseaseReportsTotal();
            // const pendingCasesTotal = await overviewModel.getPendingCasesTotal();
            // const emergencyReportsTotal = await overviewModel.getPendingCasesTotal(); 
            // console.log(activeCasesTotal, diseaseReportsTotal, pendingCasesTotal, emergencyReportsTotal)
        } catch (error) {
            throw error
        }
    }
}