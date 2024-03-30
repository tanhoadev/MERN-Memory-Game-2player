import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL

export const GetAllFrontCard = async ({ token }) => {
    const { data: { data } } = await axios.get(`${BASE_URL}/api/card/get-front-card`, {
        headers: {
            "Content-Type": "Application/json",
            "Authorization": `Bearer ${token}`
        }
    })
    return data
}

export const AddNewFrontCard = async ({ isUsed, src, token }) => {
    const { data: { data } } = await axios.post(`${BASE_URL}/api/card/add-front-card`, { src, isUsed }, {
        headers: {
            "Content-Type": "Application/json",
            "Authorization": `Bearer ${token}`
        }
    })
    return data
}

export const updateFrontCard = async ({ token, src, id, isUsed }) => {
    const { data: { data } } = await axios.put(`${BASE_URL}/api/card/update-front-card/${id}`, { src, isUsed }, {
        headers: {
            "Content-Type": "Application/json",
            "Authorization": `Bearer ${token}`
        }
    })
    return data
}

export const DeleteFrontCard = async ({ token, id }) => {
    const { data: { data } } = await axios.delete(`${BASE_URL}/api/card/delete-front-card/${id}`, {
        headers: {
            "Content-Type": "Application/json",
            "Authorization": `Bearer ${token}`
        }
    })
    return data
}