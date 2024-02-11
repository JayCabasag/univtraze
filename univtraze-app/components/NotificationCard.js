import { View, Text, StyleSheet } from 'react-native'
import React, { useEffect } from 'react'
import DailyAssessmentIcon from '../assets/dailyAssess_icon.png'
import moment from 'moment'
import { Image } from 'react-native'
import { COLORS, FONT_FAMILY } from '../utils/app_constants'
import { genericUpdateRequest } from '../services/api/genericUpdateRequest'
import { useAuth } from '../services/store/auth/AuthContext'
import { useNotifications } from '../services/store/notifications/NotificationsContext'

export default function NotificationCard({ notification }) { 
  const { state: auth } = useAuth();
  const { updateNofications } = useNotifications();

  const notificationId = notification.id;
  const isNotifViewed = notification.notification_is_viewed == 1;
  const userToken = auth.userToken;
  useEffect(() => {
    if (!notificationId) return;
    if (isNotifViewed) return;
    if (!userToken) return;
    const updateNotificationViewStatus = async () => {
        try {
            const res = await genericUpdateRequest(`notifications/${notificationId}`, {}, userToken)
            console.log(res)
        } catch (error) {
            console.log("Update notification error", error)
        } finally {

        }
    }
    updateNotificationViewStatus()
  }, [isNotifViewed, userToken, notificationId])
  
  return (
    <View style={styles.notificationItem}>
    <Image
        source={DailyAssessmentIcon}
        resizeMode='contain'
        style={styles.notificationIconStyles}
    />
    <View style={styles.notificationInfoContainerStyles}>
        <Text numberOfLines={1} style={styles.notificationItemTitle}>
        {notification.notification_title}
        </Text>
        <Text style={styles.notificationTimeStyles}>
        {moment(notification.created_at).fromNow()}
        </Text>
    </View>
    </View>
  )
}

const styles = StyleSheet.create({
    notificationInfoContainerStyles: { 
        paddingLeft: 15
    },
    notificationItem: {
      width: '100%',
      height: 54,
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 5,
      alignContent: 'center'
    },
    notificationTimeStyles: {
      color: COLORS.TEXT_BLACK,
      fontSize: 14,
      fontFamily: FONT_FAMILY.POPPINS_LIGHT
    },
    notificationIconStyles: {
      width: 32,
      height: 32
    }
  })
  