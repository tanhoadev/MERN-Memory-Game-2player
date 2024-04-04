import React, { useEffect, useRef, useState } from 'react'
import io from 'socket.io-client'
import { useAuth } from '../../contexts/AuthContext'
import { message } from 'antd'
import '../../../assets/css/waitingroom.css'
const socket = io.connect(process.env.REACT_APP_BASE_URL)

function ChatModal({ idRoomShow }) {
    const { userData } = useAuth()
    const listRef = useRef(null)
    const [showChat, setShowChat] = useState(true)
    const [listChat, setListChat] = useState([])
    const [messageChat, setMessageChat] = useState('')
    const [notifi, setNotify] = useState('')
    const [showButtonSend, setShowButtonSend] = useState(false)
    const handleOpenModal = () => {
        setShowChat(true)
    }
    const handleChangeMessage = (e) => {
        setMessageChat(e.target.value)
        if (e.target.value !== '') {
            setShowButtonSend(true)
        }
        else {
            setShowButtonSend(false)
        }
    }
    useEffect(() => {
        if (listRef.current) {
            const scrollHeight = listRef.current.scrollHeight;
            const clientHeight = listRef.current.clientHeight;
            const scrollBottom = scrollHeight - clientHeight;
            // Cuộn xuống cuối cùng của phần tử với sự điều chỉnh cho phần tử cuộn thêm 100 pixel
            listRef.current.scrollTo({
                top: scrollBottom + 100,
                behavior: "smooth"
            });
        }
    }, [listChat]);
    const sendMessage = () => {
        setListChat([...listChat, { player: userData.name, message: messageChat }])
        socket.emit('send_message_room', { playerName: userData.name, listChat: listChat, room: parseInt(idRoomShow), message: messageChat, idSoc: socket.id })
        setMessageChat('')
        setShowButtonSend(false)
    }
    useEffect(() => {
        socket.on("received_message_room", data => {
            setListChat([...data.listChat, { player: data.playerName, message: data.message }])
        })
        socket.on("New_join", (data) => {
            setNotify(`${data.user} has joined the room`)
        })
        socket.on("notify_leave", (data) => {
            setNotify(`${data.user} has left the room`)
        })
    }, [socket])
    useEffect(() => {
        socket.emit('join_room1', { room: parseInt(idRoomShow) })
    }, [idRoomShow])
    return (
        <>
            {
                showChat &&
                <div >
                    <div className="row position-absolute myMOd modal-chat" style={{ bottom: '12px', left: '0' }}>
                        <div className="chat-waiting-room">
                            <div className="chat-window" ref={listRef}>
                                <ul className='message-list' ref={listRef}>
                                    {
                                        listChat.length > 0 && listChat.map(item => (
                                            <li className='' style={{ marginLeft: '6px', color: 'white' }}><span className='fw-bold' style={{ color: 'blue' }}>{item.player}:</span> {item.message}</li>
                                        ))
                                    }
                                </ul>
                            </div>
                            <span className='' style={{ marginLeft: '6px', fontStyle: 'italic', color: 'black' }}>{notifi}</span>
                            <div className="chat-input">
                                <input
                                    type="text"
                                    className="message-input trans"
                                    placeholder="Type your message here"
                                    value={messageChat}
                                    onChange={handleChangeMessage}
                                    maxLength={30}
                                />
                                {showButtonSend ?
                                    <button className="send-button" onClick={sendMessage}>Send</button>
                                    :
                                    <button className="send-button-dis" disabled onClick={sendMessage}>Send</button>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            }
        </>
    )
}

export default ChatModal