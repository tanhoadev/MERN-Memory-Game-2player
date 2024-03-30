import React, { useEffect, useState } from 'react';
import coin from '../../../assets/img/dollar.png'
import Table from 'react-bootstrap/Table';
import '../../../assets/css/tableRanking.css'
import { GetRanking } from '../../../api/user';

function Ranking({ dataRanking, userRankNumber }) {
    const [showModal, setShowModal] = useState(false)
    useEffect(() => {

    }, [])
    return (
        <>
            {showModal &&
                <div className="position-absolute w-100 h-100 z-1 overflow-hidden" style={{ background: '#EEE4B1' }}>
                    <div className="row">
                        <div className="col text-end">
                            <i class="fa-solid fa-xmark fz-38" onClick={() => setShowModal(false)} style={{ padding: '8px 18px', color: '#FF004D' }}></i>
                        </div>
                    </div>
                    <div className="row ranking-list justify-content-center p-0" style={{ padding: '0 !important' }}>
                        <Table bordered hover style={{ width: '80%', background: 'red !important' }}>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>player</th>
                                    <th>Coin</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dataRanking.length > 0 &&
                                    dataRanking.map((item, index) => (
                                        <tr className='background-item-ranking'>
                                            <td>{index + 1}</td>
                                            <td>{item.name}</td>
                                            <td className='d-flex align-items-center'><span className='text-table-ranking'>{item.coins}</span><img src={coin} className='coin-img-rank' alt="" /></td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </Table>
                    </div>
                    <div className="row  my-ranking mt-2 justify-content-center p-0">
                        <Table bordered hover style={{ width: '80%' }}>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>player</th>
                                    <th>Coin</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className='background-item-ranking' style={{}}>
                                    {dataRanking.length > 0 &&
                                        <>
                                            <td className='text-color-my-ranking fw-bold'>{userRankNumber + 1}</td>
                                            <td className='text-color-my-ranking fw-bold'>{dataRanking[userRankNumber].name}</td>
                                            <td className='d-flex align-items-center text-color-my-ranking'><span style={{ fontSize: '20px', marginRight: '4px' }}>{dataRanking[userRankNumber].coins}</span><img src={coin} className='coin-img-rank' alt="" /></td>
                                        </>
                                    }
                                </tr>

                            </tbody>
                        </Table>
                    </div>

                </div>
            }
            <button className='p-0 button-option-main' onClick={() => { setShowModal(true) }} >
                <i class="fa-solid fa-ranking-star"></i> Ranking
            </button>
        </>
    )
}

export default Ranking