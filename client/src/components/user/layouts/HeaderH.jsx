import React, { useEffect, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import backMusic from '../../../assets/backmusic.wav'
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';
import io from 'socket.io-client'
import { message } from 'antd';
import coin from '../../../assets/img/dollar.png'
import { GetUserCoins } from '../../../api/user';

const socket = io.connect(process.env.REACT_APP_BASE_URL)

function HeaderH() {
    const { coins, setCoins, token, userData, logout, isOwner, setIsOwner, setJoinRoom, idRoom, idOwner, setIDRoom, joinRoom, setIdOwner } = useAuth()
    const handleLogout = async () => {
        if (isOwner) {
            if (!joinRoom) {
                await logout()
                return
            }
            await axios.delete(`http://localhost:5000/api/room/delete/${idRoom}?idUser=${userData._id}`, {
                headers: {
                    "Content-Type": "Application/json"
                }
            })
                .then(async res => {
                    setIsOwner(false)
                    setJoinRoom(false)
                    socket.emit('delete_room', { room: parseInt(localStorage.getItem('id-room-show')) })
                    await logout()
                })
                .catch(error => {
                    console.log(error)
                })
        }
        else {
            if (!joinRoom) {
                await logout()
                return
            }
            await axios.put(`http://localhost:5000/api/room/remove-player/${idRoom}`, { idUser: idOwner, idGuestUser: userData._id }, {
                headers: {
                    "Content-Type": "Application/json"
                }
            })
                .then(async res => {
                    setJoinRoom(false)
                    setIdOwner('')
                    await logout()
                })
                .catch(error => {
                    console.log(error)
                })
        }
    }
    const music = new Audio(backMusic)
    music.pause()
    const handlePlay = () => {
        music.play()
    }
    const handlePause = () => {
        music.pause();
        music.currentTime = 0;
    }
    useEffect(() => {
        GetUserCoins({ token, id: userData._id })
            .then(data => { setCoins(data.coins) })
            .catch(err => { })
    }, [])
    return (
        <Navbar expand="lg" sticky='top' className="trans">
            <div className='container-fluid'>
                <Navbar.Brand href="#home"><img className='logo-header' src="https://clipground.com/images/pokemon-logo-png-5.png" alt="" /></Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav" className='nav-header-home' >
                    <Nav className="" style={{ marginLeft: "auto", marginRight: '0' }}>
                        <div className='d-flex justify-content-end fs-21 mt-2 align-items-center gap-2 ' style={{ marginRight: '8px' }}>
                            <i class="fa-solid fa-volume-high cur-poi" onClick={handlePlay}></i>
                            <i class="fa-solid fa-volume-xmark cur-poi" onClick={handlePause}></i>
                        </div>
                        <span className='fw-bold fs-21 color-blackFake text-center' style={{ lineHeight: '56px', marginLeft: '8px' }}>{userData.name}</span>
                        <NavDropdown className='text-center' title={<img className='avatar-user' src={"https://avatarfiles.alphacoders.com/190/thumb-1920-190017.jpg"} alt="avatar" />} id="basic-nav-dropdown">
                            <NavDropdown.Item href="#action/3.1" className='trans'>Action</NavDropdown.Item>
                            <NavDropdown.Item onClick={handleLogout}>
                                Logout
                            </NavDropdown.Item>
                        </NavDropdown>
                        <div className="d-flex fs-21 justify-content-center align-items-center">
                            <span>{coins}</span>
                            <img src={coin} className='coin-img-rank' alt="" />
                        </div>
                    </Nav>
                </Navbar.Collapse>
            </div>
        </Navbar>
    )
}

export default HeaderH