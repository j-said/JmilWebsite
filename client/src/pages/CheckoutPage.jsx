import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';

import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import { orderService } from '../services/orderService';
import { getErrorMessage } from '../api/axiosClient';
import { PHONE_REGEXP } from '../constants/validation';

import CheckoutForm from '../components/market/checkout/CheckoutForm';
import OrderSummary from '../components/market/checkout/OrderSummary';
import Alert from '../components/ui/Alert';

const validationSchema = Yup.object({
    firstName: Yup.string().trim().max(50, 'Must be 50 characters or less').required('First name is required'),
    lastName: Yup.string().trim().max(50, 'Must be 50 characters or less').required('Last name is required'),
    phone: Yup.string().matches(PHONE_REGEXP, 'Phone number is not valid').required('Phone number is required'),
    notes: Yup.string().max(1000),
    terms: Yup.boolean().oneOf([true], 'You must accept the terms and conditions'),
});

export default function CheckoutPage() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { items, getCartTotal, clearCart } = useCart();
    // Shown to the user only; the server recalculates the total from current prices.
    const total = getCartTotal();
    const [error, setError] = useState(null);

    const formik = useFormik({
        initialValues: {
            firstName: user.firstName,
            lastName: user.lastName,
            phone: user.phone ?? '',
            notes: '',
            terms: false,
        },
        validationSchema,
        onSubmit: async ({ terms, notes, ...contact }) => {
            setError(null);
            try {
                const order = await orderService.createOrder({
                    ...contact,
                    notes: notes || null,
                    items: items.map((item) => ({ productId: item.id, quantity: item.quantity })),
                });
                clearCart();
                navigate('/success', { replace: true, state: { order } });
            } catch (err) {
                setError(getErrorMessage(err, 'Failed to place order. Please try again.'));
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        },
    });

    if (items.length === 0) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center text-[var(--foreground)] theme-transition-colors">
                <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
                <Link to="/shop" className="text-brand-orange hover:underline font-bold">
                    Go back to Shop
                </Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12 animate-fadeIn theme-transition-colors">
            <h1 className="text-3xl font-bold mb-8 text-[var(--foreground)]">Checkout</h1>

            <Alert>{error}</Alert>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <CheckoutForm formik={formik} total={total} email={user.email} />
                </div>

                <div className="lg:col-span-1">
                    <OrderSummary
                        items={items}
                        total={total}
                        onPlaceOrder={formik.handleSubmit}
                        isSubmitting={formik.isSubmitting}
                    />
                </div>
            </div>
        </div>
    );
}
