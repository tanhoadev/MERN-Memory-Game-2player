import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { PlayGameNow } from '../../../api/room'
import { message } from 'antd'
import { useAuth } from '../../contexts/AuthContext'
import Spinner from 'react-bootstrap/esm/Spinner';
import io from 'socket.io-client'

const socket = io.connect(process.env.REACT_APP_BASE_URL)
function ButtonOption({ title }) {
    const { token, userData, setJoinRoom, setIDRoom } = useAuth()
    const [load, setLoad] = useState(false)
    const handleClick = async () => {
        setLoad(true)
        try {
            await PlayGameNow({ token, idUser: userData._id })
                .then(data => {
                    setLoad(false)
                    socket.emit('join_room1', { room: parseInt(data.updateRoom.iDRoom) })
                    socket.emit('enter_room', { room: parseInt(data.updateRoom.iDRoom), user: userData.name })
                    setIDRoom(data.updateRoom._id)
                    setJoinRoom(true)
                })
                .catch(err => {
                    setLoad(false)
                    if (err.response) {
                        // message.destroy()
                        alert(err.response.data.message)
                        // message.error = err.response.data.message
                    }
                    else {
                        // message.error(err.message)
                    }
                })
        }
        catch (err) {
            console.log(err.message)
        }
    }
    return (
        <>
            {load ?
                <button className='p-0 button-option-main' disabled>
                    <Spinner className='mt-2'></Spinner>
                </button> :
                <button className='p-0 button-option-main' onClick={handleClick}>
                    <i class="fa-solid fa-gamepad"></i> {title}
                </button>
            }
        </>
    )
}

export default ButtonOption