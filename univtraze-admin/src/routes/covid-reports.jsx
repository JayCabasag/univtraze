import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import next from '../assets/next-icon.png';
import axios from 'axios';

export default function DiseaseReports() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [userType, setUserType] = useState('');
  const [userId, setUserId] = useState('');
  const [caseNumber, setCaseNumber] = useState(0);
  const [confirmDate, setConfirmDate] = useState('');
  const [roomVisited, setRoomVisited] = useState([]);
  const [btnDisplay, setBtnDisplay] = useState('none');

  const [allCommunicableDisease, setAllCommunicableDisease] = useState([]);

  const users = () => {
    navigate('/admin');
  };

  const covidoverview = (user_id, case_id, type) => {
    navigate(
      `/admin/communicable-disease-overview/${user_id}/${case_id}/${type}`,
    );
  };

  const sendNotification = async (case_id, date_reported, email, fullname) => {
    const token = localStorage.getItem('token');

    var data = {
      sent_by: 'Univtraze clinic App',
      user_email: email,
      email_subject: 'Clinic case report confirmation',
      email_message: 'Communicable disease report recieved',
      case_number: case_id,
      disease_name: 'Communicable disease',
      date_reported: date_reported,
      fullname: fullname,
    };

    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };

    axios
      .post(
        'https://univtraze.herokuapp.com/api/mailer/notifyUserForCaseReported',
        data,
        {
          headers: headers,
        },
      )
      .then(resp => {
        if (resp.data.success === 1) {
          alert('Email sent successfully');
          return;
        }

        alert('Failed sending email');
      });
  };

  const showData = async (
    case_id,
    user_id,
    confirmedDate,
    email,
    fullname,
    userType,
  ) => {
    const convertedUTCDateToLocal = new Date(
      confirmedDate,
    ).toLocaleDateString();
    setUserId(user_id);
    setUserType(userType);
    setConfirmDate(convertedUTCDateToLocal);
    setCaseNumber(case_id);
    setEmail(email);
    setName(fullname);

    const token = localStorage.getItem('token');

    var data = {
      user_id: user_id,
    };
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };

    axios
      .post(
        'https://univtraze.herokuapp.com/api/rooms/userVisitedRooms',
        data,
        {
          headers: headers,
        },
      )
      .then(resp => {
        setRoomVisited(resp.data.data);
      });

    setBtnDisplay('btn-primary btn-primary--covid-report');
  };

  useEffect(() => {
    handleGetData();
  }, []);

  const handleGetData = async () => {
    const token = localStorage.getItem('token');

    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };

    await axios
      .get(
        'https://univtraze.herokuapp.com/api/communicable_disease/getAllCommunicableDiseaseReported',
        {
          headers: headers,
        },
      )
      .then(resp => {
        setAllCommunicableDisease(resp.data.data);
      });
  };

  return (
    <div className="covidreport">
      <div className="container container--report">
        <h2 className="covid-report">Disease Reports</h2>
        <div className="card-table">
          <div>
          <table className="table-covid">
            <thead>
              <tr>
                <th>Case No</th>
                <th>Full Name</th>
                <th>Email</th>
                <th>Mobile No</th>
              </tr>
            </thead>

            <tbody>
              {allCommunicableDisease.map(disease => {
                return (
                  <tr
                    key={disease.id}
                    onClick={() =>
                      showData(
                        disease.id,
                        disease.user_id,
                        disease.reportedDate,
                        disease.information.email,
                        disease.information.firstname +
                          ' ' +
                          disease.information.lastname,
                        disease.userType,
                      )
                    }
                  >
                    <td> {disease.id} </td>
                    <td>
                      {disease.information === undefined
                        ? null
                        : disease.information.firstname}
                      <span> </span>
                      {disease.information === undefined
                        ? null
                        : disease.information.lastname}
                    </td>
                    <td>
                      {disease.information === undefined
                        ? null
                        : disease.information.email}
                    </td>
                    <td>
                      {disease.information === undefined
                        ? null
                        : disease.information.mobile_number}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div style={{ display: 'flex', flexDirection: 'row' }}>
            <a href="#" class="pagination-btn previous round">
              &#8249;
            </a>
            <a href="#" class="pagination-btn next round">
              &#8250;
            </a>
          </div> 
          </div>
          <div className="card-details">
            <button
              className="btn-notify"
              onClick={() => {
                sendNotification(caseNumber, confirmDate, email, name);
              }}
            >
              Notify
            </button>
            <p className="full-details">Full Details</p>
            <p className="covid-name">{name}</p>
            <p className="confirm">Case reported on {confirmDate}</p>
            <p className="room-visited">Room Visited</p>
            <div className="card-room">
              <div className="card-flex">
                {roomVisited.length === 0 ? (
                  <p style={{ width: 380, textAlign: 'center' }}>
                    No room visited
                  </p>
                ) : null}
                {roomVisited.map(room => {
                  return (
                    <div className="card-one" key={room.id}>
                      <p className="wan">{room.room_number}</p>
                      <p className="date">
                        {new Date(room.createdAt).toLocaleDateString()}
                      </p>
                      <img src={next} className="con"></img>
                      <p className="oras">
                        {new Date(room.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
            <button
              className={btnDisplay}
              onClick={() => covidoverview(userId, caseNumber, userType)}
            >
              Overview
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
