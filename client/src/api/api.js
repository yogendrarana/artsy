import axios from 'axios';

// Set the default base URL
let baseURL = import.meta.env.VITE_APP_SERVER_URL;

const api = axios.create({ baseURL });

export default api;
