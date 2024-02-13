const pool = require('../../config/database');

module.exports = {
  addKioskScan: (data, callBack) => {
    // Define the first query for temperature_history table
    const insertTemperatureQuery =
      'INSERT INTO temperature_history (user_id, temperature, unit_of_measurement, room_id, sensor_device, remarks) VALUES (?,?,?,?,?,?)';

    // Define the second query for visited_rooms table
    const insertVisitedRoomQuery = 'INSERT INTO visited_rooms (user_id, room_id, temperature) VALUES (?,?,?)';

    // Execute the first query
    pool.query(
      insertTemperatureQuery,
      [data.user_id, data.temperature, data.unit_of_measurement, data.room_id, data.sensor_device, data.remarks],
      (error, temperature_history_result) => {
        if (error) {
          return callBack(error);
        }

        // Execute the second query
        pool.query(
          insertVisitedRoomQuery,
          [data.user_id, data.room_id, data.temperature],
          (error, visited_room_result) => {
            if (error) {
              return callBack(error);
            }

            // Both queries executed successfully, return results
            callBack(null, {
              temperature_history_id: temperature_history_result.insertId,
              visited_room_id: visited_room_result.insertId,
            });
          },
        );
      },
    );
  },
};
