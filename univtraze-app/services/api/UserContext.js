import React, { createContext, useState } from 'react'

export const UserContext = createContext()

export const AuthProvider = ({ children }) => {
  const [auth, updateAuth] = useState(null)
  return <UserContext.Provider value={{ auth, updateAuth }}>{children}</UserContext.Provider>
}
