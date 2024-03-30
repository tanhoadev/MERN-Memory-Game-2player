import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Spinner from 'react-bootstrap/esm/Spinner';
import { useAuth } from '../../contexts/AuthContext';
import { message } from 'antd';
import { updateFrontCard } from '../../../api/frontCard';

function UpdateFrontCardAd({ isUsed, src, setData, currentPage, id }) {
    const [img, setImg] = useState("")
    const [isUsedUp, setIsUsedUp] = useState()
    const { token } = useAuth()
    const [load, setLoad] = useState(false)

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const handleChangeImage = (e) => {
        if (e.target.files[0]) {
            setLoad(true)
            const showImg = document.querySelector(`#img-show${id}`)
            showImg.src = URL.createObjectURL(e.target.files[0])
            const data = new FormData()
            data.append("file", e.target.files[0])
            data.append("upload_preset", process.env.REACT_APP_UPLOAD_PRESET)
            data.append("cloudName", process.env.REACT_APP_CLOUDNAME)
            fetch(process.env.REACT_APP_API_CLOUDINARY, {
                method: "post",
                body: data
            })
                .then((res) => res.json())
                .then((data) => {
                    setImg(data.url.toString())
                    setLoad(false)
                })
                .catch((err) => {
                    console.log(err)
                    setLoad(false)
                })
        }
    }
    const handleUpdateBackCard = async () => {
        if (img) {
            updateFrontCard({ src: img, isUsed: isUsedUp, token, id })
                .then(data => {
                    setData(data)
                    handleClose()
                    message.success('updated success')
                })
                .catch(error => {
                    if (error.response) {
                        message.error(error.response.data.message)
                    }
                    else {
                        message.error(error.message)
                    }
                })
        }
        else {
            message.error('please select image')
        }
    }
    useEffect(() => {
        setIsUsedUp(isUsed)
        setImg(src)
    }, [currentPage])
    return (
        <>
            <Button id={`upadate${id}`} variant="primary" onClick={handleShow}>
                <i class="fa-solid fa-pen"></i>
            </Button>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Update Back Card</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" >
                            <Form.Label> Is Used:</Form.Label>
                            <Form.Group className="mb-3" >
                                <Form.Select aria-label="Default select example" onChange={(e) => setIsUsedUp(e.target.value)} value={isUsedUp}>
                                    <option value={true}>Yes</option>
                                    <option value={false}>No</option>
                                </Form.Select>
                            </Form.Group>
                            <Form.Control.Feedback type='invalid'>
                                Please provide a name.
                            </Form.Control.Feedback>
                        </Form.Group>
                        <div className="mb-3">
                            <label htmlFor="message-text" className="col-form-label">
                                Image:
                            </label>
                            <div className="d-flex justify-content-between flex-wrap">
                                <img id={`img-show${id}`} style={{ minHeight: '100px', maxHeight: '200px', objectFit: 'cover', maxWidth: '400px' }} src={img} alt="s" />
                                <input type="file" onChange={handleChangeImage} required className="form-control file-img" id="" accept='image/*' />
                            </div>
                        </div>


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
                            <Button variant="primary" type='submit' onClick={handleUpdateBackCard}>
                                Update
                            </Button>

                    }
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default UpdateFrontCardAd