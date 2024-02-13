import { createContext, useContext, useEffect, useMemo, useReducer, useState } from 'react'
import { useUser } from '../user/UserContext'
import { genericGetRequest } from '../../api/genericGetRequest'

const UserTemperaturesContext = createContext()

export const UserTemperaturesContextProvider = ({ children }) => {
  const { state: user } = useUser()
  const userId = user?.user?.id
  const [state, dispatch] = useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'RESTORE_USER_TEMPERATURES':
          return {
            ...prevState,
            temperatures: action.temperatures
          }
        case 'CLEAR_USER_TEMPERATURES':
          return {
            ...prevState,
            temperatures: []
          }

        default:
          return {
            ...prevState
          }
      }
    },
    {
      temperatures: []
    }
  )

  useEffect(() => {
    if (!userId) return
    // Fetch the token from storage then navigate to our appropriate place
    const bootstrapAsync = async () => {
      let temperatures = []
      try {
        const res = await genericGetRequest(`temperature-history?user_id=${userId}`)
        temperatures = res.results
      } catch (e) {
        // Restoring token failed
      } finally {
        // Final
      }
      dispatch({ type: 'RESTORE_USER_TEMPERATURES', temperatures })
    }
    bootstrapAsync()
  }, [userId])

  const userTemperatureContext = useMemo(
    () => ({
      updateUserTemperatures: ({ temperatures }) => {
        dispatch({ type: 'RESTORE_USER_TEMPERATURES', temperatures })
      },
      clearUserTemperatures: () => {
        dispatch({ type: 'CLEAR_USER_TEMPERATURES' })
      }
    }),
    []
  )

  return (
    <UserTemperaturesContext.Provider
      value={{
        temperatures: state.temperatures,
        clearUserTemperatures: userTemperatureContext.clearUserTemperatures,
        updateUserTemperatures: userTemperatureContext.updateUserTemperatures
      }}
    >
      {children}
    </UserTemperaturesContext.Provider>
  )
}

export const useUserTemperatures = () => useContext(UserTemperaturesContext)
