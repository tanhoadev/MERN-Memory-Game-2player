import React, { useEffect } from 'react'
import LoseImg from '../../../assets/img/lose.jpg'
import axios from 'axios'
import { useAuth } from '../../contexts/AuthContext'
import coin from '../../../assets/img/dollar.png'
import { EndGameGoBack } from '../../../api/room'

function LoseGame({ price, setEndGameLose }) {
    const { idRoom, setIDRoom, idOwner, setStartGame, token } = useAuth()
    const handleClick = () => {
        // setStartGame(false)
        EndGameGoBack({ idRoom, token })
            .then(data => { setStartGame(false); setEndGameLose(false) })
            .catch(err => { })
    }
    useEffect(() => {

    }, [])
    return (
        <div className='trans position-absolute d-flex justify-content-center align-items-center z-1 p-0' style={{ width: '100%', height: '100vh', top: '0', right: '0' }}>
            <div className='change-coin-end'>
                <span className='coin-value-end' style={{ marginRight: '4px' }}>- {price}</span>
                <img src={coin} className='coin-img' alt="coin" />
            </div>
            <div className="d-flex justify-content-center flex-column align-items-center">
                <img src={LoseImg} alt="" className='img-draw' />
                <button className='btn btn-success cls fs-24 mt-2' onClick={handleClick}>Continue</button>
            </div>
        </div>
    )
}

export default LoseGame