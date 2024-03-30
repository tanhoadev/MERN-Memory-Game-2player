import React, { useState } from 'react'
import { EnterRoom } from '../../../api/room'
import { message } from 'antd'
import { useAuth } from '../../contexts/AuthContext'
import io from 'socket.io-client'

const socket = io.connect(process.env.REACT_APP_BASE_URL)

function SearchButton() {
    const [showModal, setShowModal] = useState(false)
    const { userData, setJoinRoom, setIDRoom, token } = useAuth()
    const [idShow, setIdShow] = useState()
    const handleChangeIdRoom = (e) => {
        if (e.target.value <= 9999 && e.target.value >= 0) {
            setIdShow(e.target.value)
        }
    }
    const handleSearch = () => {
        if (idShow) {
            EnterRoom({ idRoomShow: idShow, token, idUser: userData._id })
                .then(data => {
                    socket.emit('join_room1', { room: parseInt(idShow) })
                    socket.emit('enter_room', { room: parseInt(idShow), user: userData.name })
                    setIDRoom(data.updateRoom._id)
                    setJoinRoom(true)
                })
                .catch(error => {
                    if (error.response) {
                        // message.destroy()
                        alert(error.response.data.message)
                        // message.error(error.response.data.message)
                    }
                    else {
                        // message.destroy()
                        // message.error(error.message)
                    }
                })
        }
    }
    return (
        <>
            {
                showModal ?
                    <div className="position-absolute mt-2 z-1 d-flex p-0" style={{ marginLeft: '12px', width: '95%' }}>
                        <input type="number" onChange={handleChangeIdRoom} maxLength={5} min={0} max={9999} required className='form-control position-relative' value={idShow} placeholder='Enter room ID' style={{ borderRadius: '14px' }} />
                        <i class="fa-solid fa-magnifying-glass p-3 icon-waiting-room" onClick={handleSearch}></i>
                        <i class="fa-solid fa-xmark position-absolute p-2" onClick={() => setShowModal(false)} style={{ right: '53px', top: '-5px', color: '#FF204E', fontSize: '20px' }}></i>
                    </div>
                    :
                    <div className="position-absolute z-1 p-0 icon-waiting-room" style={{ marginLeft: '12px' }}>
                        <i class="fa-solid fa-magnifying-glass p-3" onClick={() => setShowModal(true)}></i>
                    </div>
            }
        </>
    )
}

export default SearchButton