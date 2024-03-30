import React, { useEffect } from 'react'
import win from '../../../assets/img/win.jpg'
import axios from 'axios'
import { useAuth } from '../../contexts/AuthContext'
import coin from '../../../assets/img/dollar.png'
import { EndGameGoBack } from '../../../api/room'
import { message } from 'antd'

function WinGame({ price, setEndGametWin }) {
    const { idRoom, setIDRoom, idOwner, setStartGame, token } = useAuth()
    const handleClick = () => {
        EndGameGoBack({ idRoom, token })
            .then(data => {
                setEndGametWin(false)
                setStartGame(false)
            })
            .catch(err => {
                setEndGametWin(false)
            })
    }
    useEffect(() => {

    }, [])
    return (
        <div className='trans position-absolute d-flex justify-content-center align-items-center z-1 p-0' style={{ width: '100%', height: '100vh', top: '0', right: '0' }}>
            <div className='change-coin-end'>
                <span className='coin-value-end' style={{ marginRight: '4px' }}>+ {price}</span>
                <img src={coin} className='coin-img' alt="coin" />
            </div>
            <div className="d-flex justify-content-center flex-column align-items-center">
                <img src={win} alt="" className='img-draw' />
                <button className='btn btn-success cls fs-24 mt-2' onClick={handleClick}>Continue</button>
            </div>
        </div>
    )
}

export default WinGame