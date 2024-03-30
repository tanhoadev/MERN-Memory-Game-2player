import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { UpdateUserDetail } from '../../../api/user'
import { useAuth } from '../../contexts/AuthContext';
import { message } from 'antd'
import Spinner from 'react-bootstrap/esm/Spinner';

function UpdateUser({ setData, currentPage, id, nameUpdate, emailUpdate, roleUpdate, isActivatedUpdate, coinsUpdate }) {
    const [nameUpd, setNameUpd] = useState('')
    const [emailUpd, setEmailUpd] = useState('')
    const [role, setRole] = useState('')
    const [isActivated, setIsActivated] = useState()
    const [coins, setCoins] = useState()
    const { token } = useAuth()
    const [load, setLoad] = useState(false)

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const handleUpdateUser = async () => {
        if (nameUpd !== '' && emailUpd !== '' !== '' && coins) {
            setLoad(true)
            await UpdateUserDetail({ name: nameUpd, email: emailUpd, id, role, isActivated, coins, token })
                .then((data) => {
                    message.success("update Success user")
                    setData(data)
                    setLoad(false)
                    setShow(false)
                })
                .catch(err => {
                    setLoad(false)
                    if (err.response) {
                        message.error(err.response.data.message)
                    }
                    else {
                        message.error(err.message)
                    }
                })
        }
    }
    useEffect(() => {
        setNameUpd(nameUpdate)
        setEmailUpd(emailUpdate)
        setRole(roleUpdate)
        setIsActivated(isActivatedUpdate)
        setCoins(coinsUpdate)
    }, [currentPage])
    return (
        <>
            <Button id={`upadate${id}`} variant="primary" onClick={handleShow}>
                <i class="fa-solid fa-pen"></i>
            </Button>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Update User</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" >
                            <Form.Label>name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="enter your name"
                                autoFocus
                                value={nameUpd}
                                onChange={(e) => setNameUpd(e.target.value)}
                                required
                                isInvalid={nameUpd === ''}
                            />
                            <Form.Control.Feedback type='invalid'>
                                Please provide a name.
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3" >
                            <Form.Label>email</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="name@example.com"
                                autoFocus
                                value={emailUpd}
                                onChange={(e) => setEmailUpd(e.target.value)}
                                required
                                isInvalid={emailUpd === '' || !/\S+@\S+\.\S+/.test(emailUpd)}
                            />
                            <Form.Control.Feedback type='invalid'>
                                Please provide a email
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3" >
                            <Form.Label>role</Form.Label>
                            <Form.Select aria-label="Default select example" onChange={(e) => setRole(e.target.value)} value={role}>
                                <option value="user">user</option>
                                <option value="admin">admin</option>
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3" >
                            <Form.Label>Coins</Form.Label>
                            <Form.Control
                                type="number"
                                min={1}
                                max={10000}
                                autoFocus
                                value={coins}
                                onChange={(e) => {
                                    if (e.target.value <= 100000) {
                                        setCoins(e.target.value)
                                    }
                                }}
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
                            <Button variant="primary" onClick={handleUpdateUser}>
                                Update
                            </Button>
                    }
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default UpdateUser