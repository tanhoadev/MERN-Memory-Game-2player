import React, { useEffect, useState } from 'react'
import io from 'socket.io-client'
import { useAuth } from '../../contexts/AuthContext'
const socket = io.connect(process.env.REACT_APP_BASE_URL)

function InfoUser({ user, yourTurn, idTurn, pairs }) {
    const { userData } = useAuth()
    return (
        <div class="card-info d-flex justify-content-center flex-column cardInfoUser" >
            <span className='user-name-start' >{user}</span>
            <span className='pair-info'>Pairs: <span className='pair-value' >{pairs}</span></span>
        </div>
    )
}

export default InfoUser