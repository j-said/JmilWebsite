import axiosClient from '../api/axiosClient';

export const authService = {
    async register(user) {
        const { data } = await axiosClient.post('/auth/register', user);
        return data;
    },

    /** OAuth2 password flow expects form data with `username`. */
    async login(email, password) {
        const form = new URLSearchParams({ username: email, password });
        const { data } = await axiosClient.post('/auth/login', form);
        return data.access_token;
    },

    async getMe() {
        const { data } = await axiosClient.get('/users/me');
        return data;
    },

    async updateMe(changes) {
        const { data } = await axiosClient.patch('/users/me', changes);
        return data;
    },
};
