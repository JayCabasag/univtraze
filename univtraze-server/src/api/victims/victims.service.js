const pool = require("../../config/database");

module.exports = {
    getUserVisitedRooms: (data, callBack) => {
        pool.query(
            `SELECT DISTINCT room_id FROM room_visits WHERE user_id = ? AND createdAt BETWEEN ? and ?`,
            [
                data.user_id,
                data.start_date,
                data.end_date
            ],
            (error, results, fields) => {
                if(error) {
                    return callBack(error)
                }

                return callBack(null, results)

            }
        )
    },
    
    getUsersViaRoomIdAndDate: (data, callBack) => {
        pool.query(
            `SELECT * FROM room_visits WHERE room_id = ? AND createdAt BETWEEN ? and ?`,
            [
                data.room_id,
                data.start_date,
                data.end_date
            ],
            (error, results, fields) => {
                if(error) {
                    return callBack(error)
                }

                return callBack(null, results)

            }
        )
    },

    getUserIdsViaRoomIdAndDate: (data, callBack) => {
        pool.query(
            `SELECT DISTINCT user_id FROM room_visits WHERE room_id = ? AND createdAt BETWEEN ? and ?`,
            [
                data.room_id,
                data.start_date,
                data.end_date
            ],
            (error, results, fields) => {
                if(error) {
                    return callBack(error)
                }

                return callBack(null, results)

            }
        )
    }
   
};