import React, { useEffect, useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import Table from 'react-bootstrap/Table';
import Spinner from 'react-bootstrap/esm/Spinner';
import AddBackCard from './AddBackCard';
import { GetAllBackCard } from '../../../api/backCard';
import PaginationBackCard from './PaginationBackCard';
import UpdateBackCard from './UpdateBackCard';
import DeleteBackCard from './DeleteBackCard';

function BackCardHomeAd() {
    const [load, setLoad] = useState(true)
    const [data, setData] = useState([])
    const [stateData, setStateData] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const [postsPerPage, setPostsPerPage] = useState(8)
    const { token } = useAuth()
    useEffect(() => {
        setLoad(true)
        GetAllBackCard({ token })
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
                    <AddBackCard setData={setData} />
                    <div className="card-header">
                        <i className="fas fa-table me-1" /> BackCard
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
                                                <th>src</th>
                                                <th>isUsed</th>
                                                <th>action</th>
                                            </tr>
                                        </thead>
                                        <tbody style={{ height: '600px' }}>
                                            {
                                                currentPosts.length > 0 && currentPosts.map((item, index) => (
                                                    <tr>
                                                        <th>{item._id}</th>
                                                        <td>
                                                            <img src={item.src} style={{ maxHeight: '120px', borderRadius: '12px' }} alt={item.ten} />
                                                        </td>
                                                        <td>
                                                            {item.isUsed ?
                                                                <i class="fa-solid fa-circle-check col-gr fz-38"></i>
                                                                :
                                                                <i class="fa-solid fa-circle-xmark col-red fz-38"></i>}
                                                        </td>
                                                        <th>
                                                            <td className='d-flex gap-2'>
                                                                <UpdateBackCard
                                                                    currentPage={currentPage}
                                                                    id={item._id}
                                                                    src={item.src}
                                                                    isUsed={item.isUsed}
                                                                    setData={setData}
                                                                />
                                                                <DeleteBackCard
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
                                        <PaginationBackCard
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

export default BackCardHomeAd