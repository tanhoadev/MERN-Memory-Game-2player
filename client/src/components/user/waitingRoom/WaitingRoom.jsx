import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import pokeRightIdRoom from '../../../assets/img/pokemon-id-room.png'
import pokeLeftIdRoom from '../../../assets/img/image.png'
import ButtonPokemon from './ButtonPokemon'
import { useAuth } from '../../contexts/AuthContext'
import axios from 'axios'
import { message } from 'antd'
import io from 'socket.io-client'
import { CheckUserJoinRoom, DeleteRoom, RemovePlayer } from '../../../api/room'
import { GetAllRoom } from '../../../api'
import '../../../assets/css/waitingroom.css'
import ButtonReady from './ButtonReady'
import coin from '../../../assets/img/dollar.png'
import ChatModal from './ChatModal'

const socket = io.connect(process.env.REACT_APP_BASE_URL)

function WaitingRoom() {
    const { userData, setCoins, setJoinRoom, isOwner, setIsOwner, idRoom, setIDRoom, idOwner, token, setIdOwner, startGame, setStartGame } = useAuth()
    const [idRoomShow, setIdRoomShow] = useState('')
    const [user1, setUser1] = useState('')
    const [user2, setUser2] = useState('')
    const [price, setPrice] = useState()
    const [minutes, setMinutes] = useState()
    const [idUser2, setIdUser2] = useState('')
    const [ready, setReady] = useState(false)
    const [kickModal, setKickModal] = useState(false)
    const [HomeModal, setHomekModal] = useState(false)
    const fetchWatingroom = async () => {
        await CheckUserJoinRoom(userData, token)
            .then(async data => {
                if (data) {
                    if (data.owner._id === userData._id) {
                        setCoins(data.owner.coins)
                        if (data.participants[0].coins < data.category.price) {
                            try {
                                await DeleteRoom({ idRoom: data._id, idOwner: data.owner._id, token })
                                    .then(res => {
                                        socket.emit('delete_room', { room: parseInt(data.iDRoom) })
                                        setJoinRoom(false)
                                        setIDRoom('')
                                        setIdOwner('')
                                        setIsOwner(false)
                                    })
                                    .catch(error => {
                                        console.log(error)
                                    })
                            }
                            catch {

                            }
                        }
                    }
                    if (data.participants[1]) {
                        if (data.participants[1]._id === userData._id) {
                            setCoins(data.participants[1].coins)
                        }
                        if (data.participants[1].coins < data.category.price && data.participants[1]._id === userData._id) {
                            RemovePlayer({ idRoom: data._id, idUser: data.owner._id, idGuestUser: data.participants[1]._id, token })
                                .then((res) => {
                                    socket.emit("leave_room", { room: parseInt(data.iDRoom), user: userData.name })
                                    setJoinRoom(false)
                                    setIDRoom('')
                                    setIdOwner('')
                                })
                                .catch(err => {
                                    console.log(err)
                                })
                        }
                        else {
                            setUser2(data.participants[1].name)
                            setIdUser2(data.participants[1]._id)
                        }
                    }
                    console.log(data.owner._id)
                    setIdRoomShow(data.iDRoom)
                    setUser1(data.owner.name)
                    setIdOwner(data.owner._id)
                    setIDRoom(data._id)
                    setReady(data.ready)
                    setMinutes(data.category.duration)
                    setPrice(data.category.price)
                    localStorage.setItem('id-room-show', data.iDRoom)
                    // if (data.participants[1]) {
                    //     setUser2(data.participants[1].name)
                    //     setIdUser2(data.participants[1]._id)
                    // }
                }
            })
            .catch(error => {
                console.log(error)
            })
    }
    const handleBackHome = async () => {
        if (idOwner === userData._id) {
            await DeleteRoom({ idRoom, idOwner, token })
                .then(res => {
                    setJoinRoom(false)
                    setIDRoom('')
                    setIdOwner('')
                    setIsOwner(false)
                    setReady(false)
                    socket.emit('delete_room', { room: idRoomShow })
                })
                .catch(error => {
                    console.log(error)
                })
        }
        else {
            await RemovePlayer({ idRoom, idUser: idOwner, idGuestUser: userData._id, token })
                .then((res) => {
                    socket.emit("leave_room", { room: idRoomShow, user: userData.name })
                    setJoinRoom(false)
                    setIDRoom('')
                    setIdOwner('')
                    setReady(false)
                })
                .catch(err => {
                    alert('error')
                    console.log(err)
                })
        }
    }
    const handleKick = () => {
        setKickModal(false)
        RemovePlayer({ idRoom, idUser: userData._id, idGuestUser: idUser2, token })
            .then(res => {
                socket.emit('kick_player', { room: idRoomShow, player: idUser2 })
                setUser2('')
                setIdUser2('')
            })
            .catch(error => {
                console.log(error)
                message.error(error.response.data.message)
            })
    }

    useEffect(() => {
        if (userData) {
            if (idOwner === userData._id) {
                setIsOwner(true)
            }
        }
        else {
            setIsOwner(false)
        }
        socket.on('the_end_room', (data) => {
            message.destroy()
            message.info(data.message)
            setJoinRoom(false)
            setIdOwner('')
            setIDRoom('')
        })
        socket.on("notify_leave", (data) => {
            setUser2('')
        })
    }, [idOwner, socket])
    useEffect(() => {
        fetchWatingroom()
    }, [])
    useEffect(() => {
        socket.on('card_change', (data) => {
        })
        socket.on('Notify', (data) => {
            if (userData._id === data.player) {
                message.destroy();
                message.info('You have been kicked out of the room')
            }
            setIdOwner('')
            setJoinRoom(false)
        })
        socket.on("New_join", (data) => {
            fetchWatingroom()
        })
        socket.on('start', (data) => {
            setStartGame(true)
        })
        socket.on("received_ready", (data) => {
            setReady(data.ready)
        })
    }, [socket])
    useEffect(() => {
        if (idRoomShow !== '') {
            socket.emit('join_room1', { room: idRoomShow })
        }
    }, [idRoomShow])


    return (
        <>
            {
                kickModal && <div className="position-absolute z-1 d-flex flex-column justify-content-center  align-items-center" style={{ width: '90%', maxWidth: '1100px', top: '25%', background: '#eee4b1', borderRadius: '18px', height: '50vh' }}>
                    <div className="row align-self-end position-absolute " style={{ right: '12px', top: '6px' }}>
                        <i class="fa-solid fa-xmark fz-38" style={{ color: "rgb(255, 0, 77)" }} onClick={() => setKickModal(false)}></i>
                    </div>
                    <div className="row">
                        <h3 className='text-center fw-bold p-5'>Are you sure you want to kick this player?</h3>
                    </div>
                    <div className="row d-flex gap-2 p-3 w-100 justify-content-end position-absolute bottom-0">
                        <button className='btn btn-secondary ' style={{ width: '110px' }} onClick={() => setKickModal(false)}>No</button>
                        <button className='btn btn-success ' style={{ width: '110px' }} onClick={handleKick}>Yes</button>
                    </div>
                </div>
            }
            {
                HomeModal && <div className="position-absolute z-1 d-flex flex-column justify-content-center  align-items-center" style={{ width: '90%', maxWidth: '1100px', top: '25%', background: '#eee4b1', borderRadius: '18px', height: '50vh' }}>
                    <div className="row align-self-end position-absolute " style={{ right: '12px', top: '6px' }}>
                        <i class="fa-solid fa-xmark fz-38" style={{ color: "rgb(255, 0, 77)" }} onClick={() => setHomekModal(false)}></i>
                    </div>
                    <div className="row">
                        <h3 className='text-center fw-bold p-5'>Are you sure you want to leave the room?</h3>
                    </div>
                    <div className="row d-flex gap-2 p-3 w-100 justify-content-end position-absolute bottom-0">
                        <button className='btn btn-secondary ' style={{ width: '110px' }} onClick={() => setHomekModal(false)}>No</button>
                        <button className='btn btn-success ' style={{ width: '110px' }} onClick={handleBackHome}>Yes</button>
                    </div>
                </div>
            }
            <ChatModal idRoomShow={idRoomShow} />
            <div className="row p-0 height-sidebar m-0 trans">
                <div className="row p-0 d-flex">
                    <div className="col-1 z-1">
                        <Link to={'/main'} className='z-1' onClick={() => setHomekModal(true)}>
                            <i className="fa-solid fa-reply-all exit-room-icon m-12"></i>
                        </Link>
                    </div>
                    <div className="col text-end pt-3">
                        <div className="row">
                            <div className="col text-center d-flex align-items-center justify-content-center" >
                                <span className='value-cate-waiting' style={{ marginRight: '5px', marginLeft: '-8.3%' }}>{price} </span>
                                <img className='coin-img coin-img-mobile' src={coin} alt="" />
                                <span className='value-cate-waiting' style={{ marginLeft: '5px' }}>- {minutes} minutes </span>
                            </div>
                        </div>
                        <div className="group-room">
                            <img src={pokeLeftIdRoom} className='dragon-left' style={{ width: '100px', objectFit: 'cover' }} alt="" />
                            <label className='idroom' >Room ID: <strong>{idRoomShow}</strong></label>
                            <img src={pokeRightIdRoom} className='dragon-right' style={{ width: '100px', objectFit: 'cover', marginRight: '6px' }} alt="" />
                        </div>
                    </div>
                </div>
                <div className="row d-flex row-two-player justify-content-center align-items-center p-0">
                    <div class="col-md-3 col-sm-12  col-xs-12 d-flex justify-content-center">
                        <div className="card-wait d-flex flex-column justify-content-center">
                            <img className='img-card-waiting-room' src="https://avatarfiles.alphacoders.com/190/thumb-1920-190017.jpg" alt="" />
                            <i class="icon-waiting-room home-icon fa-solid fa-house"></i>
                            <h2 className='user-name-waiting'>{user1}</h2>
                        </div>
                    </div>
                    <div className="col-md-2 col-sm-12 d-flex justify-content-center align-items-center col-sx-12 text-center">
                        <img src="https://cdn0.iconfinder.com/data/icons/sports-and-awards-15/66/1-512.png" className='img-vs' alt="" />
                    </div>
                    <div class="col-md-3 col-sm-12  col-sx-12 d-flex justify-content-center">
                        <div className="card-wait d-flex flex-column justify-content-center">
                            {
                                user2 ?
                                    <>
                                        <img className='img-card-waiting-room' src="https://avatarfiles.alphacoders.com/190/thumb-1920-190017.jpg" alt="" />
                                        {
                                            ready ? <i class="icon-waiting-room ready-icon fa-solid fa-circle-check"></i>
                                                :
                                                <i class="icon-waiting-room not-ready-icon fa-solid fa-circle-xmark"></i>
                                        }
                                        <button>
                                            {isOwner && <i class="icon-waiting-room kick-icon fa-solid fa-xmark" onClick={() => setKickModal(true)}></i>}
                                        </button>
                                        <h2>{user2}</h2><i class=""></i>
                                    </>
                                    :
                                    <>
                                        <h2><i class="fa-solid fa-question"></i></h2>
                                    </>
                            }
                        </div>
                    </div>
                </div>
                <div className="row p-0 mb-0 btn-start align-items-center text-end ">
                    {
                        isOwner ? <ButtonPokemon idOwner={idOwner} idRoomShow={idRoomShow} startGame={startGame} setStartGame={setStartGame} idRoom={idRoom} title={"Go!"} className="col" />
                            :
                            <ButtonReady idRoom={idRoom} ready={ready} idRoomShow={idRoomShow} setReady={setReady} title="Ready" />
                    }
                </div>
            </div>
        </>
    )
}

export default WaitingRoom