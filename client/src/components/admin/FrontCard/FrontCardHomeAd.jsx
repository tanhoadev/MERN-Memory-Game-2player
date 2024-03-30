import React, { useEffect, useState } from 'react'
import Table from 'react-bootstrap/Table';
import Spinner from 'react-bootstrap/esm/Spinner';
import { useAuth } from '../../contexts/AuthContext';
import AddFrontCardAd from './AddFrontCardAd';
import UpdateFrontCardAd from './UpdateFrontCardAd';
import DeleteFrontCardAd from './DeleteFrontCardAd';
import PaginationFrontCard from './PaginationFrontCard';
import { GetAllFrontCard } from '../../../api/frontCard';

function FrontCardHomeAd() {
    const [load, setLoad] = useState(true)
    const [data, setData] = useState([])
    const [stateData, setStateData] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const [postsPerPage, setPostsPerPage] = useState(4)
    const { token } = useAuth()
    useEffect(() => {
        setLoad(true)
        GetAllFrontCard({ token })
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
                    <AddFrontCardAd setData={setData} />
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
                                                                <UpdateFrontCardAd
                                                                    currentPage={currentPage}
                                                                    id={item._id}
                                                                    src={item.src}
                                                                    isUsed={item.isUsed}
                                                                    setData={setData}
                                                                />
                                                                <DeleteFrontCardAd
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
                                        <PaginationFrontCard
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

export default FrontCardHomeAd