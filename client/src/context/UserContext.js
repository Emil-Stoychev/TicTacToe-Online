import { createContext, useState } from "react"

export const AuthContext = createContext()


export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState({
        username: '',
        uuid: '',
        _id: '',
        gameId: '',
        token: null
    })

    return (
        <AuthContext.Provider value={{ user, setUser }}>
            {children}
        </AuthContext.Provider>
    )
}