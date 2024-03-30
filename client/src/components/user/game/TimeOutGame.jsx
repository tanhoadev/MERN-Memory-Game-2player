import React, { useEffect, useState } from 'react'
import timeout from '../../../assets/img/timeout.webp'
import { TimeOutGameAPI } from '../../../api/room'
import io from 'socket.io-client'
import { message } from 'antd'
import { useAuth } from '../../contexts/AuthContext'

const socket = io.connect(process.env.REACT_APP_BASE_URL)

function TimeOutGame({ draw, youWin, idRoomShowStart, idTurn, setEndGametWin, setEndGameLose, setEndGameDraw, setTimeOut, id }) {
    const { token, userData } = useAuth()
    const handleClick = () => {
        if (draw) {
            setEndGameDraw(true)
        }
        else {
            if (youWin) {
                setEndGametWin(true)
            }
            else {
                setEndGameLose(true)
            }
        }
        setTimeOut(false)
    }
    useEffect(() => {
        if (userData._id !== idTurn) {
            TimeOutGameAPI({ id, token })
                .then(data => {
                    if (data.stateGame === 'draw') {
                        socket.emit("result_game_draw", { room: idRoomShowStart, draw: true })
                    }
                    else {
                        socket.emit("result_game", { room: idRoomShowStart, playerWin: data.playerWin, playerLose: data.playerLose })
                    }
                })
                .catch(error => {
                    if (error.response) {
                        message.error(error.response.data.message)
                    }
                    else {
                        message.error(error.message)
                    }
                })
        }
    }, [])
    useEffect(() => {
        socket.on("received_timeout", (data) => {
            message.success('ok')
        })
    }, [socket])
    return (
        <div className='trans position-absolute d-flex flex-column justify-content-center align-items-center z-1 p-0' style={{ width: '100%', height: '100vh', top: '0', right: '0' }}>
            <div className="d-flex justify-content-center">
                <img src={timeout} alt="" className='img-draw' />
            </div>
            <div className="d-flex justify-content-center">
                <button className='btn btn-success cls fs-24' onClick={handleClick}>Continue</button>
            </div>
        </div>
    )
}

export default TimeOutGame