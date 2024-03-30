import React, { useEffect, useState } from 'react'
import Spinner from 'react-bootstrap/esm/Spinner'
import { ToastContainer } from 'react-toastify'
import Table from 'react-bootstrap/Table';
import { GetAllUser } from '../../../api/user';
import { useAuth } from '../../contexts/AuthContext';
import PaginationUser from './PaginationUser';
import AddUser from './AddUser';
import UpdateUser from './UpdateUser';
import DeleteUser from './DeleteUser';

function UserHomeAd() {
    const [load, setLoad] = useState(true)
    const [data, setData] = useState([])
    const [stateData, setStateData] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const [postsPerPage, setPostsPerPage] = useState(8)
    const { token } = useAuth()

    useEffect(() => {
        setLoad(true)
        GetAllUser({ token })
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
            <ToastContainer />
            <div className="container-fluid px-4">
                <div className="card mb-4">
                    <AddUser setData={setData} />
                    <div className="card-header">
                        <i className="fas fa-table me-1" /> Users
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
                                                <th>name</th>
                                                <th>email</th>
                                                <th>role</th>
                                                <th>Coins</th>
                                                <th>action</th>
                                            </tr>
                                        </thead>
                                        <tbody style={{ height: '600px' }}>
                                            {
                                                currentPosts.length > 0 && currentPosts.map((item, index) => (
                                                    <tr>
                                                        <th>{item._id}</th>
                                                        <th>{item.name}</th>
                                                        <th>{item.email}</th>
                                                        <th>{item.role}</th>
                                                        <th>{item.coins}</th>
                                                        <th>
                                                            <td className='d-flex gap-2'>
                                                                <UpdateUser
                                                                    currentPage={currentPage}
                                                                    id={item._id}
                                                                    setData={setData}
                                                                    nameUpdate={item.name}
                                                                    emailUpdate={item.email}
                                                                    roleUpdate={item.role}
                                                                    coinsUpdate={item.coins}
                                                                    isActivatedUpdate={item.isActivated}
                                                                />
                                                                <DeleteUser
                                                                    token={token}
                                                                    name={item.name}
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
                                        <PaginationUser
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

export default UserHomeAd