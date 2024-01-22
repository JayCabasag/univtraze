import { API } from './api';

export const genericUpdateRequest = async (url, payload) => {
    try {
        const response = await API.put(url, payload);
        return response.data;
    } catch (error) {
        throw error;
    }
};