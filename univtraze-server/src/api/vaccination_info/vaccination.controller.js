const { insertVaccineData, updateVaccineData, checkIfVaccineRecordExists } = require("./vaccination.service");

module.exports = {
    updateVaccineData: (req, res) => {
        const body = req.body;
            updateVaccineData(body, (err, results) => {
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

    },

    insertVaccineData: (req, res) => {
        const body = req.body;
        
        insertVaccineData(body, (err, results) => {
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
        
    },
    addVaccineData: (req, res) => {
        const body = req.body

        checkIfVaccineRecordExists(body, (err, results) => {
            if(err){
                return res.json({
                    success: 0,
                    message: 'Database connection error'
                })
            }
            if(results.length <= 0){
                insertVaccineData(body, (err, results) => {
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
            }

            updateVaccineData(body, (err, results) => {
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

        })

    },

    getVaccineDataByUserId: (req, res) => {
        const body = req.body 

        checkIfVaccineRecordExists(body, (err, results) => {
          if(err){
            return res.json({
                success: 0,
                message: 'Database connection error'
            })
          }

          if(results.length === 0){
            return res.json({
                success: 1,
                message: 'No Vaccine record found'
            })
          }

          return res.json({
            success: 1,
            results: results[0]
          })
        })
    }
}