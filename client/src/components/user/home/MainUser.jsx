import React, { useEffect } from 'react'
import { useState } from 'react';
import ButtonOption from './ButtonOption'
import ButtonNewRoom from './ButtonNewRoom'
import io from 'socket.io-client'
import { message } from 'antd';
import Ranking from './Ranking';
import SearchButton from './SearchButton';
import { GetAllRoomCate } from '../../../api/roomCate';
import { useAuth } from '../../contexts/AuthContext';
import { GetRanking, GetUserCoins } from '../../../api/user';


function MainUser() {
    const [dataRoomCates, setDataRoomCates] = useState([])
    const [dataRanking, setDataRanking] = useState([])
    const [userRankNumber, setUserRankNumber] = useState()
    const { token, userData, setCoins } = useAuth()
    useEffect(() => {
        GetUserCoins({ id: userData._id, token })
            .then(data => {
                setCoins(data.coins)
            })
            .catch(err => {

            })
        GetAllRoomCate({ token })
            .then(data => setDataRoomCates(data))
            .catch(error => {
                if (error.response) {
                    message.error(error.response.data.message)
                }
                else {
                    message.error(error.message)
                }
            })
        GetRanking({ token, idUser: userData._id })
            .then(dat => {
                setDataRanking(dat.data)
                setUserRankNumber(dat.userRankNumber)
            })
            .catch(error => {
                if (error.response) {
                    message.error(error.response.data.message)
                }
                else {
                    message.error(error.message)
                }
            })

    }, [])
    return (
        <div className="row p-0 justify-content-center main-home align-items-center">
            <div className="col-md-11 col-sm-11 m-0 trans btn-start align-self-center d-flex flex-column justify-content-center gap-5 align-items-center main-home-center">
                <div className="z-1 position-absolute w-100" style={{ top: 0, left: 0 }}>
                    <SearchButton />
                </div>
                <ButtonNewRoom dataRoomCate={dataRoomCates} title="New room" />
                <Ranking dataRanking={dataRanking} userRankNumber={userRankNumber} />
                <ButtonOption title="Play Now" />
            </div>
        </div>
    )
}

export default MainUser