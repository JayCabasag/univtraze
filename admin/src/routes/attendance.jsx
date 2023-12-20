import React from 'react'
import Header from '../components/Header'
import back from '../assets/back-icon.png'
import Breadcrumbs from '../components/Breadcrumbs'
import { useNavigate} from "react-router-dom"
import { useEffect, useState } from 'react'
import axios from 'axios'


const Attendance = () => {
    const navigate = useNavigate()

    const [allRooms, setAllRooms] = useState([])

    useEffect(() => {
      handleGetAllRooms()
    }, [])

    const handleGetAllRooms = async () => {
        
        const token = localStorage.getItem('token');

        const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        };

        await axios
        .get(
            'https://univtraze.herokuapp.com/api/rooms/allRooms',
            {
            headers: headers,
            }
        ).then(resp => {
            setAllRooms(resp.data.data);
        });
    }
    

    const admin = () => {
        navigate('/admin')
    }

    const attendance = (room_id, room_number, building_name) => {
        navigate(`/admin/attendance-room/${room_id}&${room_number}&${building_name}`)
    }

  return (
    <div className='attendance'>
        <Header/>
        <div className="container">
            <Breadcrumbs event={admin} identifier="Dashboard / " current="Attendance"/>
            <div className="cons">
            <p className="emergency">Attendance</p>
            </div>
            <div className="card-storage">

                {
                    allRooms.map((room) => {
                        return   <div className="room" onClick={() => {attendance(room.room_id, room.room_number, room.building_name)}}>
                                    <p className="room__title">{room.room_number}</p>
                                    <p className="room__section">{room.room_name}</p>
                                    <p className="room__content">{
                                        room.totalUserVisited
                                    } scanned this room</p>
                                </div> 
                    })
                }
               
                <div className="spacer"></div> 
                
                
            </div>
            </div>

    </div>
  )
}

export default Attendance