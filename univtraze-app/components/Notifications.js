import { StyleSheet, Text, View, ScrollView } from 'react-native'
import { COLORS, FONT_FAMILY } from '../utils/app_constants'
import BottomSheet from './ui/BottomSheet'
import { useNotifications } from '../services/store/notifications/NotificationsContext'
import NotificationCard from './NotificationCard'

const Notifications = ({ visible, toggleNotifNavigationView }) => {
  const { notifications } = useNotifications()
  return (
    <BottomSheet
      visible={visible}
      onBackButtonPress={toggleNotifNavigationView}
      onBackdropPress={toggleNotifNavigationView}
    >
      <View style={styles.bottomNavigationView}>
        <Text style={styles.modalHeaderText}>Notifications </Text>
        <ScrollView
          style={styles.scrolViewStyles}
          contentContainerStyle={styles.scrollViewCotainerStyles}
        >
          {notifications.notifications.map((notification, index) => {
            return <NotificationCard notification={notification} key={index} />
          })}
        </ScrollView>
      </View>
    </BottomSheet>
  )
}

export default Notifications

const styles = StyleSheet.create({
  scrolViewStyles: {
    flex: 1
  },
  scrollViewCotainerStyles: {
    paddingHorizontal: 30
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
  bottomNavigationView: {
    backgroundColor: '#fff',
    width: '100%',
    height: '100%',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30
  }
})
