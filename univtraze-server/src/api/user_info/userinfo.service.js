const pool = require('../../config/database');

module.exports = {
  addInfo: (data, callBack) => {
    pool.query(
      `INSERT INTO student_user_informations(user_id, user_type, id_number, address, dob, year_section, mobile_number, profile_img, id_photo) 
            VALUES (?,?,?,?,?,?,?,?,?,?,?)`,
      [
        data.user_id,
        data.user_type,
        data.id_number,
        data.address,
        data.dob,
        data.year_section,
        data.mobile_number,
        data.profile_img,
        data.id_photo,
      ],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        return callBack(null, results);
      },
    );
  },
};
