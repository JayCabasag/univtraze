import { StyleSheet, Text, View, Image, ScrollView } from 'react-native'
import moment from 'moment'
import { COLORS, FONT_FAMILY } from '../utils/app_constants'
import BottomSheet from './ui/BottomSheet'
import { useNotifications } from '../services/store/notifications/NotificationsContext'

const Notifications = ({ notifVisible, toggleNotifNavigationView }) => {
  const { notifications } = useNotifications()
  return (
    <BottomSheet
      visible={notifVisible}
      onBackButtonPress={toggleNotifNavigationView}
      onBackdropPress={toggleNotifNavigationView}
    >
      <View style={styles.bottomNavigationView}>
        <Text style={styles.modalHeaderText}>Notifications </Text>
        <ScrollView style={styles.scrolViewStyle}>
          {notifications.notifications.map((notification) => {
            return (
              <View style={styles.notificationItem} key={notification.id}>
                <Image
                  source={require('../assets/dailyAssess_icon.png')}
                  resizeMode='contain'
                  style={{
                    width: 32,
                    height: 32
                  }}
                />
                <View style={{ paddingLeft: 15 }}>
                  <Text numberOfLines={1} style={styles.notificationItemTitle}>
                    {notification.notification_title}
                  </Text>
                  <Text
                    style={{
                      color: COLORS.TEXT_BLACK,
                      fontSize: 14,
                      fontWeight: '900'
                    }}
                  >
                    {moment(notification.createdAt).fromNow()}
                  </Text>
                </View>
              </View>
            )
          })}
        </ScrollView>
      </View>
    </BottomSheet>
  )
}

export default Notifications

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#E1F5E4',
    height: '100%'
  },
  topContainer: {
    zIndex: 1,
    width: '100%',
    height: '15%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 40
  },
  menuLogo: {
    height: '50%',
    width: '20%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  notifLogo: {
    height: '50%',
    width: '20%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalHeaderText: {
    fontSize: 24,
    fontFamily: FONT_FAMILY.POPPINS_SEMI_BOLD,
    color: COLORS.TEXT_BLACK,
    paddingHorizontal: 20,
    paddingVertical: 20
  },
  notificationItem: {
    width: '100%',
    height: 54,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
    alignContent: 'center'
  },
  image: {
    width: '90%',
    height: '90%'
  },
  bottomNavigationView: {
    backgroundColor: '#fff',
    width: '100%',
    height: '100%',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30
  },
  scrollViewStyle: {
    width: '100%',
    height: '100%',
    alignSelf: 'center',
    marginBottom: 10,
    marginTop: 5
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
  // body style
  bodyContainer: {
    width: 'auto',
    height: '100%',
    marginBottom: 50,
    marginHorizontal: 48
  },
  formContainer: {
    width: 'auto',
    height: '90%'
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#28CD4199',
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderColor: COLORS.PRIMARY,
    borderWidth: 1
  },
  inputss: {
    height: 120,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#28CD4199',
    backgroundColor: '#FFFFFF',
    padding: 10,
    justifyContent: 'flex-start',
    textAlignVertical: 'top'
  }
})
