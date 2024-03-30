import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { message } from 'antd'
const useSignup = () => {
    const { login } = useAuth()
    const [error, setError] = useState(null)
    const [loading, setloading] = useState(null)

    const registerUser = async (values) => {
        if (values.password !== values.passwordConfirm) {
            return setError('Passwords are not the same')
        }
        try {
            setError(null)
            setloading(true)
            const res = await fetch(`${process.env.REACT_APP_BASE_URL}/api/auth/signup`, {
                method: "POST",
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(values)
            })

            const data = await res.json()
            if (res.status === 201) {
                message.destroy()
                message.success(data.message)
                login(data.token, data.user)
            } else if (res.status === 400) {
                setError(data.message)
            } else {
                message.destroy()
                message.error()
            }
        } catch (error) {
            message.error(error)
        } finally {
            setloading(false)
        }
    }

    return { loading, error, registerUser }
}

export default useSignup