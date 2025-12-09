import axios from 'axios';

const axiosClient = axios.create({
    baseURL: 'http://localhost:3001/api',
    headers: {
        'Content-Type': 'application/json',
    },
    // params serial (brand=A&brand=B)
    paramsSerializer: {
        serialize: (params) => {
            const searchParams = new URLSearchParams();
            for (const key in params) {
                const value = params[key];
                if (Array.isArray(value)) {
                    value.forEach(val => searchParams.append(key, val));
                } else if (value !== undefined && value !== null && value !== '') {
                    searchParams.append(key, value);
                }
            }
            return searchParams.toString();
        }
    }
});

axiosClient.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error("API Error:", error.response?.data || error.message);
        return Promise.reject(error);
    }
);

export default axiosClient;