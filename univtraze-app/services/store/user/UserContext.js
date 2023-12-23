import { createContext, useContext, useReducer, useRef } from 'react'

const UserContext = createContext()

export const UserContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'SET_USER':
          return {
            ...prevState,
            user: action.user
          }
        case 'CLEAR_USER':
          return {
            ...prevState,
            user: null
          }
      }
    },
    {
      user: null
    }
  )
  return <UserContext.Provider value={{ state, dispatch }}>{children}</UserContext.Provider>
}

export const useUser = () => useContext(UserContext)
