import { message } from 'antd'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import io from 'socket.io-client'
import { ClickCard } from '../../../api/room'
const socket = io.connect(process.env.REACT_APP_BASE_URL)

function Cardchild({ srcfront, backCard, yourTurn, setPairsUser1, setPairsUser2, setYourTurn, setStateCards, stateCard, index, idRoom, idRoomShowStart }) {
    // alert(idRoomShowStart)
    const { userData, token } = useAuth()
    const [draw, setDraw] = useState(false)
    const handleClick = async () => {
        await ClickCard({ idRoom, userId: userData._id, clickedIndex: index, token })
            .then((data) => {
                if (data.updateRoom) {
                    setStateCards(data.updateRoom.stateCard)
                    socket.emit('click_Card', { room: idRoomShowStart, setPairsUser2: data.updateRoom.pairPlayers[1], setPairsUser1: data.updateRoom.pairPlayers[0], index: index, setStateCards: data.updateRoom.stateCard })
                }
                if (data.newUpdateRoom) {
                    if (data.endGame) {
                        if (data.stateGame === "draw") {
                            socket.emit("draw_Game", { room: idRoomShowStart })
                        }
                        else {
                            if (data.idUserWin && data.idUserLose) {
                                socket.emit("Win_Or_Lose_Game", { idWin: data.idUserWin._id, idLose: data.idUserLose._id, room: idRoomShowStart })
                            }
                        }
                    }
                    setYourTurn(false)
                    setPairsUser1(data.newUpdateRoom.pairPlayers[0])
                    setPairsUser2(data.newUpdateRoom.pairPlayers[1])
                    setStateCards(data.stateCardVirtual);
                    setTimeout(() => {
                        setStateCards(data.newUpdateRoom.stateCard)
                        socket.emit('click_Card', { room: idRoomShowStart, index: index, setStateCards: data.newUpdateRoom.stateCard, setPairsUser2: data.newUpdateRoom.pairPlayers[1], setPairsUser1: data.newUpdateRoom.pairPlayers[0] })
                    }, 800)
                    // setStateCards([])
                    socket.emit('click_Card', { room: idRoomShowStart, index: index, setPairsUser2: data.newUpdateRoom.pairPlayers[1], setPairsUser1: data.newUpdateRoom.pairPlayers[0], setStateCards: data.stateCardVirtual })
                    socket.emit('change_turn', { room: idRoomShowStart, turn: data.newUpdateRoom.turn[0]._id })
                }
                // setStateCards()
            })
            .catch(error => {
                message.destroy()
                message.error('this is not your turn !!!')
            })
    }

    return (
        <>
            <div className={`card-poke ${stateCard ? 'is-revealed' : ''} card${index}`}>
                <div className="card-face-poke back-card-poke position-absolute" style={{}}>
                    {yourTurn ?
                        <img className='img-card col-3' onClick={handleClick} src={backCard} style={{ width: '75px' }} alt="" />
                        :
                        <img className='img-card col-3' onClick={() => {message.destroy(); message.error('not your turn yet')}} src={backCard} style={{ width: '75px' }} alt="" />
                    }
                </div>
                <div className="card-face-poke front-card-poke" style={{ display: 'inline-flex' }}>
                    <img className='img-card col-3 ' src={srcfront} style={{ width: '75px' }} alt="" />
                </div>
            </div>
        </>
    )
}

export default Cardchild