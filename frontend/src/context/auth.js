import React, { createContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [data, setData] = useState({});


    return (
        <AuthContext.Provider value={{data, setData}}>
            {children}
        </AuthContext.Provider>

    )
}

export default AuthContext