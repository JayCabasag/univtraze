const {getAllCommunicableDisease, getCommunicableDiseaseByName, updateCommunicableDiseaseCaseStatus, 
    deleteCommunicableDisease, getUserVisitedRooms, getUsersViaRoomIdAndDate, getAllCommunicableDiseaseReported,
getEmployeeDetailsById, getVisitorDetailsById, getStudentDetailsById, getCommunicableDiseaseById, getCommunicableDiseaseByStatus} = require('./communicable_disease.service')

module.exports = {
    getAllCommunicableDisease: (req, res) => {

        getAllCommunicableDisease( async (err, results) => {
            
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
                    message: "No disease found"
                });
                            
            }

            const queryResults = await Promise.all(
                
                results.map(async (disease) => {
                 
                 return new Promise((resolve, reject) => 
                  
                 getCommunicableDiseaseByName(disease, (err, results) => {
                     if (err) 
                       return reject(err)
                     else
                       return resolve({disease_name: disease.disease_name,totalCases: results.length, cases: results})
                   })
                 )
               })
             )

            //  console.log('queryResults', queryResults)

             return res.json({
                success: 1,
                data: queryResults
             })
             // now you give this queryResults back to your FE             
        })

    },

    getAllCommunicableDiseaseReported: (req, res) => {

        getAllCommunicableDiseaseReported(async (err, results) => {
            if(err){
                console.log(err)
                return res.json({
                    success: 0,
                    message: "Database connection Error"
                });
                
            }

            const queryResults = await Promise.all(
                
                results.map(async (user) => {
                    
                    if(user.type === 'Student'){
                          return new Promise((resolve, reject) => getStudentDetailsById(user.user_id, (err, results) => {
                             if (err) 
                               return reject(err)
                             else
                               return resolve({id: user.id, user_id: user.user_id, email: user.email, userType: user.type, reportedDate: user.createdAt, information: results})
                           })
                     )
                    }

                    if(user.type === 'Employee'){
                        return new Promise((resolve, reject) =>  getEmployeeDetailsById(user.user_id, (err, results) => {
                           if (err) 
                             return reject(err)
                           else
                             return resolve({id: user.id,user_id: user.user_id, email: user.email, userType: user.type, reportedDate: user.createdAt, information: results})
                         })
                   )
                  }

                    if(user.type === 'Visitor'){
                        return new Promise((resolve, reject) => getVisitorDetailsById(user.user_id, (err, results) => {
                           if (err) 
                             return reject(err)
                           else
                             return resolve({id: user.id,user_id:user.user_id, email: user.email, userType: user.type,  reportedDate: user.createdAt, information: results})
                         })
                   )
                  }
               
               })
             )

            return res.json({
                success: 1,
                data: queryResults
            });
        });
    },

    getCommunicableDiseaseById: (req, res) => {
        
        const body = req.body;

        getCommunicableDiseaseById(body, (err, results) => {
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

    getCommunicableDiseaseByName: (req, res) => {
        
        const body = req.body;

        getCommunicableDiseaseByName(body, (err, results) => {
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

    updateCommunicableDiseaseCaseStatus: (req, res) => {

        const body = req.body

        updateCommunicableDiseaseCaseStatus(body, (err, results) => {
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
    deleteCommunicableDisease: (req, res) => {

        const body = req.body

        deleteCommunicableDisease(body, (err, results) => {
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


    getFirstDegreeCommunicableDisease: (req, res) => {
        const body = req.body

        var start_date = new Date(body.date_reported);
        start_date.setDate(start_date.getDate() - body.date_range);

        body['start_date'] = start_date.toISOString().replace(/T/, ' ').replace(/\..+/, '')
        body['end_date'] = new Date(body.date_reported).toISOString().replace(/T/, ' ').replace(/\..+/, '')

        getUserVisitedRooms(body, async (err, results) => {
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
                    data: "No rooms visited found",
                    config: body
                });
            }
            
            //COnstructing of return array to a single array of rooms
            let newRoomArray = [];
            results.map((room_id) => {
                return newRoomArray.push(room_id.room_id)
            })


            const firstDegreePromise = await Promise.all(
                
                newRoomArray.map(async (room_id) => {
                
                 let newBody = body
                 newBody['room_id'] = room_id

                 return new Promise((resolve, reject) => 
                   getUsersViaRoomIdAndDate(newBody, (err, results) => {
                      if (err) 
                        return reject(err)
                      else
                         return resolve({room_id: room_id, userVisited: results})
                   })
                 )
               })
             )


             return res.json({
                success: 1,
                data: {firstDegreeVictims: firstDegreePromise}
             })

        })
        

    },

    getAllDiseaseVictims: (req, res) => {

        const body = req.body
        
        var start_date = new Date(body.date_reported);
        start_date.setDate(start_date.getDate() - body.date_range);

        body['start_date'] = start_date.toISOString().replace(/T/, ' ').replace(/\..+/, '')
        body['end_date'] = new Date(body.date_reported).toISOString().replace(/T/, ' ').replace(/\..+/, '')

        getUserVisitedRooms(body, async (err, results) => {
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
                    data: "No rooms visited found",
                    config: body
                });
            }
            
            //COnstructing of return array to a single array of rooms
            let newRoomArray = [];
            results.map((room_id) => {
                return newRoomArray.push(room_id.room_id)
            })

            let firstDegreeVictimsId = [];
            let secondDegreeVictimsId = [];
            let thirdDegreeVictimsId = [];

            await Promise.all(
                
                newRoomArray.map(async (room_id) => {
                
                 let newBody = body
                 newBody['room_id'] = room_id
                 

                 return new Promise((resolve, reject) => 
                   getUsersViaRoomIdAndDate(newBody, (err, results) => {
                      if (err) 
                        return reject(err)
                      else{
                        let returnArray = [];

                        results.map((victim) => {
                            return returnArray.push(victim.user_id) 
                        })
                        
                        return resolve({room_id: room_id, userVisitedById: returnArray, userVisitedByData: results})
                      } 
                   })
                 )
               })
             ).then((results) => {

                let returnArray = [];

                results.map((result) => {
                    return returnArray.push(...result.userVisitedById)
                })

                let initialReturnArray = []
                initialReturnArray.push(...returnArray)
                
                firstDegreeVictimsId.push(...new Set(initialReturnArray))

                const valueToRemove = body.user_id
                const filteredItems = firstDegreeVictimsId.filter(function(item) {
                return item !== valueToRemove
                })

                firstDegreeVictimsId = filteredItems
                
                

             })


             return res.json({
                success: 1,
                firstDegreeVictimsId: firstDegreeVictimsId
             })

        })
    },

    getCommunicableDiseaseByStatus: (req, res) => {
        
        const body = req.body;

        getCommunicableDiseaseByStatus(body, (err, results) => {
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
}