import { createContext, useContext, useState } from "react";

const UserContext = createContext();

export const UserContextProvider = ({ children }) => {
    const [user, updateUser] = useState(null)
    return (
        <UserContext.Provider value={{ user, updateUser }}>
            {children}
        </UserContext.Provider>
    )
}

export const useUser = () => useContext(UserContext)