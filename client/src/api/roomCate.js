import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL

export const GetAllRoomCate = async ({ token }) => {
    const { data: { data } } = await axios.get(`${BASE_URL}/api/roomCate`, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })
    return data
}

export const AddNewRoomCate = async ({ token, duration, price }) => {
    const { data: { data } } = await axios.post(`${BASE_URL}/api/roomCate/add`, { duration, price }, {
        headers: {
            "Content-Type": "Application/json",
            "Authorization": `Bearer ${token}`
        }
    })
    return data
}

export const DeleteRoomCategory = async ({ token, id }) => {
    const { data: { data } } = await axios.delete(`${BASE_URL}/api/roomCate/${id}`, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })
    return data
}