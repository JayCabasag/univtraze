import { createContext, useContext, useEffect, useMemo, useReducer } from 'react'
import { useAuth } from '../auth/AuthContext'
import { genericGetRequest } from '../../api/genericGetRequest'

const NotificationsContext = createContext(null)

export const NotificationsContextProvider = ({ children }) => {
  const { state: auth } = useAuth()
  const [notifications, dispatch] = useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'RESTORE_NOTIFICATIONS':
          return {
            ...prevState,
            summary: action.summary,
            notifications: action.notifications
          }
        case 'CREAR_NOTIFICATIONS':
          return {
            ...prevState,
            summary: null,
            notifications: []
          }

        default:
          return prevState
      }
    },
    {
      summary: null,
      notifications: []
    }
  )

  const token = auth.userToken
  useEffect(() => {
    if (!token) return
    const bootstrapAsync = async () => {
      let notificationList
      let summary
      try {
        const res = await genericGetRequest(`notifications`, token)
        const { notifications, not_viewed_total, viewed_total } = res.results
        notificationList = notifications
        summary = { not_viewed_total, viewed_total }
        dispatch({ type: 'RESTORE_NOTIFICATIONS', notifications, summary })
      } catch (e) {
        console.log('Notification error', e)
        // Restoring token failed
      } finally {
        // Final
      }
    }
    bootstrapAsync()
  }, [token])

  const dispatcherFn = () =>
    useMemo(
      () => ({
        updateNotifications: ({ notifications }) => {
          dispatch({ type: 'RESTORE_NOTIFICATIONS', notifications })
        },
        clearNotifications: () => {
          dispatch({ type: 'CLEAR_NOTIFICATIONS' })
        }
      }),
      []
    )

  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        updateNotifications: dispatcherFn.updateNotifications,
        clearNotifications: dispatcherFn.clearNotifications
      }}
    >
      {children}
    </NotificationsContext.Provider>
  )
}

export const useNotifications = () => useContext(NotificationsContext)
