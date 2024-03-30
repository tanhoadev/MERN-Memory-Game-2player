import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL

export const GetAllUser = async ({ token }) => {
    const { data: { data } } = await axios.get(`${BASE_URL}/api/user`, {
        headers: {
            "Authorization": `Bearer: ${token}`
        }
    })
    return data
}

export const AddNewUser = async ({ name, email, password, role, isActivated, token, coins }) => {
    const { data: { data } } = await axios.post(`${BASE_URL}/api/user/add`, { name, email, password, role, isActivated, coins }, {
        headers: {
            "Content-Type": "Application/json",
            "Authorization": `Bearer ${token}`
        }
    })
    return data
}

export const UpdateUserDetail = async ({ name, email, id, role, isActivated, token, coins }) => {
    const { data: { data } } = await axios.put(`${BASE_URL}/api/user/update/${id}`, { name, email, role, isActivated, coins }, {
        headers: {
            "Content-Type": "Application/json",
            "Authorization": `Bearer ${token}`
        }
    })
    return data
}

export const DeleteUserFun = async ({ id, token }) => {
    const { data: { data } } = await axios.delete(`${BASE_URL}/api/user/${id}`, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })
    return data
}

export const GetRanking = async ({ token, idUser }) => {
    const { data } = await axios.get(`${BASE_URL}/api/user/ranking?idUser=${idUser}`, {
        headers: {
            "Content-Type": "Application/json",
            "Authorization": `Bearer ${token}`
        }
    })
    return data
}

export const GetUserCoins = async ({ token, id }) => {
    const { data } = await axios.get(`${BASE_URL}/api/user/${id}`, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })
    return data
}