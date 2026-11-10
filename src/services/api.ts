import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 1000000,
  paramsSerializer: {
    indexes: null 
  }
});


api.interceptors.response.use(
  (response) => {
    console.log('response',response)
    return response.data; 
  },
  (error) => Promise.reject(error)
);

export default api;