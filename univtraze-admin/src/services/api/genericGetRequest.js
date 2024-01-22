import { API } from './api';

export const genericGetRequest = async url => {
  try {
    const response = await API.get(url);
    return response.data;
  } catch (error) {
    throw error;
  }
};
