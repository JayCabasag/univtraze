import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  TouchableWithoutFeedback,
  Image,
  StatusBar,
  Platform,
  ActivityIndicator
} from 'react-native'
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { PieChart } from 'react-native-chart-kit'
import moment from 'moment'
import jwtDecode from 'jwt-decode'
import Ionicons from 'react-native-vector-icons/Ionicons'

import Notifications from '../components/Notifications'
import { COLORS, FONT_FAMILY } from '../utils/app_constants'
import Menu from '../components/Menu'

const IndexScreen = ({ navigation, route }) => {
  //covid api variables
  const [population, setPopulation] = useState(0)
  const [cases, setCases] = useState(0)
  const [activeCases, setActiveCases] = useState(0)
  const [recovered, setRecovered] = useState(0)
  const [deaths, setDeaths] = useState(0)
  const [isLoadingPhCovidCases, setIsLoadingPhCovidCases] = useState(true)

  //userdata variables
  const [fullname, setFullname] = useState('')
  const [type, setType] = useState('')
  const [userId, setUserId] = useState(null)
  const [profileUrl, setProfileUrl] = useState('')

  //
  const [notificationLists, setNotificationLists] = useState([])

  const [reportedCommunicableDiseaseOnGoing, setReportedCommunicableDiseaseOnGoing] = useState([])
  const [reportedCommunicableDiseaseResolved, setReportedCommunicableDiseaseResolved] = useState([])

  //Special variables
  const [token, setToken] = useState('')
  const [notificationCounts, setNotificationCounts] = useState(0)
  const [visible, setVisible] = useState(false)
  const [notifVisible, setNotifVisible] = useState(false)

  const toggleBottomNavigationView = () => {
    //Toggling the visibility state of the bottom sheet
    setVisible(!visible)
  }

  const toggleNotifNavigationView = () => {
    //Toggling the visibility state of the bottom sheet
    getTotalActiveNotifications(token)
    setNotifVisible(!notifVisible)
    handleUpdateNotificationStatus(userId, 1, token)
    handleGetNotifications(userId, 0, token)
  }

  const handleUpdateNotificationStatus = async (userId, notification_is_viewed, currentToken) => {
    const config = {
      headers: { Authorization: `Bearer ${currentToken}` }
    }

    const data = {
      notification_is_viewed: 1,
      notification_for: userId
    }

    await axios
      .post(
        `https://univtraze.herokuapp.com/api/notifications/updateUserNotificationStatus `,
        data,
        config
      )
      .then((response) => {
        const success = response.data.success

        if (success === 0) {
          return
        }

        if (success === 1) {
          return
        }

        alert('Something went wrong... Please try again')
      })
  }

  const decodeJwt = (currentToken) => {
    var decodedToken = jwtDecode(currentToken)
    getUserDetails(
      decodedToken.result.id,
      currentToken,
      decodedToken.result.type || route.params.type
    )
    handleGetNotifications(decodedToken.result.id, 0, currentToken)
  }

  const getTotalActiveNotifications = async (currentToken) => {
    const config = {
      headers: { Authorization: `Bearer ${currentToken}` }
    }

    const data = {
      user_id: userId
    }

    await axios
      .post(
        `https://univtraze.herokuapp.com/api/notifications/getTotalActiveUserNotifications`,
        data,
        config
      )
      .then((response) => {
        const success = response.data.success

        if (success === 0) {
          return alert('An error occured while getting on-going cases')
        }

        if (success === 1) {
          return setNotificationCounts(response.data.results.total_notifications)
        }

        alert('Something went wrong... Please try again')
      })
  }

  const getOnGoingCommunicableDiseaseCase = async (currentToken) => {
    const config = {
      headers: { Authorization: `Bearer ${currentToken}` }
    }

    const data = {
      case_status: 'On-going'
    }

    await axios
      .post(
        `https://univtraze.herokuapp.com/api/communicable_disease/getCommunicableDiseaseByStatus`,
        data,
        config
      )
      .then((response) => {
        const success = response.data.success

        if (success === 0) {
          return alert('An error occured while getting on-going cases')
        }

        if (success === 1) {
          return setReportedCommunicableDiseaseOnGoing(response.data.data)
        }

        alert('Something went wrong... Please try again')
      })
  }

  const getResolvedCommunicableDiseaseCase = async (currentToken) => {
    const config = {
      headers: { Authorization: `Bearer ${currentToken}` }
    }

    const data = {
      case_status: 'Resolved'
    }

    await axios
      .post(
        `https://univtraze.herokuapp.com/api/communicable_disease/getCommunicableDiseaseByStatus`,
        data,
        config
      )
      .then((response) => {
        const success = response.data.success

        if (success === 0) {
          return alert('An error occured while getting resolved cases')
        }

        if (success === 1) {
          return setReportedCommunicableDiseaseResolved(response.data.data)
        }

        alert('Something went wrong... Please try again')
      })
  }

  const getUserDetails = async (userId, currentToken, userType) => {
    const config = {
      headers: { Authorization: `Bearer ${currentToken}` }
    }

    const data = {
      id: userId
    }
    await axios
      .post(`https://univtraze.herokuapp.com/api/user/${userType}`, data, config)
      .then((response) => {
        const success = response.data.success

        if (success === 0 && message === 'No data found for this user') {
          return navigation.navigate('signup-user-type')
        }

        if (success === 0 && message === 'Invalid token') {
          alert('Please re-login to continue')
          return navigation.navigate('signin')
        }

        setFullname(response.data.data.firstname + ' ' + response.data.data.lastname)
        setUserId(userId)
        setType(userType)
        setProfileUrl(response.data.data.profile_url)
      })
  }

  useEffect(() => {
    const GetCovidUpdate = async () => {
      setIsLoadingPhCovidCases(true)
      try {
        await axios
          .get('https://disease.sh/v3/covid-19/countries/PH?strict=true')
          .then((response) => {
            setPopulation(response.data.population)
            setActiveCases(response.data.active)
            setCases(response.data.cases)
            setRecovered(response.data.recovered)
            setDeaths(response.data.deaths)
          })
      } catch (error) {
      } finally {
        setIsLoadingPhCovidCases(false)
      }
    }
    GetCovidUpdate()
  }, [])

  const handleGetNotifications = async (user_id, offset, token) => {
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    }

    const data = {
      user_id: user_id,
      start_at: offset
    }
    await axios
      .post(
        `https://univtraze.herokuapp.com/api/notifications/getUserNotificationsById`,
        data,
        config
      )
      .then((response) => {
        if (response.data.success === 0) {
          return console.log(response.data)
        }

        let returnArray = response.data.results
        return setNotificationLists(returnArray)
      })
  }

  // Return
  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.topContainer}>
        <TouchableWithoutFeedback onPress={toggleBottomNavigationView}>
          <Image
            source={require('../assets/notifmenu_icon.png')}
            resizeMode='contain'
            style={styles.menuIcon}
          />
        </TouchableWithoutFeedback>

        <TouchableWithoutFeedback onPress={toggleNotifNavigationView}>
          <View>
            {notificationCounts != 0 && (
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationBadgeText} onPress={toggleNotifNavigationView}>
                  {notificationCounts}
                </Text>
              </View>
            )}
            <Ionicons name='notifications' size={40} color='#284CCD' />
          </View>
        </TouchableWithoutFeedback>

        <Menu
          visible={visible}
          toggleBottomNavigationView={toggleBottomNavigationView}
          props={{ userId, fullname, type, profileUrl }}
          navigation={navigation}
        />

        <Notifications
          notifVisible={notifVisible}
          toggleNotifNavigationView={toggleNotifNavigationView}
          props={{ userId, token, notificationLists }}
          navigation={navigation}
        />
      </View>
      <View style={styles.bodyContainer}>
        <View style={styles.topTextContainer}>
          <Text style={styles.wlcmTextName} numberOfLines={1}>
            Welcome back, {fullname}
          </Text>
          <Text style={styles.wlcmTextAsking}>What do you want {'\n'}to do?</Text>
        </View>

        <View style={styles.scrllBtnsContainer}>
          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            style={styles.scrllViewContainer}
            contentOffset={{ x: 0, y: 0 }}
          >
            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() => {
                navigation.navigate('QrScanner', { type: type, id: userId, token: token })
              }}
            >
              <ImageBackground
                source={require('../assets/scan-btn.png')}
                resizeMode='contain'
                style={styles.btnimage}
              ></ImageBackground>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() => {
                navigation.navigate('ReportCovidCase', { id: userId, type: type })
              }}
            >
              <ImageBackground
                source={require('../assets/report-disease-btn.png')}
                resizeMode='contain'
                style={styles.btnimage}
              ></ImageBackground>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() => {
                navigation.navigate('ReportEmergency', { id: userId, type: type })
              }}
            >
              <ImageBackground
                source={require('../assets/report-emergency-btn.png')}
                resizeMode='contain'
                style={styles.btnimage}
              ></ImageBackground>
            </TouchableOpacity>
          </ScrollView>
        </View>

        <View style={styles.sectionContainer}>
          <Text numberOfLines={1} style={styles.sectionHeaderText}>
            Disease Reports
          </Text>
          <Text style={styles.sectionSubText}>University</Text>
        </View>
        <View style={styles.casesContainer}>
          <ImageBackground
            source={require('../assets/confirmed_case_icon.png')}
            resizeMode='stretch'
            style={styles.confirmCasesCard}
          >
            <Text style={{ fontSize: 10 }}>Confirmed</Text>
            <Text style={{ fontSize: 22, fontWeight: 'bold', color: COLORS.PRIMARY }}>
              {reportedCommunicableDiseaseOnGoing && reportedCommunicableDiseaseOnGoing
                ? reportedCommunicableDiseaseOnGoing.length
                : 0}
            </Text>
          </ImageBackground>

          <ImageBackground
            source={require('../assets/confirmed_case_icon.png')}
            resizeMode='stretch'
            style={styles.confirmCasesCard}
          >
            <Text style={{ fontSize: 10 }}>Recovered</Text>
            <Text style={{ fontSize: 22, fontWeight: 'bold', color: COLORS.PRIMARY }}>
              {reportedCommunicableDiseaseResolved && reportedCommunicableDiseaseResolved
                ? reportedCommunicableDiseaseResolved.length
                : 0}
            </Text>
          </ImageBackground>
        </View>

        <View style={styles.phUpdateContainer}>
          <Text numberOfLines={1} style={styles.sectionHeaderText}>
            Philippines Update
          </Text>
          {isLoadingPhCovidCases ? (
            <ActivityIndicator
              size='large'
              color={COLORS.PRIMARY}
              style={styles.loadingPhCovidCaseIndicator}
            />
          ) : (
            <View style={styles.localCasesContainer}>
              <View style={{ flexDirection: 'row', width: '100%' }}>
                <Text style={styles.covidCasesText}>Covid-19 Cases</Text>
                <Text
                  style={{
                    marginRight: 25,
                    marginLeft: 'auto',
                    paddingVertical: 10,
                    fontSize: 14
                  }}
                >
                  As of {moment().format('MMM Do')}
                </Text>
              </View>
              <PieChart
                data={[
                  {
                    name: 'Population',
                    population: population,
                    color: COLORS.PRIMARY,
                    legendFontColor: '#7F7F7F',
                    legendFontSize: 10
                  },
                  {
                    name: 'Cases',
                    population: cases,
                    color: '#F00',
                    legendFontColor: '#7F7F7F',
                    legendFontSize: 10
                  },
                  {
                    name: 'Active cases',
                    population: activeCases,
                    color: 'rgb(255, 165, 0)',
                    legendFontColor: '#7F7F7F',
                    legendFontSize: 10
                  },
                  {
                    name: 'Recovered',
                    population: recovered,
                    color: '#FFFF00',
                    legendFontColor: '#7F7F7F',
                    legendFontSize: 10
                  },

                  {
                    name: 'Deaths',
                    population: deaths,
                    color: 'rgb(0, 0, 255)',
                    legendFontColor: '#7F7F7F',
                    legendFontSize: 10
                  }
                ]}
                width={Dimensions.get('screen').width - 100}
                height={150}
                chartConfig={{
                  backgroundColor: '#1cc910',
                  backgroundGradientFrom: '#eff3ff',
                  backgroundGradientTo: '#efefef',
                  decimalPlaces: 2,
                  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                  style: {
                    borderRadius: 16
                  }
                }}
                style={{
                  marginVertical: 8,
                  borderRadius: 16
                }}
                accessor='population'
                backgroundColor='transparent'
                paddingLeft='2'
                absolute //for the absolute number remove if you want percentage
              />
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  )
}
export default IndexScreen

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#E1F5E4'
  },
  topContainer: {
    paddingHorizontal: 25,
    width: '100%',
    height: 100,
    justifyContent: 'space-between',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Platform.OS == 'ios' ? StatusBar.currentHeight + 40 : 40
  },
  menuIcon: {
    height: 60,
    width: 60,
    marginLeft: -5
  },
  notifLogo: {
    height: '40%',
    width: '20%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  notificationBadge: {
    zIndex: 2,
    width: 20,
    height: 20,
    borderRadius: 100,
    position: 'absolute',
    backgroundColor: 'red',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    fontFamily: FONT_FAMILY.POPPINS_LIGHT
  },
  notificationBadgeText: {
    textAlign: 'center',
    color: 'white',
    elevation: 5
  },
  bottomNavigationView: {
    backgroundColor: '#fff',
    width: '100%',
    height: '60%',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30
  },
  centeredViews: {
    flex: 1,
    backgroundColor: 'rgba(52, 52, 52, 0.3)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    width: 350,
    height: 474,
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  buttons: {
    width: '100%',
    height: 60,
    borderRadius: 20,
    elevation: 2,
    marginTop: 25,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.PRIMARY
  },
  bodyContainer: {
    width: '100%',
    marginBottom: 50
  },
  topTextContainer: {
    width: '100%',
    height: 'auto',
    paddingHorizontal: 25,
    justifyContent: 'center'
  },
  wlcmTextName: {
    fontSize: 16,
    fontFamily: FONT_FAMILY.POPPINS_REGULAR
  },
  wlcmTextAsking: {
    fontSize: 22,
    fontFamily: FONT_FAMILY.POPPINS_SEMI_BOLD
  },
  scrllBtnsContainer: {
    width: '100%',
    height: 250,
    display: 'flex',
    flexDirection: 'row'
  },
  scrllViewContainer: {
    paddingHorizontal: 5
  },
  actionBtn: {
    width: 180,
    height: '100%'
  },
  btnimage: {
    width: '100%',
    height: '100%'
  },
  sectionContainer: {
    paddingHorizontal: 25
  },
  phUpdateContainer: {
    paddingHorizontal: 25
  },
  loadingPhCovidCaseIndicator: {
    paddingHorizontal: 20,
    marginTop: 35
  },
  sectionHeaderText: {
    fontSize: 22,
    fontWeight: 'bold',
    fontFamily: FONT_FAMILY.POPPINS_SEMI_BOLD
  },
  sectionSubText: {
    fontSize: 16,
    fontFamily: FONT_FAMILY.POPPINS_MEDIUM
  },
  casesContainer: {
    width: '100%',
    height: 'auto',
    marginTop: 10,
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: 'transparent',
    marginBottom: 20,
    paddingHorizontal: 15
  },
  confirmCasesCard: {
    flex: 1,
    height: 86,
    display: 'flex',
    gap: 10,
    borderRadius: 20,
    shadowColor: 'black',
    paddingLeft: 20,
    paddingTop: 10
  },
  covidCasesText: {
    marginLeft: 25,
    marginRight: 'auto',
    paddingVertical: 10,
    fontWeight: 'bold',
    fontSize: 18,
    fontFamily: FONT_FAMILY.POPPINS_SEMI_BOLD
  },
  localCasesContainer: {
    width: '100%',
    height: 'auto',
    alignItems: 'center',
    backgroundColor: COLORS.WHITE,
    marginTop: 15,
    borderRadius: 15,
    elevation: 5
  },
  bottomNavigationView: {
    backgroundColor: '#fff',
    width: '100%',
    height: '60%',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30
  },
  centeredViews: {
    flex: 1,
    backgroundColor: 'rgba(52, 52, 52, 0.3)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    width: 350,
    height: 474,
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  buttons: {
    width: '100%',
    height: 60,
    borderRadius: 20,
    elevation: 2,
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    marginTop: 25,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.PRIMARY
  }
})
