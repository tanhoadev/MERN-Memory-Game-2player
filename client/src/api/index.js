import axios from 'axios'

const BASE_URL = process.env.REACT_APP_BASE_URL
export const GetAllRoom = async () => {
    try {
        const { data: { data } } = await axios.get(`${BASE_URL}/api/room`)
        return { data, hihi: 1 }
    } catch (error) {
        console.log('error')
    }
}