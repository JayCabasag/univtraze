import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Image,
  StatusBar,
  Platform,
  ActivityIndicator,
  Alert
} from 'react-native'
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { PieChart } from 'react-native-chart-kit'
import moment from 'moment'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Notifications from '../components/Notifications'
import { COLORS, FONT_FAMILY } from '../utils/app_constants'
import Menu from '../components/Menu'
import { useUser } from '../services/store/user/UserContext'
import { genericGetRequest } from '../services/api/genericGetRequest'
import { useAuth } from '../services/store/auth/AuthContext'
import DiseaseReportCard from '../components/DiseaseReportCard'

const IndexScreen = ({ navigation }) => {
  const { state: user, updateUserDetails } = useUser()
  const { state: auth } = useAuth()

  const fullname = `${user?.details?.firstname ?? ''} ${user?.details?.lastname ?? ''}`
  const userId = user?.user?.id
  const userToken = auth?.userToken

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!userId || !userToken) return
      try {
        const res = await genericGetRequest(`users/${userId}`, userToken)
        updateUserDetails({ details: res.results })
      } catch (error) {
        Alert.alert('Failed', error?.response?.data?.message ?? 'Unknown error', [
          { text: 'OK', onPress: () => console.log('OK') }
        ])
      }
    }
    fetchUserDetails()
  }, [userId, userToken])

  //covid api variables
  const [population, setPopulation] = useState(0)
  const [cases, setCases] = useState(0)
  const [activeCases, setActiveCases] = useState(0)
  const [recovered, setRecovered] = useState(0)
  const [deaths, setDeaths] = useState(0)
  const [isLoadingPhCovidCases, setIsLoadingPhCovidCases] = useState(true)
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

  }

  const getTotalActiveNotifications = async (currentToken) => {
   
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
      style={styles.container}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
    >
      <Menu
        visible={visible}
        toggleBottomNavigationView={toggleBottomNavigationView}
        navigation={navigation}
      />
      <Notifications
        notifVisible={notifVisible}
        toggleNotifNavigationView={toggleNotifNavigationView}
        props={{ userId, token, notificationLists }}
        navigation={navigation}
      />
      <View style={styles.topContainer}>
        <TouchableOpacity onPress={toggleBottomNavigationView}>
          <Image
            source={require('../assets/notifmenu_icon.png')}
            resizeMode='contain'
            style={styles.menuIcon}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={toggleNotifNavigationView}>
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
        </TouchableOpacity>
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
                navigation.navigate('qr-scanner')
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
                navigation.navigate('report-disease')
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
                navigation.navigate('report-emergency')
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
          <DiseaseReportCard label={"Confirmed"} total={2}/>
          <DiseaseReportCard label={"Recovered"} total={2}/>
        </View>

        <View style={styles.phUpdateContainer}>
          <Text numberOfLines={1} style={styles.sectionHeaderText}>
            Main Diseases
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
                width={Dimensions.get('window').width - 100}
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
    backgroundColor: '#E1F5E4',
    flex: 1
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
    fontSize: 14,
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
    paddingHorizontal: 20,
    gap: 15
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
