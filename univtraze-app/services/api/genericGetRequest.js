import axios from 'axios'

export const genericGetRequest = async (url, token = null) => {
  try {
    const headers = {}

    if (token) {
      headers.Authorization = `Bearer ${token}`
    }

    const response = await axios.get(`${process.env.EXPO_PUBLIC_SERVER_URL}${url}`, { headers })
    return response.data
  } catch (error) {
    throw error
  }
}

/*
const apiUrl = 'https://api.example.com/data';
const authToken = 'your-auth-token';

genericGetRequest(apiUrl, authToken)
  .then(data => {
    console.log('Data:', data);
  })
  .catch(error => {
    console.error('Error:', error.message);
  });
*/
