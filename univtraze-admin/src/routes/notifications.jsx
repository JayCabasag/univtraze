import React, { useState, useEffect } from 'react'
import Header from '../components/Header'
import back from '../assets/back-icon.png'
import { useNavigate} from "react-router-dom"
import Breadcrumbs from '../components/Breadcrumbs'
import axios from 'axios'
import moment from 'moment'


export default function Notifications() {

    const [currentPageNumber, setCurrentPageNumber] = useState(1)
    const [pageLimit, setPageLimit] = useState(25)
    const [notificationLists, setNotificationLists] = useState([])

    useEffect(() => {
      handleGetAdminNotifications(1, 25)
    }, [])


    const handleGetAdminNotifications = async (pageNumber, limit) => {

      const starts_at = pageNumber
      const page_limit = limit

      const token = localStorage.getItem('token');

       const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
        }

        const data = {
          page_limit: page_limit,
          notification_for: 0,
          start_at: starts_at
        }


        axios.post('https://univtraze.herokuapp.com/api/notifications/getAdminNotifications', data, {
          headers: headers
        }).then(resp => {
              setNotificationLists(resp.data.data)
          });
    }
    
    const navigate = useNavigate()

    const admin = () => {
        navigate('/admin')
      }
    
    const nextPage = async () => {
      if(notificationLists.length >= 25) {
        setCurrentPageNumber(currentPageNumber + 1)
        handleGetAdminNotifications(currentPageNumber  * 25, 25)
        return
      }

      alert('No more notifiations')
    }

    const backPage = async () => {
      
      if(currentPageNumber === 1) {
        return setCurrentPageNumber(1)
      } 

      setCurrentPageNumber(1)
      handleGetAdminNotifications(1,25)
    }

  const handleUpdateNotificationStatus = async (notification_id, notification_type) => {
    if(notification_type === 'emergency_report'){
      
      const token = localStorage.getItem('token');

       const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
        }

        const data = {
            id: notification_id,
            is_viewed: 1
        }


        axios.post('https://univtraze.herokuapp.com/api/notifications/updateAdminNotificationStatus', data, {
          headers: headers
        }).then(resp => {
              if(resp.data.success === 1){
                return navigate('/admin/emergencyreport')
              }

              return navigate('/admin/emergencyreport')
          });
          return navigate('/admin/emergencyreport')
      
    }
    if(notification_type === 'communicable_disease'){
      const token = localStorage.getItem('token');

       const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
        }

        const data = {
            id: notification_id,
            is_viewed: 1
        }


        axios.post('https://univtraze.herokuapp.com/api/notifications/updateAdminNotificationStatus', data, {
          headers: headers
        }).then(resp => {
              if(resp.data.success === 1){
                return navigate('/admin/communicable_disease')
              }

              return navigate('/admin/communicable_disease')
          });
          return navigate('/admin/communicable_disease')
    }

    const token = localStorage.getItem('token');

    const headers = {
     'Content-Type': 'application/json',
     'Authorization': `Bearer ${token}`
     }

     const data = {
         id: notification_id,
         is_viewed: 1
     }


     axios.post('https://univtraze.herokuapp.com/api/notifications/updateAdminNotificationStatus', data, {
       headers: headers
     }).then(resp => {
           if(resp.data.success === 1){
             
           }
       });
     
  }

  return (
    <div className='users'>
         <div className="container">
         <Breadcrumbs event={admin} identifier="Dashboard / " current="Notifications"/>

          <div style={{display: 'flex', flexDirection: 'row'}}>
            <p style={{fontWeight: 'bold', width: '15px', backgroundColor: 'white', textAlign: 'center', cursor: 'pointer'}} onClick={() => backPage()}>{'<'}</p>
            <p style={{fontWeight: 'bold', width: '15px', borderWidth: '1px', textAlign: 'center'}}>{currentPageNumber}</p>
            <p style={{fontWeight: 'bold', width: '15px', backgroundColor: 'white', textAlign: 'center',  cursor: 'pointer'}} onClick={() => nextPage()}>{'>'}</p>
          </div>
          <table>
            <tr>
              <th>Notifications</th>
            </tr>
              {
                notificationLists && notificationLists?
                
                notificationLists.map((notificationList) => {
                  return  <tr key={notificationList.id} onClick={() => {handleUpdateNotificationStatus(notificationList.id, notificationList.notification_type)}}>
                            <td style={{cursor: 'pointer',textAlign: 'left', paddingLeft: '15px', display: 'flex', width: '100%', alignItems: 'center'}}>
                              <div style={{float: 'left'}}> <span style={{fontWeight: 'bold'}}>{notificationList.notification_title}</span> <br /> {notificationList.notification_type} - {notificationList.notification_description} - {moment(notificationList.createdAt).format('MM-DD-YYYY HH:mm:ss A')} </div>{
                              notificationList.notification_is_viewed === 0?
                              <div style={{width: 7, height: 7, backgroundColor: 'red',borderRadius: '3.5px', float: 'right', marginLeft: '10px'}}></div>
                              :
                              null
                            }</td>
                          </tr>
                })
                :
                null
              }
            
          </table>


         </div>
         <div className="spacer"></div>
         </div>
         
         

   
  )
}