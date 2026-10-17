import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';

import { useAuth } from '../hooks/useAuth';
import AuthCard, { submitButtonClass } from '../components/auth/AuthCard';
import FormField from '../components/ui/FormField';
import Alert from '../components/ui/Alert';
import { PHONE_REGEXP } from '../constants/validation';

const validationSchema = Yup.object({
    firstName: Yup.string().trim().max(50).required('First name is required'),
    lastName: Yup.string().trim().max(50).required('Last name is required'),
    email: Yup.string().email('Email is incorrect').required('Email is required'),
    phone: Yup.string().matches(PHONE_REGEXP, 'Phone number is not valid'),
    password: Yup.string().min(8, 'At least 8 characters').required('Password is required'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password')], 'Passwords do not match')
        .required('Please repeat the password'),
});

export default function RegisterPage() {
    const { register, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [error, setError] = useState(null);
    const redirectTo = location.state?.from?.pathname ?? '/profile';

    const formik = useFormik({
        initialValues: { firstName: '', lastName: '', email: '', phone: '', password: '', confirmPassword: '' },
        validationSchema,
        onSubmit: async ({ confirmPassword, phone, ...values }) => {
            setError(null);
            try {
                await register({ ...values, phone: phone || null });
                navigate(redirectTo, { replace: true });
            } catch (message) {
                setError(message);
            }
        },
    });

    if (isAuthenticated) return <Navigate to={redirectTo} replace />;

    return (
        <AuthCard
            title="Create account"
            subtitle="Register to place orders and track them in your profile."
            footer={
                <>
                    Already registered?{' '}
                    <Link to="/login" state={location.state} className="text-brand-orange font-bold hover:underline">
                        Sign in
                    </Link>
                </>
            }
        >
            <Alert>{error}</Alert>
            <form onSubmit={formik.handleSubmit} className="space-y-5" noValidate>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <FormField formik={formik} name="firstName" label="First name *" autoComplete="given-name" />
                    <FormField formik={formik} name="lastName" label="Last name *" autoComplete="family-name" />
                </div>
                <FormField formik={formik} name="email" label="Email *" type="email" autoComplete="email" />
                <FormField formik={formik} name="phone" label="Phone" type="tel" placeholder="+380..." autoComplete="tel" />
                <FormField formik={formik} name="password" label="Password *" type="password" autoComplete="new-password" />
                <FormField
                    formik={formik}
                    name="confirmPassword"
                    label="Repeat password *"
                    type="password"
                    autoComplete="new-password"
                />
                <button type="submit" disabled={formik.isSubmitting} className={submitButtonClass}>
                    {formik.isSubmitting ? 'Creating account...' : 'Create account'}
                </button>
            </form>
        </AuthCard>
    );
}
