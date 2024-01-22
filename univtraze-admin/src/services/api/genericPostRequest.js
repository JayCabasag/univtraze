import { API } from './api';

export const genericPostRequest = async (url, payload) => {
  try {
    const response = await API.post(url, payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};
