import React, { useState, useEffect } from 'react';
import Button from '../components/Button';
import Card from '../components/Card';
import user from '../assets/card__icon.png';
import covid from '../assets/covid_icon.png';
import phone from '../assets/phone_icon.png';
import note from '../assets/notes_icon.png';
import { useNavigate } from 'react-router-dom';

export default function DashboardPage() {
  const [localCases, setLocalCases] = useState(0);
  const [deaths, setDeaths] = useState(0);
  const [recovered, setRecovered] = useState(0);
  const [whileCounting, setWhileCounting] = useState(true);
  const [allUsers, setAllUsers] = useState([]);
  const [allCommunicableDisease, setAllCommunicableDisease] = useState([]);
  const [allEmergencyReports, setAllEmergencyReports] = useState([]);

  // useEffect(() => {
  //   setInterval(() => {
  //     GetCovidData();
  //   }, 1000);
  // }, [])

  // const GetCovidData = async () => {
  //   await axios.get('https://disease.sh/v3/covid-19/countries/PH?strict=true').then(resp => {
  //     const data = resp.data;

  //     setLocalCases(data.cases)
  //     setDeaths(data.deaths)
  //     setRecovered(data.recovered)
  // });
  // }

  // useEffect(() => {
  //   handleGetData()
  // }, [])

  // const handleGetData = async() => {
  //   const token = localStorage.getItem('token');

  //   const headers = {
  //     'Content-Type': 'application/json',
  //     Authorization: `Bearer ${token}`,
  //   };

  //   await axios
  //     .get(
  //       'https://univtraze.herokuapp.com/api/user/getAllUsers',
  //       {
  //         headers: headers,
  //       }
  //     ).then(resp => {
  //       setAllUsers(resp.data.data);
  //   });

  //   await axios
  //     .get(
  //       'https://univtraze.herokuapp.com/api/communicable_disease/getAllCommunicableDiseaseReported',
  //       {
  //         headers: headers,
  //       }
  //     ).then(resp => {
  //       setAllCommunicableDisease(resp.data.data);
  //   });

  //   await axios
  //   .get(
  //     'https://univtraze.herokuapp.com/api/covid_cases/getAllEmergencyReported',
  //     {
  //       headers: headers,
  //     }
  //   ).then(resp => {
  //     setAllEmergencyReports(resp.data.data);
  // });

  // }

  const navigate = useNavigate();

  const users = () => {
    navigate('/admin/users');
  };

  const covidreport = () => {
    navigate('/admin/disease-reports');
  };

  const emergency = () => {
    navigate('/admin/emergency-reports');
  };

  const attendance = () => {
    navigate('/admin/attendance');
  };

  return (
    <div className="section">
      <div className="container space-top">
        <h3 className="welcome-back">Welcome Back, Admin</h3>
        <h1 className="update">Here's an update for today</h1>
      </div>
      <div className="card-container">
        <Card
          redir={users}
          label="Users"
          data={allUsers.length}
          type="users"
          design="cards card-1"
          icon={user}
        />
        <Card
          redir={covidreport}
          label="Disease reports"
          data={allCommunicableDisease.length}
          type="Disease reports"
          design="secondary-cards card-2"
          icon={covid}
        />
        <Card
          redir={emergency}
          label="Emergency reports"
          data={allEmergencyReports.length}
          type="emergency-reports"
          design="secondary-cards card-3"
          icon={phone}
        />
        <Card
          redir={attendance}
          label="Attendance"
          data="See all"
          type="attendance"
          design="secondary-cards card-4"
          icon={note}
        />
        <div className="analytics">
          <p className="covid-update">Covid Update Philippines</p>
          <div className="covid-details">
            <p className="local-cases">Local Cases</p>
            <p className="data">{localCases.toLocaleString()}</p>
            <p className="deaths local-cases">Deaths</p>
            <p className="data">{deaths.toLocaleString()}</p>
            <p className="deaths local-cases">Recovered</p>
            <p className="data">{recovered.toLocaleString()}</p>
          </div>
          <Button
            destination={'/admin/covid-full-details'}
            label="See full details"
          />
        </div>
      </div>
    </div>
  );
}
