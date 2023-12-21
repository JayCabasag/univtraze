import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import axios from 'axios';
import moment from 'moment';

function CardOverview({ userData: { userId, caseId, userType } }) {
  const [victimName, setVictimName] = useState('Jay Cabasag');
  const [dateCaseConfirmed, setDateCaseConfirmed] = useState('10-16-199');
  const [communicableDiseaseData, setCommunicableDiseaseData] = useState([]);
  const [userData, setUserData] = useState([]);
  const [numberOfDays, setNumberOfDays] = useState(1);
  const [firstDegreeData, setFirstDegreeData] = useState([]);
  const [secondDegreeData, setSecondDegreeData] = useState([]);
  const [thirdDegreeData, setThirdDegreeData] = useState([]);

  //   Errors handlers
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [victimIdentifierTitle, setVictimIdentifierTitle] = useState(
    '1st Degree Users Overview',
  );

  const [reportGenerationLoading, setReportGenerationLoading] = useState(false);

  useEffect(() => {
    handleGetCaseData(caseId);
    handleGetVictimData(userId, userType);
  }, []);

  const handleGetVictimData = async (currentUserId, currentUserType) => {
    const token = localStorage.getItem('token');

    var data = {
      id: currentUserId,
    };

    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };

    axios
      .post(
        `https://univtraze.herokuapp.com/api/user/${currentUserType}`,
        data,
        {
          headers: headers,
        },
      )
      .then(resp => {
        if (resp.data.success === 0) {
          return alert('User cant be found!..');
        }

        if (resp.data.success === 1) {
          setUserData(resp.data.data);
          return;
        }

        alert('An error occured, Please try again later.');
      });
  };

  const handleGetCaseData = async currentCaseId => {
    const token = localStorage.getItem('token');

    var data = {
      id: currentCaseId,
    };

    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };

    axios
      .post(
        'https://univtraze.herokuapp.com/api/communicable_disease/getCommunicableDiseaseById',
        data,
        {
          headers: headers,
        },
      )
      .then(resp => {
        if (!resp.data.data) {
          return alert('Case cant be found!..');
        }

        if (resp.data.success === 1) {
          setCommunicableDiseaseData(resp.data.data);
          setDateCaseConfirmed(resp.data.data[0].createdAt);
          return;
        }

        alert('An error occured, Please try again later.');
      });
  };

  const handleGetFirstDegree = async (
    user_id,
    type,
    case_id,
    us_date_reported,
    date_range,
  ) => {
    setReportGenerationLoading(true);

    const date_reported = new Date(us_date_reported)
      .toISOString()
      .replace(/T/, ' ')
      .replace(/\..+/, '');
    const token = localStorage.getItem('token');

    var data = {
      user_id: user_id * 1,
      type: type,
      case_id: case_id * 1,
      date_reported: date_reported,
      date_range: date_range,
    };

    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };

    await axios
      .post(
        'https://univtraze.herokuapp.com/api/victims/getFirstDegreeVictims',
        data,
        {
          headers: headers,
        },
      )
      .then(resp => {
        if (resp.data.success === 0) {
          setReportGenerationLoading(false);
          setError(true);
          return setErrorMessage('No victims found for this user.');
        }

        if (resp.data.success === 1) {
          setError(false);
          setErrorMessage('');
          handleGetSecondDegreeVictims(resp.data.data);
          return handleMapAllFirstDegree(resp.data);
        }

        setError(false);
        setErrorMessage('');
        setReportGenerationLoading(false);
        alert('An error occured please try again later.');
      });
  };

  const handleGetSecondDegreeVictims = async second_degree_data => {
    setReportGenerationLoading(true);

    const token = localStorage.getItem('token');

    const data = {
      initialVictim: second_degree_data.initialVictim,
      initialVictimType: second_degree_data.type,
      case_id: second_degree_data.case_id,
      start_date: second_degree_data.start_date,
      end_date: second_degree_data.end_date,
      first_degree_victims: second_degree_data.firstDegreeVictimsId,
    };

    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };

    await axios
      .post(
        'https://univtraze.herokuapp.com/api/victims/getSecondDegreeVictims',
        data,
        {
          headers: headers,
        },
      )
      .then(resp => {
        if (resp.data.success === 0) {
          setReportGenerationLoading(false);
          setError(true);
          console.log(resp.data);
          return setErrorMessage(resp.data);
        }

        if (resp.data.success === 1) {
          setReportGenerationLoading(false);
          handleGetThirdDegreeVictims(resp.data.data);
          return handleMapAllSecondDegree(resp.data);
        }
        setReportGenerationLoading(false);
        alert('An error occured please try again later.');
      });
  };

  const handleGetThirdDegreeVictims = async third_degree_data => {
    setReportGenerationLoading(true);
    const token = localStorage.getItem('token');

    const data = {
      initialVictim: third_degree_data.initialVictim,
      initialVictimType: third_degree_data.initialVictimType,
      case_id: third_degree_data.case_id,
      start_date: third_degree_data.start_date,
      end_date: third_degree_data.end_date,
      firstDegreeVictimsId: third_degree_data.firstDegreeVictimsId,
      secondDegreeVictimsId: third_degree_data.secondDegreeVictimsId,
    };

    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };
    await axios
      .post(
        'https://univtraze.herokuapp.com/api/victims/getThirdDegreeVictims',
        data,
        {
          headers: headers,
        },
      )
      .then(resp => {
        if (resp.data.success === 0) {
          setReportGenerationLoading(false);
          setError(true);
          return setErrorMessage(resp.data.message);
        }

        if (resp.data.success === 1) {
          setReportGenerationLoading(false);
          handleMapAllThirdDegree(resp.data);
          return setThirdDegreeData(resp.data);
        }
        setReportGenerationLoading(false);
        alert('An error occured please try again later.');
      });
  };

  const handleMapAllFirstDegree = async data => {
    const id_lists = data.data.firstDegreeVictimsId;

    const token = localStorage.getItem('token');

    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };

    await axios
      .post(
        'https://univtraze.herokuapp.com/api/user/getUserDetailsByIds',
        { id_lists },
        {
          headers: headers,
        },
      )
      .then(resp => {
        if (resp.data.success === 0) {
          setReportGenerationLoading(false);
          return alert('An error occured');
        }

        if (resp.data.success === 1) {
          setReportGenerationLoading(false);
          return setFirstDegreeData(resp.data.results);
        }
        setReportGenerationLoading(false);
        alert('An error occured please try again later.');
      });
  };

  const handleMapAllSecondDegree = async data => {
    const id_lists = data.data.secondDegreeVictimsId;

    const token = localStorage.getItem('token');

    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };

    await axios
      .post(
        'https://univtraze.herokuapp.com/api/user/getUserDetailsByIds',
        { id_lists },
        {
          headers: headers,
        },
      )
      .then(resp => {
        if (resp.data.success === 0) {
          setReportGenerationLoading(false);
          return alert('An error occured');
        }

        if (resp.data.success === 1) {
          setReportGenerationLoading(false);
          return setSecondDegreeData(resp.data.results);
        }
        setReportGenerationLoading(false);
        alert('An error occured please try again later.');
      });
  };

  const handleMapAllThirdDegree = async data => {
    const id_lists = data.data.thirdDegreeVictimsId;

    const token = localStorage.getItem('token');

    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };

    await axios
      .post(
        'https://univtraze.herokuapp.com/api/user/getUserDetailsByIds',
        { id_lists },
        {
          headers: headers,
        },
      )
      .then(resp => {
        if (resp.data.success === 0) {
          setReportGenerationLoading(false);
          return alert('An error occured');
        }

        if (resp.data.success === 1) {
          setReportGenerationLoading(false);
          return setThirdDegreeData(resp.data.results);
        }
        setReportGenerationLoading(false);
        alert('An error occured please try again later.');
      });
  };

  const handleShiftData = async selected_victim => {
    if (selected_victim === '1st degree victims') {
      return setVictimIdentifierTitle('1st Degree Users Overview');
    }
    if (selected_victim === '2nd degree victims') {
      return setVictimIdentifierTitle('2nd Degree Users Overview');
    }
    if (selected_victim === '3rd degree victims') {
      return setVictimIdentifierTitle('3rd Degree Users Overview');
    }

    return setVictimIdentifierTitle('1st - 3rd Degree Users Overview');
  };
  return (
    <div className="card-container--covid-overview">
      <div className="card-container--covid-overview__card-description">
        <h1 className="card-container--covid-overview__id-overview">
          Case number: {caseId}
        </h1>
        <h2 className="card-container--covid-overview__name-title">
          {userData.firstname === undefined || userData.lastname === undefined
            ? null
            : userData.firstname + ' ' + userData.lastname}
        </h2>
        <p className="card-container--covid-overview__date-overview">
          Confirmed on <span> </span>
          {moment(dateCaseConfirmed).toLocaleString()}
        </p>
        <select
          name="1st degree"
          id="1st degree"
          className="card-container--covid-overview__selection-overview"
          onChange={e => handleShiftData(e.target.value)}
        >
          <option>1st degree victims</option>
          <option>2nd degree victims</option>
          <option>3rd degree victims</option>
          <option>All</option>
        </select>

        <div
          style={{
            display: 'flex',
            marginTop: 5,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <p style={{ marginRight: 10 }}>No. of days :</p>
          <input
            defaultValue={numberOfDays}
            style={{
              lineHeight: 2,
              padding: 5,
              outline: 'none',
              fontSize: 12,
              borderRadius: 5,
            }}
            onChange={e => setNumberOfDays(e.target.value * 1)}
          />
        </div>

        {error ? <p style={{ color: 'red' }}>{errorMessage}</p> : null}
        <button
          className="btn-primary"
          onClick={() =>
            handleGetFirstDegree(
              userId,
              userType,
              caseId,
              dateCaseConfirmed,
              numberOfDays,
            )
          }
        >
          GENERATE REPORT
        </button>
      </div>
      <div className="card-container--covid-overview__card-tab">
        <p className="card-container--covid-overview__1st-degree">
          {victimIdentifierTitle}
        </p>
        <div className="card-container--covid-overview__table-container">
          <p style={{ color: 'red' }}>
            {reportGenerationLoading
              ? 'Please wait while generating the report...'
              : null}
          </p>
          {victimIdentifierTitle === '1st Degree Users Overview' ? (
            <table className="table-overview">
              <tr>
                <th>User Id</th>
                <th>Type</th>
                <th>Fullname</th>
                <th>Phone</th>
                <th>Email</th>
              </tr>
              {firstDegreeData && firstDegreeData ? (
                firstDegreeData.map(data => {
                  if (data.information === 'User not found') {
                    return;
                  }

                  if (data.information.data === 'Not verified') {
                    return (
                      <tr key={data.information.id}>
                        <td>{data.information.id}</td>
                        <td>{data.information.type}</td>
                        <td>Not verified</td>
                        <td>Not verified</td>
                        <td>{data.information.email}</td>
                      </tr>
                    );
                  }

                  return (
                    <tr key={data.information.id}>
                      <td>{data.information.id}</td>
                      <td>{data.information.type}</td>
                      <td>
                        {data.information.data.firstname +
                          ' ' +
                          data.information.data.lastname}
                      </td>
                      <td>{data.information.data.mobile_number}</td>
                      <td>{data.information.data.email}</td>
                    </tr>
                  );
                })
              ) : (
                <p>No results...</p>
              )}
            </table>
          ) : null}
          {victimIdentifierTitle === '2nd Degree Users Overview' ? (
            <table className="table-overview">
              <tr>
                <th>User Id</th>
                <th>Type</th>
                <th>Fullname</th>
                <th>Phone</th>
                <th>Email</th>
              </tr>
              {secondDegreeData && secondDegreeData ? (
                secondDegreeData.map(data => {
                  if (data.information === 'User not found') {
                    return;
                  }

                  if (data.information.data === 'Not verified') {
                    return (
                      <tr key={data.information.id}>
                        <td>{data.information.id}</td>
                        <td>{data.information.type}</td>
                        <td>Not verified</td>
                        <td>Not verified</td>
                        <td>{data.information.email}</td>
                      </tr>
                    );
                  }

                  return (
                    <tr key={data.information.id}>
                      <td>{data.information.id}</td>
                      <td>{data.information.type}</td>
                      <td>
                        {data.information.data.firstname +
                          ' ' +
                          data.information.data.lastname}
                      </td>
                      <td>{data.information.data.mobile_number}</td>
                      <td>{data.information.data.email}</td>
                    </tr>
                  );
                })
              ) : (
                <p>No results...</p>
              )}
            </table>
          ) : null}
          {victimIdentifierTitle === '3rd Degree Users Overview' ? (
            <table className="table-overview">
              <tr>
                <th>User Id</th>
                <th>Type</th>
                <th>Fullname</th>
                <th>Phone</th>
                <th>Email</th>
              </tr>
              {thirdDegreeData && thirdDegreeData ? (
                thirdDegreeData.map(data => {
                  if (data.information === 'User not found') {
                    return;
                  }

                  if (data.information.data === 'Not verified') {
                    return (
                      <tr key={data.information.id}>
                        <td>{data.information.id}</td>
                        <td>{data.information.type}</td>
                        <td>Not verified</td>
                        <td>Not verified</td>
                        <td>{data.information.email}</td>
                      </tr>
                    );
                  }

                  return (
                    <tr key={data.information.id}>
                      <td>{data.information.id}</td>
                      <td>{data.information.type}</td>
                      <td>
                        {data.information.data.firstname +
                          ' ' +
                          data.information.data.lastname}
                      </td>
                      <td>{data.information.data.mobile_number}</td>
                      <td>{data.information.data.email}</td>
                    </tr>
                  );
                })
              ) : (
                <p>No results...</p>
              )}
            </table>
          ) : null}
          {victimIdentifierTitle === '1st - 3rd Degree Users Overview' ? (
            <>
              <p style={{ fontWeight: 'bold' }}>First degree victims</p>
              <table className="table-overview">
                <tr>
                  <th>User Id</th>
                  <th>Type</th>
                  <th>Fullname</th>
                  <th>Phone</th>
                  <th>Email</th>
                </tr>
                {firstDegreeData && firstDegreeData ? (
                  firstDegreeData.map(data => {
                    if (data.information === 'User not found') {
                      return;
                    }

                    if (data.information.data === 'Not verified') {
                      return (
                        <tr key={data.information.id}>
                          <td>{data.information.id}</td>
                          <td>{data.information.type}</td>
                          <td>Not verified</td>
                          <td>Not verified</td>
                          <td>{data.information.email}</td>
                        </tr>
                      );
                    }

                    return (
                      <tr key={data.information.id}>
                        <td>{data.information.id}</td>
                        <td>{data.information.type}</td>
                        <td>
                          {data.information.data.firstname +
                            ' ' +
                            data.information.data.lastname}
                        </td>
                        <td>{data.information.data.mobile_number}</td>
                        <td>{data.information.data.email}</td>
                      </tr>
                    );
                  })
                ) : (
                  <p>No results...</p>
                )}
              </table>

              <p style={{ fontWeight: 'bold' }}>Second degree victims</p>
              <table className="table-overview">
                <tr>
                  <th>User Id</th>
                  <th>Type</th>
                  <th>Fullname</th>
                  <th>Phone</th>
                  <th>Email</th>
                </tr>
                {secondDegreeData && secondDegreeData ? (
                  secondDegreeData.map(data => {
                    if (data.information === 'User not found') {
                      return;
                    }

                    if (data.information.data === 'Not verified') {
                      return (
                        <tr key={data.information.id}>
                          <td>{data.information.id}</td>
                          <td>{data.information.type}</td>
                          <td>Not verified</td>
                          <td>Not verified</td>
                          <td>{data.information.email}</td>
                        </tr>
                      );
                    }

                    return (
                      <tr key={data.information.id}>
                        <td>{data.information.id}</td>
                        <td>{data.information.type}</td>
                        <td>
                          {data.information.data.firstname +
                            ' ' +
                            data.information.data.lastname}
                        </td>
                        <td>{data.information.data.mobile_number}</td>
                        <td>{data.information.data.email}</td>
                      </tr>
                    );
                  })
                ) : (
                  <p>No results...</p>
                )}
              </table>

              <p style={{ fontWeight: 'bold' }}>Third degree victims</p>
              <table className="table-overview">
                <tr>
                  <th>User Id</th>
                  <th>Type</th>
                  <th>Fullname</th>
                  <th>Phone</th>
                  <th>Email</th>
                </tr>
                {thirdDegreeData && thirdDegreeData ? (
                  thirdDegreeData.map(data => {
                    if (data.information === 'User not found') {
                      return;
                    }

                    if (data.information.data === 'Not verified') {
                      return (
                        <tr key={data.information.id}>
                          <td>{data.information.id}</td>
                          <td>{data.information.type}</td>
                          <td>Not verified</td>
                          <td>Not verified</td>
                          <td>{data.information.email}</td>
                        </tr>
                      );
                    }

                    return (
                      <tr key={data.information.id}>
                        <td>{data.information.id}</td>
                        <td>{data.information.type}</td>
                        <td>
                          {data.information.data.firstname +
                            ' ' +
                            data.information.data.lastname}
                        </td>
                        <td>{data.information.data.mobile_number}</td>
                        <td>{data.information.data.email}</td>
                      </tr>
                    );
                  })
                ) : (
                  <p>No results...</p>
                )}
              </table>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default CardOverview;
