import axios from "axios";

interface ClassConstructor {}

export const PostRequest = async (route: string, input?: ClassConstructor) => {
    try {
        const res = await axios.post(route, input);
        return res;
    } catch (error) {
        throw error;
    }
};