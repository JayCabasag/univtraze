import axios from 'axios'

export const genericDeleteRequest = async (url, token = null) => {
  try {
    const headers = {}

    if (token) {
      headers.Authorization = `Bearer ${token}`
    }

    const response = await axios.delete(`${process.env.EXPO_PUBLIC_SERVER_URL}${url}`, { headers })
    return response.data
  } catch (error) {
    throw error
  }
}

/*
const apiUrl = 'https://api.example.com/data/123';
const authToken = 'your-auth-token';

genericDeleteRequest(apiUrl, authToken)
  .then(data => {
    console.log('Data:', data);
  })
  .catch(error => {
    console.error('Error:', error.message);
  });
  */
