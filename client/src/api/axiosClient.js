import axios from 'axios';

export const TOKEN_KEY = 'jmil_token';

const axiosClient = axios.create({
    // Relative by default (see the Vite proxy); set VITE_API_URL to call another origin.
    baseURL: import.meta.env.VITE_API_URL ?? '/api/v1',
    // Arrays become repeated keys: brand=A&brand=B. Empty values are dropped.
    paramsSerializer: {
        serialize: (params) => {
            const searchParams = new URLSearchParams();
            for (const [key, value] of Object.entries(params)) {
                if (Array.isArray(value)) {
                    value.forEach((v) => searchParams.append(key, v));
                } else if (value !== undefined && value !== null && value !== '') {
                    searchParams.append(key, value);
                }
            }
            return searchParams.toString();
        },
    },
});

// The store plugs in here, so this module doesn't import the store (no circular import).
let auth = { getToken: () => null, onUnauthorized: () => {} };
export const configureAuth = (handlers) => {
    auth = handlers;
};

axiosClient.interceptors.request.use((config) => {
    const token = auth.getToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

axiosClient.interceptors.response.use(
    (response) => response,
    (error) => {
        // Expired or revoked token: drop the session instead of failing every request.
        if (error.response?.status === 401 && auth.getToken()) {
            auth.onUnauthorized();
        }
        return Promise.reject(error);
    }
);

/** Human-readable message from a FastAPI error response. */
export function getErrorMessage(error, fallback = 'Something went wrong. Please try again.') {
    const detail = error?.response?.data?.detail;
    if (typeof detail === 'string') return detail;
    if (Array.isArray(detail) && detail.length) {
        return detail.map((d) => `${d.loc?.at(-1) ?? 'field'}: ${d.msg}`).join('; ');
    }
    return fallback;
}

export default axiosClient;
