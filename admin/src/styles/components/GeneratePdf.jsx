import React, {useEffect, useState} from 'react'
import moment from 'moment'
import jsPDF from 'jspdf'
import axios from 'axios'

const GeneratePdf = ({closePreviewer, props: {roomId, roomNumber, buildingName}}) => {

    const [userVisitedLists, setUserVisitedLists] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        getRoomVisitors(roomId * 1)
      }, [])
  
  
      const getRoomVisitors = async (room_id) => {
        setIsLoading(true)
        const token = localStorage.getItem('token');
  
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
  
        await axios.post('https://univtraze.herokuapp.com/api/rooms/searchUsersByRoomId', {room_id}, {
            headers: headers
          }).then(resp => {
              
              setIsLoading(false)
              if(resp.data.success === 0){
                  return alert('An error occured')
              }
  
              if(resp.data.success === 1){
                 return setUserVisitedLists(resp.data.data)
              } 
              
              alert('An error occured please try again later.')
      });
      setIsLoading(false)
        
      }

  const downloadPDF = () => {
     var doc = new jsPDF("p", "pt", [840, 1191]);
        doc.html(
            document.querySelector("#dataContainer"),
            {
                callback: function(pdf){
                    pdf.save(`Room-${roomId}-${roomNumber}-${buildingName}-reportPDF(${moment().format("YYYY-MM-DD")}).pdf`)
                }
            }
        )
  }  
  return (
    <div style={{width: '100%', height: '100vh', position: 'fixed', backgroundColor: 'rgba(54, 77, 57, .5)', alignItems: 'center', justifyContent: 'center', display: 'flex'}}>
        <div style={{width: "842px", height: "100vh", backgroundColor: 'white', overflowY: 'auto', display: 'flex', flexDirection: 'column'}}>
            <button style={{padding: '2rem', fontWeight: 'bold', color: 'black', fontSize: '15px'}} onClick={() => {closePreviewer()}}>Close</button>
            <div style={{width: "842px", height: "auto",minHeight: '1191px', backgroundColor: 'white', overflowY: 'auto', padding: '2rem'}} id="dataContainer">
                <h1 style={{fontSize: '1.2rem', fontWeight: 'bold'}}>Room ID: {roomId}</h1>
                <h1 style={{fontSize: '1.2rem', fontWeight: 'bold'}}>Room Number: {roomNumber}</h1>
                <h1 style={{fontSize: '1.2rem', fontWeight: 'bold'}}>Bulding name: {buildingName}</h1>
               
                <p>Retrived date: {moment().format("MM-DD-YYYY hh:mm A")}</p>
                <div style={{width: '100%', fontWeight: 'bold', fontSize: '18px', alignItems: 'center', justifyContent: 'center', display: 'flex'}}>User visited lists</div>
                    <table style={{width: '800px'}}>
                    <tr className='tr-user'>
                        <th>Uid</th>
                        <th>type</th>
                        <th>Fullname</th>
                        <th>Phone no.</th>
                        <th>Email</th>
                    </tr>
                    {
                        userVisitedLists && userVisitedLists?
                        userVisitedLists.map((data) => {
    
                            if(data.information === 'User not found'){
                                return
                            }
    
                            if(data.information.data === 'Not verified'){
                                return  <tr>
                                            <td>{data.information.id}</td>
                                            <td>{data.information.type}</td>
                                            <td>Not verified</td>
                                            <td>Not verified</td>
                                            <td>{data.information.email}</td>
                                        </tr>
                            }
                            
                            return <tr>
                                    <td>{data.information.id}</td>
                                    <td>{data.information.type}</td>
                                    <td>{data.information.data.firstname + " " + data.information.data.lastname}</td>
                                    <td>{data.information.data.mobile_number}</td>
                                    <td>{data.information.data.email}</td>
                                </tr>
                        })
                        :
                        null
                        }
                    </table>
            </div>

            <button style={{backgroundColor: '#28cd41', padding: '2rem', fontWeight: 'bold', color: 'white', fontSize: '15px'}} onClick={() => {downloadPDF()}}>Download pdf</button>
        </div>
    </div>
  )
}

export default GeneratePdf