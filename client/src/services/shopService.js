import axiosClient from '../api/axiosClient';

export const shopService = {
    /** params: { page, limit, sort, search, category[], brand[], feature[], minPrice, maxPrice } */
    async getProducts(params, { signal } = {}) {
        const { data } = await axiosClient.get('/products', { params, signal });
        return data;
    },

    async getFacets() {
        const { data } = await axiosClient.get('/products/facets');
        return data;
    },

    async getProductById(id, { signal } = {}) {
        const { data } = await axiosClient.get(`/products/${id}`, { signal });
        return data;
    },
};
