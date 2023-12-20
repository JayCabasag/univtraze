import React, { useState, useEffect } from 'react'
import Header from '../components/Header'
import back from '../assets/back-icon.png'
import { useNavigate} from "react-router-dom"
import Breadcrumbs from '../components/Breadcrumbs'
import axios from 'axios'


export default function Users({users}) {

    const [allUsers, setAllUsers] = useState([])

    const navigate = useNavigate()

    const admin = () => {
        navigate('/admin')
      }
      const userdata = () => {
        navigate('/admin/users/userdata')
      }

      useEffect(() => {
        handleGetData()
      }, [])
    
      const handleGetData = async() => {
        const token = localStorage.getItem('token');
    
        const headers = {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        };
    
        
        await axios
          .get(
            'https://univtraze.herokuapp.com/api/user/getAllUsers',
            {
              headers: headers,
            }
          ).then(resp => {
            setAllUsers(resp.data.data);
        });

    }
    
  return (
    <div className='users'>
         <Header />
         <div className="container">
         <Breadcrumbs event={admin} identifier="Dashboard / " current="Users"/>
            <p className="user-title">Users ({allUsers.length})</p>
                    
            <table className='table-user'>
             <tr className='tr-user'>
                 <th>UID</th>
                 <th>Full Name</th>
                 <th>Mobile No.</th>
                 <th>type</th>
                 <th>Email</th>
             </tr>
             <tbody>
                {
                    allUsers && allUsers?
                    allUsers.map((user) => {
                        return <tr>
                                <td>{user.user_id}</td>
                                <td className='nam'onClick={userdata}>{
                                    user.information === undefined?
                                    "Not verified"
                                    :
                                    user.information.firstname
                                }
                                <span> </span>
                                {
                                    user.information === undefined?
                                    null
                                    :
                                    user.information.lastname
                                }</td>
                                <td>
                                    {
                                    user.information === undefined?
                                    null
                                    :
                                    user.information.mobile_number
                                    }
                                </td>
                                <td>{user.userType}</td>
                                <td>{user.email}</td>
                            </tr>
                    })
                    :
                    null
                }
                
             </tbody>
         </table>
         </div>
         <div className="spacer"></div>
         </div>   
  )
}