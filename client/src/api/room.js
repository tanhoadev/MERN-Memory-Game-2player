import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL

export const GetAllRoom = async ({ token }) => {
    const { data: { data } } = await axios.get(`${BASE_URL}/api/room`, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })
    return data
}

export const CheckUserJoinRoom = async (user, token) => {
    const { data: { data } } = await axios.get(`${BASE_URL}/api/room/user/${user._id}`, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })
    return data
}

export const RemovePlayer = async ({ idRoom, idUser, idGuestUser, token }) => {
    await axios.put(`${BASE_URL}/api/room/remove-player/${idRoom}`, { idUser, idGuestUser }, {
        headers: {
            'Content-Type': 'Application/json',
            "Authorization": `Bearer ${token}`
        }
    })
}

export const DeleteRoom = async ({ idRoom, idOwner, token }) => {
    await axios.delete(`${BASE_URL}/api/room/delete/${idRoom}?idUser=${idOwner}`, {
        headers: {
            'Content-Type': 'Application/json',
            'Authorization': `Bearer ${token}`
        }
    })
}

export const StartGameFun = async ({ idRoom, idUser, token }) => {
    const { data } = await axios.put(`${BASE_URL}/api/room/start/${idRoom}`, { idUser }, {
        headers: {
            'Content-Type': 'Application/json',
            "Authorization": `Bearer ${token}`
        }
    })
    return data
}

export const ClickCard = async ({ idRoom, userId, clickedIndex, token }) => {
    const { data } = await axios.put(`${BASE_URL}/api/room/start/update-card/${idRoom}`, { userId, clickedIndex }, {
        headers: {
            "Content-Type": 'Application/json',
            "Authorization": `Bearer ${token}`
        }
    })
    return data
}

export const EnterRoom = async ({ idRoomShow, token, idUser }) => {
    const { data } = await axios.put(`${BASE_URL}/api/room/${idRoomShow}`, { idUser }, {
        headers: {
            "Content-Type": "Application/json",
            "Authorization": `Bearer ${token}`
        }
    })
    return data
}

export const ChangeReady = async ({ idRoom, ready, token }) => {
    const { data: { data } } = await axios.put(`${BASE_URL}/api/room/game/change-ready/${idRoom}`, { ready }, {
        headers: {
            "Content-Type": "Application/json",
            "Authorization": `Bearer ${token}`
        }
    })
    return data
}
export const CreateRoom = async ({ token, idUser, idRoomCate }) => {
    const { data: { newRoom } } = await axios.post(`${BASE_URL}/api/room/create`, { idUser, idRoomCate }, {
        headers: {
            "Content-Type": "Application/json",
            "Authorization": `Bearer ${token}`
        }
    })
    return newRoom
}

export const TimeOutGameAPI = async ({ token, id }) => {
    const { data } = await axios.put(`${BASE_URL}/api/room/game/timeout/${id}`, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })
    return data
}

export const EndGameGoBack = async ({ token, idRoom }) => {
    await axios.put(`${BASE_URL}/api/room/game/backroom/${idRoom}`, {
        headers: {
            "Content-Type": "Application/json",
            "Authorization": `Bearer ${token}`
        }
    })
}

export const PlayGameNow = async ({ token, idUser }) => {
    const { data } = await axios.put(`${BASE_URL}/api/room/play-now/${idUser}`, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })
    return data
}

export const DeleteRoomAdFun = async ({ token, id }) => {
    const { data: { data } } = await axios.delete(`${BASE_URL}/api/room/delete-ad/${id}`, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })
    return data
}