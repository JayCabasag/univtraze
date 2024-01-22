import { API } from './api';

export const genericDeleteRequest = async url => {
  try {
    const response = await API.delete(url);
    return response.data;
  } catch (error) {
    throw error;
  }
};
