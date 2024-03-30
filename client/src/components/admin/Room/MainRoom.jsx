import React, { useEffect, useState } from 'react'
import PaginationRooom from './PaginationRooom'
import { DeleteRoom, GetAllRoom } from '../../../api/room'
import Table from 'react-bootstrap/Table';
import Spinner from 'react-bootstrap/esm/Spinner';
import { useAuth } from '../../contexts/AuthContext';
import DeleteRoomAd from './DeleteRoomAd';

function MainRoom() {
    const [load, setLoad] = useState(true)
    const [data, setData] = useState([])
    const [stateData, setStateData] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const [postsPerPage, setPostsPerPage] = useState(8)
    const { token } = useAuth()
    useEffect(() => {
        setLoad(true)
        GetAllRoom({ token })
            .then(data => {
                console.log(data)
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
                    <div className="card-header">
                        <i className="fas fa-table me-1" /> Rooms
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
                                                <th>occupancy</th>
                                                <th>duration (minutes)</th>
                                                <th>price</th>
                                                <th>participants</th>
                                                <th>status</th>
                                                <th>actions</th>
                                            </tr>
                                        </thead>
                                        <tbody style={{ height: '600px' }}>
                                            {
                                                currentPosts.length > 0 && currentPosts.map((item, index) => (
                                                    <tr>
                                                        <th>{item._id}</th>
                                                        <td>
                                                            {item.occupancy}
                                                        </td>
                                                        <td>
                                                            {item.category.duration}
                                                        </td>
                                                        <th>{item.category.price}</th>
                                                        <th>{item.participants.length} / {item.occupancy}</th>
                                                        <th>{item.status}</th>
                                                        <th>
                                                            <td className='d-flex gap-2'>
                                                                <DeleteRoomAd
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
                                        <PaginationRooom
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

export default MainRoom