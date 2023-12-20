import  React,{useState,useEffect} from 'react'
import Header from '../components/Header'
import Button from '../components/Button'
import Card from '../components/Card'
import user from '../assets/card__icon.png'
import covid from'../assets/covid_icon.png'
import phone from '../assets/phone_icon.png'
import note from '../assets/notes_icon.png'
import { useNavigate} from "react-router-dom"
import axios from 'axios'

function Dashboard() {

  const [localCases, setLocalCases] = useState(0)
  const [deaths, setDeaths] = useState(0)
  const [recovered, setRecovered] = useState(0)
  const [whileCounting, setWhileCounting] = useState(true)
  const [allUsers, setAllUsers] = useState([])
  const [allCommunicableDisease, setAllCommunicableDisease] = useState([])
  const [allEmergencyReports, setAllEmergencyReports] = useState([])

  const [totalActiveNotifications, setTotalActiveNotifications] = useState(0)

  useEffect(() => {
    setInterval(() => {
      GetCovidData();
    }, 1000);
  }, [])


  const GetCovidData = async () => {
    await axios.get('https://disease.sh/v3/covid-19/countries/PH?strict=true').then(resp => {
      const data = resp.data;

      setLocalCases(data.cases)
      setDeaths(data.deaths)
      setRecovered(data.recovered)
  });
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
    
    await axios
      .get(
        'https://univtraze.herokuapp.com/api/communicable_disease/getAllCommunicableDiseaseReported',
        {
          headers: headers,
        }
      ).then(resp => {
        setAllCommunicableDisease(resp.data.data);
    });

    await axios
    .get(
      'https://univtraze.herokuapp.com/api/covid_cases/getAllEmergencyReported',
      {
        headers: headers,
      }
    ).then(resp => {
      setAllEmergencyReports(resp.data.data);
  });

  }

  const navigate = useNavigate()
  
    const users = () => {
      navigate('/admin/users')
    }

    const covidreport = () => {
      navigate('/admin/communicable-disease')
    }

    const fulldetails = () => {
      navigate('/admin/covidfulldetails')
    }

    const emergency = () => {
      navigate('/admin/emergencyreport')
    }

    const attendance = () => {
      navigate('/admin/attendance')
    }
    
    if(localStorage.getItem("token") === null || localStorage.getItem("token") === undefined || localStorage.getItem("token") === "") {
      return navigate("/");
    }
  return (
    <div className="dashboard">
        <Header/>
        <div className="animation-container">
          <Wave mask="url(#mask)" fill="#6bf27f" options={{ speed: 0.2, amplitude: 20 }}>

            <defs>
              <linearGradient id="gradient" gradientTransform="rotate(90)">
                <stop offset="0" stopColor="white" />
                <stop offset="0.5" stopColor="black" />
              </linearGradient>
              <mask id="mask">
                <rect x="0" y="0" width="2000" height="200" fill="url(#gradient)"  />
              </mask>
            </defs>
          </Wave>
        </div>
        
      <div className="container space-top">
            <h3 className='welcome-back'>Welcome Back, Admin</h3>
            <h1 className='update'>Here's an update for today</h1>
        </div>
        <div className="card-container">
            <Card redir={users} label="Users" data={allUsers.length} type="users" design="cards card-1"icon={user} />
            <Card  redir={covidreport}label="Communicable disease report" data={allCommunicableDisease.length} type="communicable-disease" design="secondary-cards card-2" icon={covid}/>
            <Card redir={emergency}label="Emergency reports" data={allEmergencyReports.length} type="emergency-reports" design="secondary-cards card-3" icon={phone}/>
            <Card redir={attendance}label="Attendance" data="See all" type="attendance" design="secondary-cards card-4" icon={note}/>
            <div className="analytics">
              <p className="covid-update">Covid Update Philippines</p>
              <div className="covid-details">
                <p className="local-cases">Local Cases</p>
                <p className="data">

                {
                  whileCounting === true ?
                  <CountUp
                    start={0}
                    end={localCases}
                    duration={2} 
                    onStart={() => {setWhileCounting(true)}}
                    onEnd={() => {setWhileCounting(false)}}        
                  />
                  :
                  localCases.toLocaleString()
                }
                </p>
                <p className="deaths local-cases">Deaths</p>
                <p className="data">
                {
                  whileCounting === true ?
                  <CountUp
                    start={0}
                    end={deaths}
                    duration={2} 
                    onStart={() => {setWhileCounting(true)}}
                    onEnd={() => {setWhileCounting(false)}}        
                  />
                  :
                  deaths.toLocaleString()

                }
                  
                  </p>
                <p className="deaths local-cases">Recovered</p>
                <p className="data">
                {
                  whileCounting === true ?
                  <CountUp
                    start={0}
                    end={recovered}
                    duration={2} 
                    onStart={() => {setWhileCounting(true)}}
                    onEnd={() => {setWhileCounting(false)}}        
                  />
                  :
                  recovered.toLocaleString()

                }
                  </p>
              </div>
              <Button  destination={'/admin/covidfulldetails'} label="See full details"/>
            </div>
            
        </div>
    </div>
  )
}

export default Dashboard