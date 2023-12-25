import axios from 'axios'

export const genericPostRequest = async (url, data, token = null) => {
  try {
    const headers = {}

    if (token) {
      headers.Authorization = `Bearer ${token}`
    }

    const response = await axios.post(`${process.env.EXPO_PUBLIC_SERVER_URL}${url}`, data, {
      headers
    })
    return response.data
  } catch (error) {
    throw error
  }
}

/*
const apiUrl = 'https://api.example.com/data';
const newData = { name: 'New Item' };
const authToken = 'your-auth-token';

genericPostRequest(apiUrl, newData, authToken)
  .then(data => {
    console.log('Created Data:', data);
  })
  .catch(error => {
    console.error('Error:', error.message);
  });
*/
