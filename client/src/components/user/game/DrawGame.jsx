import React, { useEffect } from 'react'
import draw from '../../../assets/img/drawGame.jpg'
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';
import coin from '../../../assets/img/dollar.png'
import { EndGameGoBack } from '../../../api/room';

function DrawGame() {
    const { idRoom, setIDRoom, idOwner, setEndGameDraw, setStartGame, token } = useAuth()
    const handleClick = () => {
        setStartGame(false)
    }
    useEffect(() => {
        try {
            EndGameGoBack({ idRoom, token })
            setEndGameDraw(true)
        }
        catch {

        }
    }, [])
    return (
        <div className='trans position-absolute d-flex justify-content-center align-items-center z-1 p-0' style={{ width: '100%', height: '100vh', top: '0', right: '0' }}>
            <div className='change-coin-end'>
                <span className='coin-value-end' style={{ marginRight: '4px' }}>+ 0</span>
                <img src={coin} className='coin-img' alt="coin" />
            </div>
            <div className="d-flex justify-content-center flex-column align-items-center">
                <img src={draw} alt="" className=' img-draw' />
                <button className='btn btn-success cls fs-24 mt-2' onClick={handleClick}>Continue</button>
            </div>
        </div>
    )
}

export default DrawGame