import { useState } from "react";
import { message } from 'antd'
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";

const useLogin = () => {
    const { login } = useAuth()
    const [error, setError] = useState(null)
    const [loading, setloading] = useState(null)

    const loginUser = async (values) => {
        try {
            setError(null)
            setloading(true)
            const res = await fetch(`${process.env.REACT_APP_BASE_URL}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(values)
            })

            const data = await res.json()

            if (res.status === 200) {
                message.success(data.message)
                login(data.token, data.user)
            } else if (res.status === 404) {
                setError('Username or password is incorrect.')
            } else {
                message.destroy()
                message.error('Username or password is incorrect.')
            }
        } catch (error) {
            message.destroy()
            message.error("Login Failed")
        } finally {
            setloading(false)
        }
    }
    return { loading, error, loginUser }
}

export default useLogin