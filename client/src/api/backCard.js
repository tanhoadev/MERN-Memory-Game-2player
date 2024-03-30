import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL

export const GetAllBackCard = async ({ token }) => {
    const { data: { data } } = await axios.get(`${BASE_URL}/api/card/get-back-card`, {
        headers: {
            "Content-Type": "Application/json",
            "Authorization": `Bearer ${token}`
        }
    })
    return data
}

export const AddNewBackCard = async ({ src, isUsed, token }) => {
    const { data: { data } } = await axios.post(`${BASE_URL}/api/card/add-back-card`, { src, isUsed }, {
        headers: {
            "Content-Type": "Application/json",
            "Authorization": `Bearer ${token}`
        }
    })
    return data
}

export const UpdateBackCardDetail = async ({ src, isUsed, id, token }) => {
    const { data: { data } } = await axios.put(`${BASE_URL}/api/card/update-back-card/${id}`, { src, isUsed }, {
        headers: {
            "Content-Type": "Application/json",
            "Authorization": `Bearer ${token}`
        }
    })
    return data
}

export const DeleteBackCardFun = async ({ id, token }) => {
    const { data: { data } } = await axios.delete(`${BASE_URL}/api/card/delete-back-card/${id}`, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })
    return data
}