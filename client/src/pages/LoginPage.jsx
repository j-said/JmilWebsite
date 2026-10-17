import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';

import { useAuth } from '../hooks/useAuth';
import AuthCard, { submitButtonClass } from '../components/auth/AuthCard';
import FormField from '../components/ui/FormField';
import Alert from '../components/ui/Alert';

const validationSchema = Yup.object({
    email: Yup.string().email('Email is incorrect').required('Email is required'),
    password: Yup.string().required('Password is required'),
});

export default function LoginPage() {
    const { login, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [error, setError] = useState(null);
    const redirectTo = location.state?.from?.pathname ?? '/profile';

    const formik = useFormik({
        initialValues: { email: '', password: '' },
        validationSchema,
        onSubmit: async (values) => {
            setError(null);
            try {
                await login(values);
                navigate(redirectTo, { replace: true });
            } catch (message) {
                setError(message);
            }
        },
    });

    if (isAuthenticated) return <Navigate to={redirectTo} replace />;

    return (
        <AuthCard
            title="Sign in"
            subtitle="Welcome back, pilot."
            footer={
                <>
                    No account yet?{' '}
                    <Link to="/register" state={location.state} className="text-brand-orange font-bold hover:underline">
                        Create one
                    </Link>
                </>
            }
        >
            <Alert>{error}</Alert>
            <form onSubmit={formik.handleSubmit} className="space-y-5" noValidate>
                <FormField formik={formik} name="email" label="Email" type="email" autoComplete="email" />
                <FormField
                    formik={formik}
                    name="password"
                    label="Password"
                    type="password"
                    autoComplete="current-password"
                />
                <button type="submit" disabled={formik.isSubmitting} className={submitButtonClass}>
                    {formik.isSubmitting ? 'Signing in...' : 'Sign in'}
                </button>
            </form>
        </AuthCard>
    );
}
