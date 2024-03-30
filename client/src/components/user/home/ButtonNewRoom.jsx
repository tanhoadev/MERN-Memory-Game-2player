import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import '../../../assets/css/cardOption.css'
import coin from '../../../assets/img/dollar.png'
import { CreateRoom } from '../../../api/room';
import { message } from 'antd'

function ButtonNewRoom({ dataRoomCate }) {
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false)
    const { userData, setJoinRoom, setIdOwner, setIDRoom, token } = useAuth()
    const handleClickModal = () => {
        setShowModal(true)
    }
    const handleClickCreateRoom = async (idRoomCt) => {
        await CreateRoom({ token, idUser: userData._id, idRoomCate: idRoomCt })
            .then(newRoom => {
                setJoinRoom(true)
                setIdOwner(userData._id)
                setIDRoom(newRoom._id)
                navigate("/main/waiting-room");
            })
            .catch(error => {
                if (error.response) {
                    message.destroy()
                    message.error(error.response.data.message)
                }
                else {
                    message.destroy()
                    message.error(error.message)
                }
            })
    }
    return (
        <>
            {showModal &&
                <div className="position-absolute z-2 w-100 h-100" style={{ background: '#EEE4B1' }}>
                    <div className="row">
                        <div className="col text-end">
                            <i class="fa-solid fa-xmark fz-38" onClick={() => setShowModal(false)} style={{ padding: '8px 18px', color: '#FF004D' }}></i>
                        </div>
                    </div>
                    <div className="row justify-content-center" style={{ gap: '12px 12px' }}>
                        {
                            dataRoomCate.length > 0 &&
                            dataRoomCate.map((item, index) => (
                                <div key={dataRoomCate._id} class="card-option  col-12">
                                    <div class="heading d-flex align-items-center"><span style={{ fontSize: '38px', marginRight: '4px' }}>{item.price}</span><img src={coin} className='coin-img' alt="" /></div>
                                    <p class="para m-0 mb-2 fw-bold color-blackFake">- {item.duration} minutes -</p>
                                    <div class="overlay"></div>
                                    <button class="card-btn" onClick={() => handleClickCreateRoom(item._id)}>Go</button>
                                </div>
                            ))
                        }
                    </div>


                </div>
            }
            <button className='p-0 button-option-main' onClick={handleClickModal} >
                <i class="fa-solid fa-door-open"></i> Create Room
            </button>
        </>
    );
}

export default ButtonNewRoom