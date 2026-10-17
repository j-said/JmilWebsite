import axiosClient from '../api/axiosClient';

export const orderService = {
    /** order: { firstName, lastName, phone, notes, items: [{ productId, quantity }] } */
    async createOrder(order) {
        const { data } = await axiosClient.post('/orders', order);
        return data;
    },

    async getMyOrders(params) {
        const { data } = await axiosClient.get('/orders', { params });
        return data;
    },
};
