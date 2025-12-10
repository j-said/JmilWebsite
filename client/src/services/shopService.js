import axiosClient from '../api/axiosClient';

export const shopService = {
    // Get paginated and filtered products
    async getProducts(params) {
        // params structure: { page, limit, category, brand, minPrice, maxPrice, sort, search }
        const response = await axiosClient.get('/products', { params });
        return response.data;
    },

    // Get metadata for filters (available brands, categories, price range)
    async getFiltersInfo() {
        const response = await axiosClient.get('/products/filters');
        return response.data;
    },

    // Get single product details
    async getProductById(id) {
        const response = await axiosClient.get(`/products/${id}`);
        return response.data;
    },

    async createOrder(orderData) {
        const response = await axiosClient.post('/orders', orderData);
        return response.data;
    }
};