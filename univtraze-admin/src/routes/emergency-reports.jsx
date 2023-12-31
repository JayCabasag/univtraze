import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import axios from 'axios';
import 'react-day-picker/dist/style.css';
import { format } from 'date-fns';

export default function Emergencyreports() {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(new Date());

  const [allEmergencyReports, setAllEmergencyReports] = useState([]);

  const [showNoResultsFound, setshowNoResultsFound] = useState(false);

  useEffect(() => {
    getEmergencyReportForToday(new Date());
  }, []);

  const admin = () => {
    navigate('/admin');
  };

  const getEmergencyReportForToday = async date => {
    setAllEmergencyReports([]);
    setshowNoResultsFound(false);

    const newFormatedDate = moment(date).format('yyyy-MM-DD');

    const token = localStorage.getItem('token');

    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };

    const data = {
      date: newFormatedDate,
    };

    await axios
      .post(
        'https://univtraze.herokuapp.com/api/covid_cases/searchEmergencyReportsViaDate',
        data,
        {
          headers: headers,
        },
      )
      .then(response => {
        var returnArr = [];
        returnArr.push(response.data.data);

        setAllEmergencyReports(returnArr[0]);

        if (returnArr[0].length === 0) {
          setshowNoResultsFound(true);
          return;
        }

        setshowNoResultsFound(false);
      })

      .catch(error => {
        console.log('Error ' + error);
      });
  };

  let footer = <p>Please pick a day.</p>;
  if (selectedDate) {
    footer = <p>You picked {format(selectedDate, 'PP')}.</p>;
  }

  const searchDate = async date => {
    setAllEmergencyReports([]);
    setshowNoResultsFound(false);

    setselectedDate(date);
    const newFormatedDate = moment(date).format('yyyy-MM-DD');

    const token = localStorage.getItem('token');

    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };

    const data = {
      date: newFormatedDate,
    };

    await axios
      .post(
        'https://univtraze.herokuapp.com/api/covid_cases/searchEmergencyReportsViaDate',
        data,
        {
          headers: headers,
        },
      )
      .then(response => {
        var returnArr = [];
        returnArr.push(response.data.data);
        setAllEmergencyReports(returnArr[0]);

        if (returnArr[0].length === 0) {
          setshowNoResultsFound(true);
          return;
        }

        setshowNoResultsFound(false);
      })

      .catch(error => {
        console.log('Error ' + error);
      });
  };

  const [showDatePicker, setShowDatePicker] = useState(false);

  return (
    <div className="emergency-report">
      <div className="container">
        <div className="h2-container">
          <h3 className="h2-container__emergency">Emergency Report</h3>
          <div className="date-container">
            <input className="h2-container__calendar" type="date" />
          </div>
        </div>
        <div className="card-cons">
          {showNoResultsFound ? (
            <p>
              No results found for {moment(selectedDate).format('yyyy-MM-DD')}
            </p>
          ) : null}
          {allEmergencyReports.map(emergencyReport => {
            return (
              <div className="card-cons">
                <div className="baraha">
                  <p className="disease">
                    {JSON.parse(emergencyReport.medical_condition).map(
                      condition => {
                        var counter = 0;
                        counter = counter + 1;

                        if (
                          JSON.parse(emergencyReport.medical_condition)
                            .length === counter
                        ) {
                          return (
                            condition.charAt(0).toUpperCase() +
                            condition.slice(1) +
                            ''
                          );
                        }
                        return (
                          condition.charAt(0).toUpperCase() +
                          condition.slice(1) +
                          ' '
                        );
                      },
                    )}
                  </p>
                  <p className="name">{emergencyReport.patient_name}</p>
                  <p className="paragraph">{emergencyReport.description}</p>
                  <div className="box">
                    <p className="numero">{emergencyReport.room_number}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="spacer"></div>
    </div>
  );
}
