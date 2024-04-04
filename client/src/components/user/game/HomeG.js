import React, { useEffect, useState } from 'react'
import axios from 'axios'
import ListCard from './ListCard'
import { useAuth } from '../../contexts/AuthContext'
import io from 'socket.io-client'
import { message } from 'antd'
import DrawGame from './DrawGame'
import WinGame from './WinGame'
import LoseGame from './LoseGame'
import { CheckUserJoinRoom, EndGameGoBack } from '../../../api/room'
import TimeOutGame from './TimeOutGame'
import InforUserTurn from './InforUserTurn'
import InfoUser from './InfoUser'
import { GetUserCoins } from '../../../api/user'

const socket = io.connect(process.env.REACT_APP_BASE_URL)

function HomeG() {
    const { userData, setStartGame, token, setCoins } = useAuth()

    const [user1, setUser1] = useState([])
    const [user2, setUser2] = useState([])
    const [pairsUser1, setPairsUser1] = useState()
    const [pairsUser2, setPairsUser2] = useState()
    const [backCardPoke, setBackCardPoke] = useState()
    const [frontCardPoke, setFrontCardPoke] = useState([])
    const [yourTurn, setYourTurn] = useState(false)
    const [stateCards, setStateCards] = useState([])
    const [idRoomStart, setIdRoomStart] = useState()
    const [idRoomShowStart, setIdRoomShowStart] = useState()
    const [idTurn, setIDTurn] = useState()
    const [endGameDraw, setEndGameDraw] = useState(false)
    const [endGamewin, setEndGametWin] = useState(false)
    const [endGamelose, setEndGameLose] = useState(false)
    const [timeOut, setTimeOut] = useState(false)
    const [timeEndGame, setTimeEndGame] = useState()

    const [youWin, setYouWin] = useState(false)
    const [draw, setDraw] = useState(false)
    const [end, setEnd] = useState(false)

    const [timePlay, setTimePlay] = useState()
    const [hours, setHours] = useState(null)
    const [minutes, setMinutes] = useState(null)
    const [seconds, setSeconds] = useState(null)
    const [price, setPrice] = useState()
    useEffect(() => {
        CheckUserJoinRoom(userData, token)
            .then(data => {

                if (data.turn[0]._id === userData._id) {
                    setYourTurn(true)
                } else {
                    setYourTurn(false)
                }
                setSeconds(1)
                setPrice(data.category.price)
                setPairsUser1(data.pairPlayers[0])
                setPairsUser2(data.pairPlayers[1])
                setIDTurn(data.turn[0]._id)
                setIdRoomStart(data._id)
                setUser1(data.participants[0])
                setUser2(data.participants[1])
                setFrontCardPoke(data.cards)
                setBackCardPoke(data.backCard[0])
                setStateCards(data.stateCard)
                setIdRoomShowStart(data.iDRoom)
                setTimeEndGame(data.timeEndGame)
                socket.emit('join_room1', { room: parseInt(data.iDRoom) })
            })
            .catch(err => console.log(err))
        
    }, [])
    useEffect(() =>{
        socket.on('card_change', (data) => {
            setStateCards(data.setStateCards)
            // if (data.setPairsUser1  data.setPairsUser2) {
            setPairsUser1(data.setPairsUser1)
            setPairsUser2(data.setPairsUser2)
            // }
        })
        socket.on("change_turn_receive", (data) => {
            setYourTurn(true)
            setIDTurn(data.turn)
            if (data.turn === userData._id) {

            }
        })
        socket.on("end_game_draw", (data) => {
            if(!end){
                setTimeout(() => {
                    if(!end){
                        setEndGameDraw(true)
                    }
                }, 1500)
            }
        })
        socket.on("end_game_win_lose", (data) => {
            if (data.idWin && data.idLose) {
                setEnd(true)
                setTimeout(() => {
                    if (data.idWin === userData._id) {
                        setEndGametWin(true)
                        setEndGameLose(false)
                        setEndGameDraw(false)
                    }
                    if (data.idLose === userData._id) {
                        setEndGameLose(true)
                        setEndGametWin(false)
                        setEndGameDraw(false)
                    }
                }, 1500)
            }
        })
        socket.on("result_game_received", data => {
            if (data.playerWin._id === userData._id) {
                setYouWin(true)
            } else {
                setYouWin(false)
            }
        })
        socket.on("result_game_received_draw", data => {
            setDraw(true)
        })
        // return () => {
        //     clearInterval(intervalId);
        // };
    },[socket])
    useEffect(() => {
            if(!end){
                const intervalId = setInterval(() => {
                    let x = Date.now()
                    const dayEnd = new Date(timeEndGame)
                    const daynow = new Date(x)
                    const diff = new Date(dayEnd - daynow)
        
                    const hours = Math.floor(diff / (1000 * 60 * 60));
                    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
                    setHours(hours);
                    setMinutes(minutes);
                    setSeconds(seconds);
                    if (hours === 0 && minutes === 0 && seconds === 0) {
                        setTimeOut(true)
                    }
                }, 1000)
                return () => {
                    clearInterval(intervalId);
                };
            }
    }, [seconds, end])
    return (
        <div className='container-fluid p-0 overflow-hidden'>
            <img className='img-background'
                src="https://th.bing.com/th/id/R.b0c78422f558b261d84ee3f02cbd9e03?rik=tvAcGKzimal0Gw&pid=ImgRaw&r=0"
                alt=""
                style={{ width: '100%', height: '100vh', objectFit: 'cover', opacity: '' }}
            />
            <div className="row pt-2 p-0 justify-content-center">
                {endGameDraw && <DrawGame draw={draw} setEndGameDraw={setEndGameDraw} />}
                {endGamewin && <WinGame price={price} setEndGametWin={setEndGametWin} />}
                {endGamelose && <LoseGame price={price} setEndGameLose={setEndGameLose} />}
                {timeOut && <TimeOutGame draw={draw} youWin={youWin} idTurn={idTurn} idRoomShowStart={idRoomShowStart} id={idRoomStart} setTimeOut={setTimeOut} setEndGametWin={setEndGametWin} setEndGameLose={setEndGameLose} setEndGameDraw={setEndGameDraw} />}
                <div className="p-0 col-sm-2 col-lg-1 col-3 justify-content-center info-player-left">
                    {idTurn === user1._id ?
                        <InforUserTurn user={user1.name} pairs={pairsUser1} /> :
                        <InfoUser user={user1.name} yourTurn={yourTurn} pairs={pairsUser1} idTurn={idTurn} />
                    }
                </div>
                <div className="p-0 col-4 col-lg-1 col-sm-2" style={{ margin: '0 6px' }}>
                    <div className="d-flex justify-content-center align-items-center clock-vs">
                        <span style={{ width: '23px' }}>{minutes}</span>
                        <span style={{ margin: '0 6px' }}>:</span>
                        <span style={{ width: '23px' }}>{seconds}</span>
                    </div>
                </div>
                <div className="p-0 col-3 col-lg-1 col-sm-2">
                    {idTurn === user2._id ?
                        <InforUserTurn user={user2.name} pairs={pairsUser2} /> :
                        <InfoUser user={user2.name} pairs={pairsUser2} yourTurn={yourTurn} idTurn={idTurn} />
                    }
                </div>
            </div>
            <ListCard frontCard={frontCardPoke} setPairsUser1={setPairsUser1} setPairsUser2={setPairsUser2} yourTurn={yourTurn} setYourTurn={setYourTurn} setStateCards={setStateCards} stateCards={stateCards} idRoom={idRoomStart} idRoomShowStart={idRoomShowStart} backCard={backCardPoke} />
        </div>
    );

} export default HomeG;