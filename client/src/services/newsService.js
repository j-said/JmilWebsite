import axiosClient from '../api/axiosClient';

export const newsService = {
    async getNews({ page = 1, limit = 6 } = {}) {
        const { data } = await axiosClient.get('/news', { params: { page, limit } });
        return data;
    },

    async getPost(id) {
        const { data } = await axiosClient.get(`/news/${id}`);
        return data;
    },
};
