import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { clearCart } from '../redux/cartSlice';
import { useCart } from '../hooks/useCart';
import { shopService } from '../services/shopService';

import CheckoutForm from '../components/market/checkout/CheckoutForm';
import OrderSummary from '../components/market/checkout/OrderSummary';
import Loader from '../components/ui/Loader';

export default function CheckoutPage() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { items, getCartTotal } = useCart();
    const total = getCartTotal();

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const phoneRegExp = /^\+?(\d{1,3})?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?$/;

    const validationSchema = Yup.object({
        firstName: Yup.string().max(15, 'Must be 15 characters or less').required('First name is required'),
        lastName: Yup.string().max(20, 'Must be 20 characters or less').required('Last name is required'),
        email: Yup.string().email('Email is incorrect').required('Email is required'),
        phone: Yup.string().matches(phoneRegExp, 'Phone number is not valid').required('Phone number is required'),
        notes: Yup.string(),
        terms: Yup.boolean().oneOf([true], 'You must accept the terms and conditions').required('Terms acceptance is required')
    });

    const formik = useFormik({
        initialValues: {
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            notes: '',
            terms: false,
        },
        validationSchema,
        onSubmit: async (values) => {
            setIsLoading(true);
            setError(null);

            const orderData = {
                customer: values,
                items: items,
                total: total
            };

            try {
                await shopService.createOrder(orderData);

                dispatch(clearCart());
                navigate('/success');
            } catch (err) {
                console.error("Order failed", err);
                setError(err.response?.data?.error || "Failed to place order. Please try again.");
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } finally {
                setIsLoading(false);
            }
        },
    });

    if (isLoading) {
        return <Loader />;
    }

    if (items.length === 0) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center text-[var(--foreground)] theme-transition-colors">
                <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
                <button onClick={() => navigate('/shop')} className="text-brand-orange hover:underline font-bold">
                    Go back to Shop
                </button>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12 animate-fadeIn theme-transition-colors">
            <h1 className="text-3xl font-bold mb-8 text-[var(--foreground)]">Checkout</h1>

            {/* Error Message */}
            {error && (
                <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-xl flex items-center gap-3">
                    <svg className="w-6 h-6 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{error}</span>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Decomposed Components */}
                <div className="lg:col-span-2">
                    <CheckoutForm formik={formik} total={total} />
                </div>

                <div className="lg:col-span-1">
                    <OrderSummary
                        items={items}
                        total={total}
                        onPlaceOrder={formik.handleSubmit}
                        isSubmitting={isLoading}
                    />
                </div>
            </div>
        </div>
    );
}