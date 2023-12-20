
const { addCovidPositive, addEmergencyReport, addDailyAssessement, searchEmergencyReportsViaDate, 
    addCommunicableDiseaseCase, getAllEmergencyReports, getAllEmergencyReportsResolved, 
    getAllEmergencyReportsByStatus, updateEmergencyReportCaseStatus, deleteEmergencyReportCase, 
    getAllEmergencyReportsByVictimName, getAllEmergencyReported, addReportNotificationToUser, addReportNotificationToClinic, addReportNotificationToAdmin} = require("./covid_case.service");

module.exports = {
    getAllEmergencyReported: (req, res) => {

        getAllEmergencyReported((err, results) => {
            if(err){
                console.log(err)
                return res.json({
                    success: 0,
                    message: "Database connection Error"
                });
                
            }

            return res.json({
                success: 1,
                data: results
            });
        })

    },

    addCommunicableDiseaseCase: (req, res) => {
        
        const body = req.body;

        addCommunicableDiseaseCase(body, async (err, results) => {
            if(err){
                console.log(err)
                return res.json({
                    success: 0,
                    message: "Database connection Error"
                });
                
            }

            //Adding notification to user, clinic, admin
            await new Promise((resolve, reject) => {
                addReportNotificationToUser({
                    notification_title: 'Reported as communicable disease victim',
                    notification_description: 'Communicable disease victim report has been sent successfully.', 
                    notification_source: 'communicable_disease_report', 
                    notification_type: 'communicable_disease_report', 
                    notification_is_viewed: 0,
                    notification_for: body.user_id
                }, (err, results) => {
                    if(err){
                        return reject('Error adding user notification ' + err.message)
                    }

                    return resolve('Added notification successfully')
                })
            })

            await new Promise((resolve, reject) => {
                addReportNotificationToAdmin({
                    notification_title: 'New communicable disease reported',
                    notification_description: 'Communicable disease victim reported under the user ID: ' + body.user_id, 
                    notification_source: 'communicable_disease_report', 
                    notification_type: 'communicable_disease_report', 
                    notification_is_viewed: 0,
                    notification_for: 0
                }, (err, results) => {
                    if(err){
                        return reject('Error adding user notification ' + err.message)
                    }

                    return resolve('Added notification successfully')
                })
            })

            await new Promise((resolve, reject) => {
                addReportNotificationToClinic({
                    notification_title: 'New communicable disease reported',
                    notification_description: 'Communicable disease victim reported under the user ID: ' + body.user_id, 
                    notification_source: 'communicable_disease_report', 
                    notification_type: 'communicable_disease_report', 
                    notification_is_viewed: 0,
                    notification_for: 0
                }, (err, results) => {
                    if(err){
                        return reject('Error adding user notification ' + err.message)
                    }

                    return resolve('Added notification successfully')
                })
            })

            return res.json({
                success: 1,
                data: results
            });
        });
    },

    addCovidPositive: (req, res) => {
        const body = req.body;
        addCovidPositive(body, (err, results) => {
            if(err){
                console.log(err)
                return res.json({
                
                    success: 0,
                    message: "Database connection Error"
                
                });
                
            }

            return res.json({
                success: 1,
                data: results
            });
        });
    },
    
    addDailyAssessment: (req, res) => {
        
        const body = req.body;

        addDailyAssessement(body, (err, results) => {
            if(err){
                console.log(err)
                return res.json({
                    success: 0,
                    message: "Database connection Error"
                });
                
            }

            return res.json({
                success: 1,
                data: body
            });
        });
    },

    addEmergencyReport: (req, res) => {
        const body = req.body;
        addEmergencyReport(body, async (err, results) => {
            if(err){
                console.log(err)
                return res.json({
                    success: 0,
                    message: "Database connection Error"
                });
                
            }
             
    
            //Adding notification to user, clinic, admin
            await new Promise((resolve, reject) => {
                addReportNotificationToUser({
                    notification_title: 'Emergency report sent',
                    notification_description: 'An emergency report under patient name : ' + body.patient_name + ' has been sent successfully.', 
                    notification_source: 'emergency_report', 
                    notification_type: 'emergency_report', 
                    notification_is_viewed: 0,
                    notification_for: body.reported_by
                }, (err, results) => {
                    if(err){
                        return reject('Error adding user notification ' + err.message)
                    }

                    return resolve('Added notification successfully')
                })
            })

            await new Promise((resolve, reject) => {
                addReportNotificationToAdmin({
                    notification_title: 'New emergency report reported',
                    notification_description: 'Emergency report has been reported under patient name: ' + body.patient_name, 
                    notification_source: 'emergency_report', 
                    notification_type: 'emergency_report', 
                    notification_is_viewed: 0,
                    notification_for: 0
                }, (err, results) => {
                    if(err){
                        return reject('Error adding user notification ' + err.message)
                    }

                    return resolve('Added notification successfully')
                })
            })

            await new Promise((resolve, reject) => {
                addReportNotificationToClinic({
                    notification_title: 'New emergency report reported',
                    notification_description: 'Emergency report has been reported under patient name: ' + body.patient_name, 
                    notification_source: 'emergency_report', 
                    notification_type: 'emergency_report', 
                    notification_is_viewed: 0,
                    notification_for: 0
                }, (err, results) => {
                    if(err){
                        return reject('Error adding user notification ' + err.message)
                    }

                    return resolve('Added notification successfully')
                })
            })

            
            return res.json({
                success: 1,
                data: results
            });
        });
    },

    searchEmergencyReportsViaDate: (req, res) => {
        const body = req.body;

        searchEmergencyReportsViaDate(body, (err, results) => {
            if(err){
                console.log(err)
                return res.json({
                    success: 0,
                    message: "Database connection Error"
                });
                
            }

            return res.json({
                success: 1,
                data: results
            });
        });

    },

    getAllEmergencyReports: (req, res) => {

        getAllEmergencyReports ((err, results) => {
            
            if(err){
                console.log(err)
                return res.json({
                    success: 0,
                    message: "Database connection Error"
                });
                            
            }

            if(results.length === 0){
                return res.json({
                    success: 0,
                    message: "No emergency reports found"
                });
                            
            }

            
            return res.json({
                success: 1,
                data: results
            });               
            
        })

    },

    getAllEmergencyReportsResolved: (req, res) => {

        getAllEmergencyReportsResolved ((err, results) => {
            
            if(err){
                console.log(err)
                return res.json({
                    success: 0,
                    message: "Database connection Error"
                });
                            
            }

            if(results.length === 0){
                return res.json({
                    success: 0,
                    message: "No emergency reports found"
                });
                            
            }

            
            return res.json({
                success: 1,
                data: results
            });               
            
        })

    },
    getAllEmergencyReportsByVictimName: (req, res) => {
        
        const body = req.body

        getAllEmergencyReportsByVictimName(body, (err, results) => {
            
            if(err){
                console.log(err)
                return res.json({
                    success: 0,
                    message: "Database connection Error"
                });
                            
            }

            if(results.length === 0){
                return res.json({
                    success: 0,
                    message: "No emergency reports found"
                });
                            
            }

            
            return res.json({
                success: 1,
                data: results
            });        

        })
    },
    getAllEmergencyReportsByStatus: (req, res) => {

        const body = req.body

        getAllEmergencyReportsByStatus(body, (err, results) => {
            
            if(err){
                console.log(err)
                return res.json({
                    success: 0,
                    message: "Database connection Error"
                });
                            
            }

            if(results.length === 0){
                return res.json({
                    success: 0,
                    message: "No emergency reports found"
                });
                            
            }

            
            return res.json({
                success: 1,
                data: results
            });        

        })
    },

    updateEmergencyReportCaseStatus: (req, res) => {
        
        const body = req.body

        updateEmergencyReportCaseStatus(body, (err, results) => {
            
            if(err){
                console.log(err)
                return res.json({
                    success: 0,
                    message: "Database connection Error"
                });
                
            }

            if(results.affectedRows === 0){
                return res.json({
                    success: 0,
                    data: "No data found for this case"
                });
            }

            return res.json({
                success: 1,
                data: results
            }); 

        })

    },
    deleteEmergencyReportCase: (req, res) => {
        const body = req.body

        deleteEmergencyReportCase(body, (err, results) => {
            if(err){
                console.log(err)
                return res.json({
                    success: 0,
                    message: "Database connection Error"
                });
                
            }

            if(results.affectedRows === 0){
                return res.json({
                    success: 0,
                    data: "No data found for this case"
                });
            }

            return res.json({
                success: 1,
                data: results
            }); 
        })
    }


}