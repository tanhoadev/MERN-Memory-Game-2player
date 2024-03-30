import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Spinner from 'react-bootstrap/esm/Spinner';
import { message } from 'antd';
import { useAuth } from '../../contexts/AuthContext';
import { AddNewRoomCate, GetAllRoomCate } from '../../../api/roomCate';

function AddRoomCate({ setData }) {
    const [duration, setDuration] = useState()
    const [price, setPrice] = useState()
    const [load, setLoad] = useState(false)
    const { token } = useAuth()

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const handleChangePrice = (e) => {
        if (e.target.value <= 10000) {
            setPrice(e.target.value)
        }
    }
    const handleChangeDuratin = (e) => {
        if (e.target.value < 60) {
            setDuration(e.target.value)
        }
    }
    const handleAdd = async () => {
        if (!duration || !price) {
            message.destroy()
            message.error('Please fill in all required fields')
        }
        else {
            await AddNewRoomCate({ token, duration, price })
                .then(data => {
                    message.success('successful')
                    setData(data)
                    setShow(false)
                    setDuration()
                    setPrice()
                })
                .catch(error => {
                    if (error.response) {
                        message.error(error.response.message.data)
                    }
                    else {
                        message.error(error.message)
                    }
                })
        }
    }
    return (
        <>
            <Button variant="primary" onClick={handleShow}>
                Add
            </Button>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Room Category</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" >
                            <Form.Label> Duration:</Form.Label>
                            <Form.Control
                                type="number"
                                min={1}
                                max={60}
                                autoFocus
                                value={duration}
                                onChange={handleChangeDuratin}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" >
                            <Form.Label> Price:</Form.Label>
                            <Form.Control
                                type="number"
                                min={1}
                                max={10000}
                                autoFocus
                                value={price}
                                onChange={handleChangePrice}
                                required
                            />
                        </Form.Group>


                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Cancel
                    </Button>
                    {
                        load ?
                            <Button variant="primary" disabled>
                                <Spinner animation="border" style={{ height: '20px', width: '20px' }} role="status">
                                </Spinner>
                            </Button>
                            :
                            <Button variant="primary" type='submit' onClick={handleAdd}>
                                Add
                            </Button>

                    }
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default AddRoomCate