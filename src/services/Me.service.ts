import axios from "axios"

export const GetMe = async() =>{
    const data = await axios.get('auth/me')
    return data
}