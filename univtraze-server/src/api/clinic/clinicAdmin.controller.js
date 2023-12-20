const {emailClinicAdminCheck, createClinicAdmin, getClinicAdminByEmail, 
    getTotalActiveEmergencyReports, getTotalCommunicableDiseaseReports,
    getTotalCommunicableDiseaseReportedOngoing, getTotalCommunicableDiseaseReportedResolved, 
    getTotalResolvedEmergencyReports, getTotalCommunicableDiseaseReportedTodayOngoing, getTotalCommunicableDiseaseReportedTodayResolved, 
    updateNewPassword, checkIfEmailExist, addClinicRecoveryPassword, sendLinkToEmail,checkIfEmailAndRecoveryPasswordMatched, 
    updateClinicCredentials,  checkIfIdAndPasswordMatched} = require("./clinicAdmin.service");
const {genSaltSync, hashSync, compareSync} = require('bcrypt');
const { sign } = require("jsonwebtoken")
const moment = require('moment')
var generator = require('generate-password');

module.exports = {
    createClinicAdmin: (req, res) => {
        const body = req.body;
        const salt = genSaltSync(10);
        body.password = hashSync(body.password, salt)

        emailClinicAdminCheck(body, (err, results) => {
            if(err){
                console.log(err)
                return res.json({
                    success: 0,
                    message: "Database connection Error"
                });
            }

            if(results.length !== 0){
                return res.json({
                    success: 0,
                    message: "Email/Username already have an account"
                });
            }

            createClinicAdmin(body, (err, results) => {
                if(err){
                    console.log(err)
                    return res.json({
                        success: 0,
                        message: "Database connection Error"
                    });
                }
    
                return res.status(200).json({
                    success: 1,
                    data: results
                });
            });

        });
    },

    
    loginClinicAdmin: (req, res) => {
        const body = req.body;

        getClinicAdminByEmail(body, (err, results) => {
            if(err) {
                console.log(err );
                return
            }
            if(!results){
                return res.json({
                    success: 0,
                    data: "Incorrect Email or Password"
                })
            }

            const result = compareSync(body.password, results.password);

            if(result) {
                result.password = undefined;
                const jsonToken = sign({result: results}, process.env.JSON_KEY, {
                    expiresIn: "7d"
                })

                return res.json({
                    success: 1,
                    message: "Login successfully",
                    token: jsonToken
                });
            } else {
                return res.json({
                    success: 0,
                    data: "Incorrect Email or Password"
                })
            }
        });

    },

    getAllTotalCases: async (req, res) => {

        var start_date = moment();
        start_date = start_date.subtract(1, "days");
        start_date = start_date.format("YYYY-MM-DD HH:mm:ss");
        var end_date = moment().format("YYYY-MM-DD HH:mm:ss")
        
        let totalEmergencyReports = await new Promise((resolve, reject) => {
            getTotalActiveEmergencyReports((err, results) => {
                if(err){
                    return reject(err.message)
                }
                    return resolve(results[0].totalEmergencyReport)
            })
        })

        let totalResolvedEmergencyReports = await new Promise((resolve, reject) => {
            getTotalResolvedEmergencyReports((err, results) => {
                if(err){
                    return reject(err.message)
                }
                    return resolve(results[0].totalResolvedEmergencyReport)
            })
        })

        let totalCommunicableDiseaseReports = await new Promise((resolve, reject) => {
            getTotalCommunicableDiseaseReports((err, results) => {
                if(err){
                    return reject(err.message)
                }
                    return resolve(results[0].totalCommunicableDiseaseReport)
            })
        })

        let totalCommunicableDiseaseReportedOngoing = await new Promise((resolve, reject) => {
            getTotalCommunicableDiseaseReportedOngoing((err, results) => {
                if(err){
                    return reject(err.message)
                }
                    return resolve(results[0].totalCommunicableDiseaseReportedOngoing)
            })
        })

        let totalCommunicableDiseaseReportedResolved = await new Promise((resolve, reject) => {
            getTotalCommunicableDiseaseReportedResolved((err, results) => {
                if(err){
                    return reject(err.message)
                }   
                    
                    return resolve(results[0].totalCommunicableDiseaseReportedResolved)
            })
        })

        let totalCommunicableDiseaseReportedTodayOngoing = await new Promise((resolve, reject) => {
            getTotalCommunicableDiseaseReportedTodayOngoing({start_date, end_date}, (err, results) => {
                if(err){
                    return reject(err.message)
                }   
                    
                    return resolve(results[0].totalCommunicableDiseaseReportedOngoingToday)
            })
        })

        let totalCommunicableDiseaseReportedTodayResolved = await new Promise((resolve, reject) => {
            getTotalCommunicableDiseaseReportedTodayResolved({start_date, end_date}, (err, results) => {
                if(err){
                    return reject(err.message)
                }   
                    
                    return resolve(results[0].totalCommunicableDiseaseReportedResolvedToday)
            })
        })



    

        return res.json({
            success: 1,
            results: {
                totalEmergencyReports,
                totalResolvedEmergencyReports,
                totalCommunicableDiseaseReports,
                totalCommunicableDiseaseReportedOngoing,
                totalCommunicableDiseaseReportedResolved,
                totalCommunicableDiseaseReportedTodayOngoing,
                totalCommunicableDiseaseReportedTodayResolved
            }
        })

    },
    changeClinicPassword: (req, res) => {
        const body = req.body
        
        checkIfIdAndPasswordMatched(body, (err, results) => {
            if(err){
                return res.json({
                    success: false,
                    message: err.message
                })
            }

            let returnedData = []
            returnedData.push(results[0])

            if(results.length === 0){
                return res.json({
                    success: false,
                    message: 'Password not matched',
                })
            }

            const checkIfMatched = compareSync(body.old_password, returnedData[0].password)

            if(!checkIfMatched){
                return res.json({
                    success: false,
                    message: 'Old password is incorrect'
                })
            }

            const salt = genSaltSync(10);
            const new_password = hashSync(body.new_password, salt)

            updateNewPassword({new_password, user_id: body.user_id}, (err, finalResults) => {
                if(err){
                    return res.json({
                        success: false,
                        message: err.message
                    })
                }
                

                return res.json({
                    success: true,
                    message: "Password updated successfully!"
               })
            })
        })
    
    },
    
    clinicForgotPassword: (req, res) => {

        const body = req.body

        checkIfEmailExist(body, (err, results) => {
                if(err){
                    return res.json({
                        success: false,
                        message: err.message
                    })
                }

                if(results.length === 0){
                    return res.json({
                        success: false,
                        message: 'Email does not exist.'
                    })
                }

                body['recovery_password'] = generator.generate({
                    length: 10,
                    numbers: true,
                    exclude: '/'
                });

                addClinicRecoveryPassword(body, async (err, results) => {
                    if(err){
                        return res.json({
                            success: false,
                            message: err.message
                        })
                    }
                    
                   
                    await new Promise((resolve, reject) => {
                        sendLinkToEmail(body, (err, results) => {
                            if(err)
                            return reject(res.json({
                                success: false,
                                message: err.message
                            }))

                            
                            return resolve(res.json({
                                    success: true,
                                    data: results,
                                    message: 'Recovery password was sent to your email',
                            }))
                        })

                    })
                })
        })
    },

    updateClinicPassword: (req, res) => {
        const body = req.body

        checkIfEmailAndRecoveryPasswordMatched(body, (err, results) => {
            if(err){
                return res.json({
                    success: false,
                    message: err.message
                })
           }
           if(results.length === 0){
                return res.json({
                    success: false,
                    message: 'Recovery password is incorrect. Please try again.'
                })
             }

             
            const salt = genSaltSync(10);
            body.new_password = hashSync(body.new_password, salt)


            updateClinicCredentials({id: results.id, new_password: body.new_password}, (err, results) => {
                if(err)
                {
                     return res.json({
                         success: false,
                         message: error.message
                     })
                }

                return res.json({
                        success: true,
                        results: results,
                        message: 'Password updated successfully!'
                    })

            })
        })

    },



}