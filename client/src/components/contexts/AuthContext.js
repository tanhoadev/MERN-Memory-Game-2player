import React, { createContext, useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { CheckUserJoinRoom } from '../../api/room'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(null)
    const [userData, setUserData] = useState(null)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false)
    const storedData = JSON.parse(localStorage.getItem('user_data'))
    const [joinRoom, setJoinRoom] = useState(false)
    const [isOwner, setIsOwner] = useState(false)
    const [idRoom, setIDRoom] = useState('')
    const [idOwner, setIdOwner] = useState('')
    const [startGame, setStartGame] = useState(false)
    const [coins, setCoins] = useState()
    const CheckJoinRoom = (user, token) => {
        CheckUserJoinRoom(user, token)
            .then(data => {
                if (data) {
                    if (data.status !== "waiting") {
                        setStartGame(true)
                    } else {
                        setStartGame(false)
                    }
                    setJoinRoom(true)
                    setIdOwner(data.owner._id)
                    setIDRoom(data._id)
                }
            })
            .catch(error =>{
                setJoinRoom(false)
            })
    }
    useEffect(() => {
        if (storedData) {
            const { userToken, user } = storedData
            setToken(userToken)
            setUserData(user)
            setIsAuthenticated(true)
            if (user.role === 'admin') {
                setIsAdminAuthenticated(true)
            }
            CheckJoinRoom(user)
        }
    }, [])

    const login = (newToken, newData) => {
        localStorage.setItem("user_data", JSON.stringify({ userToken: newToken, user: newData }))
        setToken(newToken)
        setUserData(newData)
        setIsAuthenticated(true)
        CheckJoinRoom(newData)
    }

    const logout = () => {
        localStorage.removeItem("user_data")
        setToken(null)
        setUserData(null)
        setIsAuthenticated(false)
        setIsAdminAuthenticated(false)
        setIDRoom('')
        setIdOwner('')
        setIsOwner(false)
        setJoinRoom(false)
    }

    return (
        <AuthContext.Provider
        value={{
            token: token,
            isAuthenticated: isAuthenticated,
            isAdminAuthenticated: isAdminAuthenticated,
            joinRoom: joinRoom,
            isOwner: isOwner,
            idOwner: idOwner,
            setIdOwner: setIdOwner,
            setIsOwner: setIsOwner,
            setJoinRoom: setJoinRoom,
            login: login,
            logout: logout,
            userData: userData,
            idRoom: idRoom,
            setIDRoom: setIDRoom,
            startGame: startGame,
            setStartGame: setStartGame,
            coins: coins,
            setCoins: setCoins
        }}
    >
        {children}
    </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)