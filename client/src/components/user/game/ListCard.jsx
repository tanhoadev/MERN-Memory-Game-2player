import React, { useEffect, useState } from 'react'
import Cardchild from './Cardchild'
import io from 'socket.io-client'

const socket = io.connect(process.env.REACT_APP_BASE_URL)

function ListCard({ frontCard, backCard, yourTurn, setYourTurn, setStateCards, stateCards, idRoom, setPairsUser1, setPairsUser2, idRoomShowStart }) {
    const [dataCards, setDataCards] = useState([[]])
    useEffect(() => {
        let datatmp = [];
        let dataFull = [];
        console.log(stateCards)
        for (let x = 0; x < frontCard.length; x++) {
            datatmp.push(frontCard[x]);

            if ((x + 1) % 4 === 0 || x === frontCard.length - 1) {
                dataFull.push([...datatmp]);
                datatmp = [];
            }
        }

        setDataCards(dataFull)
    }, [frontCard, socket])
    return (
        <div className="container-fluid mt-4 d-flex justify-content-center">
            <div className="row d-flex wrap-card" style={{
                gap: '12px 0'
            }}>
                {
                    dataCards.length > 0 && dataCards.map((item, index1) => (
                        <div className="gap-3 d-flex justify-content-center flex-row">
                            {item.map((itemChild, index2) => (
                                <Cardchild srcfront={itemChild.src} setPairsUser1={setPairsUser1} setPairsUser2={setPairsUser2} setYourTurn={setYourTurn} setStateCards={setStateCards} yourTurn={yourTurn} idRoomShowStart={idRoomShowStart} idRoom={idRoom} stateCard={stateCards[(4 * index1) + index2]} index={(4 * index1) + index2} backCard={backCard.src} />
                            ))}
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default ListCard