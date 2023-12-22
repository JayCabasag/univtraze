import React, { createContext, useState } from 'react'

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [auth, updateAuth] = useState(null)
  return <AuthContext.Provider value={{ auth, updateAuth }}>{children}</AuthContext.Provider>
}
