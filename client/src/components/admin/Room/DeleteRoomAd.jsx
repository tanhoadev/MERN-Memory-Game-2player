import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { message } from 'antd';
import { DeleteRoom, DeleteRoomAdFun } from '../../../api/room';
import { useAuth } from '../../contexts/AuthContext';

function DeleteRoomAd({ setData, id }) {
    const [show, setShow] = useState(false);
    const { token } = useAuth()

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const handleDelete = async () => {
        await DeleteRoomAdFun({ token, id })
            .then(data => {
                setData(data)
                message.success('success')
                handleClose()
            })
            .catch(err => {
                console.log(err)
                if (err.response) {
                    message.error(err.response.data.message)
                }
                else {
                    message.error(err.message)
                }
            })
    }
    return (
        <>
            <Button variant="primary" className='btn btn-warning' onClick={handleShow}>
                <i className="fa-solid fa-trash " />
            </Button>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm</Modal.Title>
                </Modal.Header>
                <Modal.Body className='alert-danger m-2'>Are you sure you want to delete this room</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button variant="primary" className='btn-danger' onClick={handleDelete}>
                        Yes
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default DeleteRoomAd