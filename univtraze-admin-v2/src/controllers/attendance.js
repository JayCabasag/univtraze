
const attendanceModel = require("../models/attendance")

module.exports = class Attendance {
    static async getAttendances(){
        try {
            const attendance = attendanceModel.getAttendances();
            return attendance
        } catch (error) {
            throw error
        }
    }
}