import React, { useEffect, useState } from 'react'
import Table from 'react-bootstrap/Table';
import AddRoomCate from './AddRoomCate';
import Spinner from 'react-bootstrap/esm/Spinner';
import { useAuth } from '../../contexts/AuthContext';
import { GetAllRoomCate } from '../../../api/roomCate';
import coin from '../../../assets/img/dollar.png'
import Pagination from './Pagination';
import DeleteRoomCate from './DeleteRoomCate';

function MainRoomCate() {
    const [load, setLoad] = useState(true)
    const [data, setData] = useState([])
    const [stateData, setStateData] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const [postsPerPage, setPostsPerPage] = useState(10)
    const { token } = useAuth()
    useEffect(() => {
        setLoad(true)
        GetAllRoomCate({ token })
            .then((data) => {
                setData(data)
                setStateData(true)
                setLoad(false)
            })
            .catch(err => {
                setStateData(false)
                setLoad(false)
            })
    }, [])
    const lastPostIndex = currentPage * postsPerPage
    const firstPostIndex = lastPostIndex - postsPerPage
    const currentPosts = data.slice(firstPostIndex, lastPostIndex)
    return (
        <main>
            <div className="container-fluid px-4">
                <div className="card mb-4">
                    <AddRoomCate setData={setData} />
                    <div className="card-header">
                        <i className="fas fa-table me-1" /> Room Category
                    </div>
                    {
                        load ?
                            <div className='container'>
                                <div className="row justify-content-center">
                                    <Spinner animation="border" role="status">
                                    </Spinner>
                                </div>
                            </div>
                            :
                            stateData ?
                                <>
                                    <Table striped bordered hover>
                                        <thead>
                                            <tr>
                                                <th>id</th>
                                                <th>duration (minutes)</th>
                                                <th>price</th>
                                                <th>action</th>
                                            </tr>
                                        </thead>
                                        <tbody style={{ height: '600px' }}>
                                            {
                                                currentPosts.length > 0 && currentPosts.map((item, index) => (
                                                    <tr>
                                                        <th>{item._id}</th>
                                                        <td>
                                                            {item.duration}
                                                        </td>
                                                        <td>
                                                            {item.price}
                                                            <img className='coin-img-rank' src={coin} alt="" />
                                                        </td>
                                                        <th>
                                                            <td className='d-flex gap-2'>
                                                                {/* <UpdateFrontCardAd
                                                                    currentPage={currentPage}
                                                                    id={item._id}
                                                                    src={item.src}
                                                                    isUsed={item.isUsed}
                                                                    setData={setData}
                                                                /> */}
                                                                <DeleteRoomCate
                                                                    token={token}
                                                                    id={item._id}
                                                                    setData={setData}
                                                                />
                                                            </td>
                                                        </th>
                                                    </tr>
                                                ))
                                            }
                                        </tbody>
                                    </Table>
                                    <div className='' style={{ marginLeft: '15px', marginTop: '-6px' }}>
                                        <Pagination
                                            currentPage={currentPage}
                                            setCurrentPage={setCurrentPage}
                                            totalPosts={data.length}
                                            PostsPerPage={postsPerPage} />
                                    </div>
                                </>
                                : <span className='text-center text-danger'>An error occurred while transferring data.</span>
                    }
                </div>
            </div>
        </main>
    )
}

export default MainRoomCate