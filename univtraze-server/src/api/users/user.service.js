const pool = require('../../config/database');
const { transporter } = require('../../config/emailConfig');

module.exports = {
  getAllUsers: (callBack) => {
    pool.query(`SELECT * FROM users WHERE type IS NOT NULL`, (error, results, fields) => {
      if (error) {
        return callBack(error);
      }
      return callBack(null, results);
    });
  },

  emailCheck: (data, callBack) => {
    pool.query(`SELECT * FROM users WHERE email = ?`, [data.email], (error, results, _fields) => {
      if (error) {
        return callBack(error);
      }
      return callBack(null, results[0]);
    });
  },
  create: (data, callBack) => {
    pool.query(
      `INSERT INTO users (email, provider, password, type) 
      VALUES (?, ?, ?, NULL);`,
      [data.email, data.provider, data.password],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        return callBack(null, results);
      },
    );
  },
  getUsers: (callBack) => {
    pool.query(
      `SELECT id, type, email, provider, password, createdAt, updatedAt FROM users WHERE 1`,
      [],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        return callBack(null, results);
      },
    );
  },
  getUserById: (id, callBack) => {
    pool.query('SELECT id, type, email, password, provider FROM users WHERE id = ?', [id], (error, results, fields) => {
      if (error) {
        return callBack(error);
      }
      return callBack(null, results[0]);
    });
  },

  getUserByEmail: (email, callBack) => {
    pool.query(`SELECT * FROM users WHERE email = ?`, [email], (error, results, fields) => {
      if (error) {
        return callBack(error);
      }
      return callBack(null, results[0]);
    });
  },

  updateUserType: (data, callBack) => {
    pool.query(`UPDATE users SET type=? WHERE id = ?`, [data.type, data.id], (error, results, fields) => {
      if (error) {
        return callBack(error);
      }
      return callBack(null, results);
    });
  },

  isStudentDetailsExists: (data, callBack) => {
    pool.query(`SELECT * FROM student_details WHERE user_id = ?`, [data.user_id], (error, results, fields) => {
      if (error) {
        return callBack(error);
      }
      return callBack(null, results);
    });
  },

  updateStudentDetails: (data, callBack) => {
    pool.query(
      'UPDATE  `student_details` SET mobile_number=?,profile_url=? WHERE user_id = ?',
      [
        data.mobile_number,
        data.profile_url,
        data.user_id,
      ],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        return callBack(null, results);
      },
    );
  },
  isEmployeeDetailsExists: (data, callBack) => {
    pool.query(`SELECT * FROM employee_details WHERE user_id = ?`, [data.user_id], (error, results, fields) => {
      if (error) {
        return callBack(error);
      }
      return callBack(null, results);
    });
  },
  updateEmployeeDetails: (data, callBack) => {
    pool.query(
      'UPDATE `employee_details` SET profile_url=?, mobile_number=? WHERE user_id=?',
      [
        data.profile_url,
        data.mobile_number,
        data.user_id
      ],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        return callBack(null, results);
      },
    );
  },
  addEmployeeDetails: (data, callBack) => {
    pool.query(
      'INSERT INTO employee_details (user_id, firstname, lastname, middlename, suffix, gender, address, department, position, birthday, employee_id,mobile_number, email, profile_url, front_id_photo, back_id_photo) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
      [
        data.user_id,
        data.firstname,
        data.lastname,
        data.middlename,
        data.suffix,
        data.gender,
        data.address,
        data.department,
        data.position,
        data.birthday,
        data.employee_id,
        data.mobile_number,
        data.email,
        data.profile_url,
        data.back_id_photo,
        data.front_id_photo,
      ],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        return callBack(null, results);
      },
    );
  },
  addVisitorDetails: (data, callBack) => {
    pool.query(
      'INSERT INTO visitor_details (user_id, firstname, lastname, middlename, suffix, gender, address, birthday, mobile_number, email, profile_url, back_id_photo, front_id_photo) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)',
      [
        data.user_id,
        data.firstname,
        data.lastname,
        data.middlename,
        data.suffix,
        data.gender,
        data.address,
        data.birthday,
        data.email,
        data.mobile_number,
        data.profile_url,
        data.back_id_photo,
        data.front_id_photo,
      ],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        return callBack(null, results);
      },
    );
  },
  addStudentDetails: (data, callBack) => {
    pool.query(
      'INSERT INTO student_details (user_id, firstname, lastname, middlename, suffix, gender, address, course, year_section, birthday, student_id, mobile_number, email, profile_url, back_id_photo, front_id_photo) VALUES (?, ?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
      [
        data.user_id,
        data.firstname,
        data.lastname,
        data.middlename,
        data.suffix,
        data.gender,
        data.address,
        data.course,
        data.year_section,
        data.birthday,
        data.student_id,
        data.mobile_number,
        data.email,
        data.profile_url,
        data.back_id_photo,
        data.front_id_photo,
      ],
      (error, results, fields) => {
        if (error) {
          console.log(error.sqlMessage);
          return callBack(error);
        }
        return callBack(null, results);
      },
    );
  },

  isVisitorDetailsExists: (data, callBack) => {
    pool.query(`SELECT * FROM visitor_details WHERE user_id = ?`, [data.user_id], (error, results, fields) => {
      if (error) {
        return callBack(error);
      }
      return callBack(null, results);
    });
  },

  updateVisitorDetails: (data, callBack) => {
    pool.query(
      'UPDATE `visitor_details` SET mobile_number=?, profile_url=? WHERE user_id=?',
      [
        data.mobile_number,
        data.profile_url,
        data.user_id,
      ],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        return callBack(null, results);
      },
    );
  },
  getStudentDetailsById: (id, callBack) => {
    pool.query(`SELECT * FROM student_details WHERE user_id = ?`, [id], (error, results, fields) => {
      if (error) {
        return callBack(error);
      }
      return callBack(null, results[0]);
    });
  },

  getVisitorDetailsById: (id, callBack) => {
    pool.query(`SELECT * FROM visitor_details WHERE user_id = ?`, [id], (error, results, fields) => {
      if (error) {
        return callBack(error);
      }
      return callBack(null, results[0]);
    });
  },

  getEmployeeDetailsById: (id, callBack) => {
    pool.query(
      `SELECT * FROM employee_details WHERE user_id = ?`,
      [id],

      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        return callBack(null, results[0]);
      },
    );
  },
  updateUserRecoveryPassword: (data, callBack) => {
    pool.query(
      `update users set recovery_password = ? where id = ?`,
      [data.recovery_password, data.user_id],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        return callBack(null, results);
      },
    );
  },
  sendLinkToEmail: (data, callBack) => {
    let recovery_code = data.recovery_password;

    var mailOptions = {
      from: 'Univtraze App',
      to: data.email,
      subject: 'Univtraze Recovery Password',
      text: 'User password reset request.',
      html: `This email is requesting for new password for Univtraze user credential: <br /> Please use this code : ${recovery_code}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return callBack(error);
      } else {
        return callBack(null, info.response);
      }
    });
  },
  checkIfEmailAndRecoveryPasswordMatched: (data, callBack) => {
    pool.query(
      `select * from users where email = ? and recovery_password = ? `,
      [data.email, data.recovery_password],

      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        return callBack(null, results);
      },
    );
  },
  updateUserPassword: (data, callBack) => {
    pool.query(
      `update users set password = ? where id = ?`,
      [data.new_password, data.user_id],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        return callBack(null, results);
      },
    );
  },
  checkIfIdAndPasswordMatched: (data, callBack) => {
    pool.query(
      `SELECT * FROM users WHERE id = ? and password = ?`,
      [data.user_id, data.old_password],

      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        return callBack(null, results);
      },
    );
  },
  addAccountCreatedNotificationToUser: (data, callBack) => {
    pool.query(
      'INSERT INTO `users_notifications` (notification_title, notification_description, notification_source, notification_type, notification_is_viewed, notification_for) VALUES (?,?,?,?,?,?)',
      [
        data.notification_title,
        data.notification_description,
        data.notification_source,
        data.notification_type,
        data.notification_is_viewed,
        data.notification_for,
      ],

      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        return callBack(null, results[0]);
      },
    );
  },

  deactivateAccount: (id, callBack) => {
    pool.query(
      `DELETE FROM users WHERE id = ?`,
      [id],

      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        return callBack(null, results[0]);
      },
    );
  },

  updateProfileInfoStudent: (data, callBack) => {
    pool.query(
      `UPDATE student_details SET course=?, year_section=?,mobile_number=?,profile_url=? WHERE user_id = ?`,
      [data.course, data.year_section, data.mobile_number, data.profile_url, data.user_id],

      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        return callBack(null, results);
      },
    );
  },

  updateProfileInfoEmployee: (data, callBack) => {
    pool.query(
      `UPDATE employee_details SET department=?, position=?,mobile_number=?,profile_url=? WHERE user_id = ?`,
      [data.department, data.position, data.mobile_number, data.profile_url, data.user_id],

      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        return callBack(null, results);
      },
    );
  },

  updateProfileInfoVisitor: (data, callBack) => {
    pool.query(
      `UPDATE visitor_details SET mobile_number=?,profile_url=? WHERE user_id = ?`,
      [data.mobile_number, data.profile_url, data.user_id],

      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        return callBack(null, results);
      },
    );
  },
};
