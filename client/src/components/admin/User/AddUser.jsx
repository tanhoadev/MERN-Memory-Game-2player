import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { AddNewUser } from '../../../api/user'
import { useAuth } from '../../contexts/AuthContext';
import { message } from 'antd'
import Spinner from 'react-bootstrap/esm/Spinner';

function AddUser({ setData }) {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassWord] = useState('')
    const [role, setRole] = useState('user')
    const [coins, setCoins] = useState()
    const [isActivated, setIsActivated] = useState(false)
    const [load, setLoad] = useState(false)
    const { token } = useAuth()

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const handleAddUser = async () => {
        if (name !== '' && email !== '' && password !== '' && coins) {
            setLoad(true)
            await AddNewUser({ name, email, password, role, isActivated, coins, token })
                .then((data) => {
                    message.success("add Success new user")
                    setData(data)
                    setLoad(false)
                    setShow(false)
                })
                .catch(err => {
                    if (err.response) {
                        message.error(err.response.data.message)
                    }
                    else {
                        message.error(err.message)
                        setLoad(false)
                    }
                    setLoad(false)
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
                    <Modal.Title>Add User</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" >
                            <Form.Label>name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="enter your name"
                                autoFocus
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                isInvalid={name === ''}
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
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                isInvalid={email === '' || !/\S+@\S+\.\S+/.test(email)}
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
                            <Form.Label>PassWord</Form.Label>
                            <Form.Control
                                type="PassWord"
                                placeholder="enter your password"
                                autoFocus
                                value={password}
                                onChange={(e) => setPassWord(e.target.value)}
                                required
                                isInvalid={password === ''}
                            />
                            <Form.Control.Feedback type='invalid'>
                                Please Provide password
                            </Form.Control.Feedback>
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
                                required
                                isInvalid={password === ''}
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
                            <Button variant="primary" onClick={handleAddUser}>
                                Add
                            </Button>

                    }
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default AddUser