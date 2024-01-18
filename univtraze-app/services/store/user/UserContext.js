import { useAsyncStorage } from '@react-native-async-storage/async-storage'
import React, { createContext, useContext, useReducer, useState } from 'react'
import { USER_TYPE } from '../../../utils/app_constants'

const UserContext = createContext()

export const UserContextProvider = ({ children }) => {
  const {
    getItem: getLocalStorageUser,
    setItem: setLocalStorageUser,
    removeItem: removeLocalStorageUser
  } = useAsyncStorage('@UnivtrazeApp_User')
  const [isAppUserReady, setIsAppUserReady] = useState(false)

  const [state, dispatch] = useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'RESTORE_USER':
          return {
            ...prevState,
            user: action.user
          }
        case 'UPDATE_USER':
          return {
            ...prevState,
            user: action.user
          }
        case 'UPDATE_PARTIAL_USER':
          return {
            ...prevState,
            user: action.partialUser
          }
        case 'RESTORE_USER_DETAILS':
          return {
            ...prevState,
            details: action.details
          }
        case 'CLEAR_USER':
          return {
            ...prevState,
            user: null
          }
      }
    },
    {
      user: null,
      partialUser: null
    }
  )

  React.useEffect(() => {
    // Fetch the token from storage then navigate to our appropriate place
    const bootstrapAsync = async () => {
      let user
      try {
        const stringifiedUser = await getLocalStorageUser()
        user = JSON.parse(stringifiedUser)
      } catch (e) {
        // Restoring token failed
      } finally {
        setIsAppUserReady(true)
      }

      dispatch({ type: 'RESTORE_USER', user })
    }

    bootstrapAsync()
  }, [])

  const userContext = React.useMemo(
    () => ({
      setUser: async ({ user }) => {
        const stringifiedUser = JSON.stringify(user)
        await setLocalStorageUser(stringifiedUser)
        dispatch({ type: 'RESTORE_USER', user })
      },
      clearUser: async () => {
        await removeLocalStorageUser()
        dispatch({ type: 'CLEAR_USER', user: null })
      },
      updateUser: async ({ user }) => {
        const stringifiedUser = JSON.stringify(user)
        await setLocalStorageUser(stringifiedUser)
        dispatch({ type: 'UPDATE_USER', user })
      },
      updatePartialUser: ({ partialUser }) => {
        dispatch({ type: 'UPDATE_PARTIAL_USER', partialUser })
      },
      updateDetails: ({ details }) => {
        dispatch({ type: "UPDATE_USER_DETAILS", details })
      }
    }),
    []
  )

  return (
    <UserContext.Provider
      value={{
        state,
        isAppUserReady,
        updateUser: userContext.updateUser,
        setUser: userContext.setUser,
        clearUser: userContext.clearUser,
        updateUserDetails: userContext.updateDetails
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => useContext(UserContext)
