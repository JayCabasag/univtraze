import { useAsyncStorage } from '@react-native-async-storage/async-storage'
import React, { createContext, useContext, useState } from 'react'
import { genericGetRequest } from '../../api/genericGetRequest'

const AuthContext = createContext()

export const AuthContextProvider = ({ children }) => {
  const [isAppAuthReady, setIsAppUserReady] = useState(false)
  const {
    getItem: getLocalStorageToken,
    setItem: setLocalStorageToken,
    removeItem: removeLocalStorageToken
  } = useAsyncStorage('@UnivtrazeApp_Token')
  const [state, dispatch] = React.useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'RESTORE_TOKEN':
          return {
            ...prevState,
            userToken: action.token,
            isLoading: false
          }
        case 'SIGN_IN':
          return {
            ...prevState,
            isSignout: false,
            userToken: action.token
          }
        case 'SIGN_OUT':
          return {
            ...prevState,
            isSignout: true,
            userToken: null
          }
        default:
          return {
            ...prevState
          }
      }
    },
    {
      isLoading: true,
      isSignout: false,
      userToken: null
    }
  )

  React.useEffect(() => {
    // Fetch the token from storage then navigate to our appropriate place
    const bootstrapAsync = async () => {
      let userToken
      try {
        const token = await getLocalStorageToken()
        const res = await genericGetRequest('users/verify', token)
        userToken = res.token
      } catch (e) {
        // Restoring token failed
      } finally {
        setIsAppUserReady(true)
      }

      // After restoring token, we may need to validate it in production apps

      // This will switch to the App screen or Auth screen and this loading
      // screen will be unmounted and thrown away.
      dispatch({ type: 'RESTORE_TOKEN', token: userToken })
    }

    bootstrapAsync()
  }, [])

  const authContext = React.useMemo(
    () => ({
      signIn: async ({ token }) => {
        await removeLocalStorageToken()
        await setLocalStorageToken(token)
        dispatch({ type: 'SIGN_IN', token })
      },
      signOut: async () => {
        await removeLocalStorageToken()
        dispatch({ type: 'SIGN_OUT' })
      },
      signUp: async ({ token }) => {
        await removeLocalStorageToken()
        await setLocalStorageToken(token)
        dispatch({ type: 'SIGN_IN', token })
      }
    }),
    []
  )

  return (
    <AuthContext.Provider
      value={{
        isAppAuthReady,
        state,
        signIn: authContext.signIn,
        signOut: authContext.signOut,
        signUp: authContext.signUp
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
