import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
  Image,
  StatusBar,
  Platform,
  Alert,
  RefreshControl
} from 'react-native'
import React, { useState, useEffect } from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Notifications from '../components/Notifications'
import { COLORS, FONT_FAMILY } from '../utils/app_constants'
import Menu from '../components/Menu'
import { useUser } from '../services/store/user/UserContext'
import { genericGetRequest } from '../services/api/genericGetRequest'
import { useAuth } from '../services/store/auth/AuthContext'
import DiseaseReportCard from '../components/DiseaseReportCard'
import MainDiseaseCard from '../components/MainDiseaseCard'
import { useNotifications } from '../services/store/notifications/NotificationsContext'
import { useFocusEffect } from '@react-navigation/native'

const IndexScreen = ({ navigation }) => {
  const { state: user, updateUserDetails } = useUser()
  const { state: auth } = useAuth()
  const { notifications, updateNotifications } = useNotifications()

  const fullname = `${user?.details?.firstname ?? ''} ${user?.details?.lastname ?? ''}`
  const userId = user?.user?.id
  const userToken = auth?.userToken
  const notificationCounts = notifications.summary?.not_viewed_total ?? 0
  const [visible, setVisible] = useState(false)
  const [notifVisible, setNotifVisible] = useState(false)
  const [activeCasesTotal, setActiveCasesTotal] = useState(0)
  const [resolvedCasesTotal, setResolvedCasesTotal] = useState(0)
  const [totalCases, setTotalCases] = useState(0)
  const [leadingDiseasesList, setLeadingDiseasesList] = useState([])

  console.log(userId)

  useFocusEffect(
    React.useCallback(() => {
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
  )


  const toggleBottomNavigationView = () => {
    //Toggling the visibility state of the bottom sheet
    setVisible(!visible)
  }

  const toggleNotifNavigationView = () => {
    //Toggling the visibility state of the bottom sheet
    setNotifVisible(!notifVisible)
  }

  const [refreshing, setRefreshing] = React.useState(false)
  const onRefresh = React.useCallback(() => {
    setRefreshing(true)
    const loadDiseaseReportsOverview = async () => {
      try {
        const res = await genericGetRequest('disease-cases/overview', userToken)
        const { active_cases_total, resolved_cases_total } = res.results.overview
        setLeadingDiseasesList(res.results.diseases)
        setResolvedCasesTotal(resolved_cases_total)
        setActiveCasesTotal(active_cases_total)
        setTotalCases(active_cases_total + resolved_cases_total)
      } catch (error) {
        console.log(error)
      } finally {
        setRefreshing(false)
      }
    }
    loadDiseaseReportsOverview()

    const loadNotifications = async () => {
      try {
        const res = await genericGetRequest(`notifications`, userToken)
        const { notifications, not_viewed_total, viewed_total } = res.results
        const summary = { not_viewed_total, viewed_total }
        updateNotifications({ notifications, summary })
      } catch (e) {
        console.log('Notification error', e)
        // Restoring token failed
      } finally {
        // Final
      }
    }
    loadNotifications()
  }, [userToken])

  useEffect(() => {
    onRefresh()
  }, [onRefresh])

  // Return
  return (
    <ScrollView
      style={styles.container}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <Menu
        visible={visible}
        toggleBottomNavigationView={toggleBottomNavigationView}
        navigation={navigation}
      />
      <Notifications
        visible={notifVisible}
        toggleNotifNavigationView={toggleNotifNavigationView}
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
            contentContainerStyle={styles.scrollViewContainerStyles}
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
          <Text style={styles.sectionSubText}>All time reported ({totalCases})</Text>
        </View>
        <View style={styles.casesContainer}>
          <DiseaseReportCard label={'Active'} total={activeCasesTotal} />
          <DiseaseReportCard label={'Resolved'} total={resolvedCasesTotal} />
        </View>

        <View style={styles.phUpdateContainer}>
          <Text numberOfLines={1} style={styles.sectionHeaderText}>
            Leading Diseases
          </Text>
          <Text style={styles.sectionSubText}>Commonly reported diseases</Text>
          <View style={styles.mainDiseaseContainer}>
            {leadingDiseasesList.length == 0 && (
              <Text style={styles.sectionSubText}>Nothing here...</Text>
            )}
            {leadingDiseasesList.map((leadingDisease, index) => (
              <MainDiseaseCard key={index} top data={leadingDisease} />
            ))}
          </View>
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
    paddingHorizontal: 16
  },
  scrollViewContainerStyles: {
    paddingRight: 30
  },
  actionBtn: {
    width: 180,
    height: '100%',
    marginLeft: -12
  },
  btnimage: {
    width: '100%',
    height: '100%'
  },
  sectionContainer: {
    paddingHorizontal: 25
  },
  phUpdateContainer: {
    paddingHorizontal: 25,
    display: 'flex',
    gap: 6
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
    fontFamily: FONT_FAMILY.POPPINS_EXTRA_LIGHT
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
  mainDiseaseContainer: {
    display: 'flex',
    gap: 15
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
