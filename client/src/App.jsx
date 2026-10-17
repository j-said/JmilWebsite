import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

import Header from './components/header/Header';
import Footer from './components/Footer';
import ScrollToTop from './components/ui/ScrollToTop';
import ProtectedRoute from './components/auth/ProtectedRoute';
import CartSidebar from './components/market/cart/CartSidebar';
import { fetchMe } from './redux/authSlice';

import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import MarketPage from './pages/MarketPage';
import EducationPage from './pages/EducationPage';
import ProductPage from './pages/ProductPage';
import CheckoutPage from './pages/CheckoutPage';
import SuccessPage from './pages/SuccessPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import NewsPostPage from './pages/NewsPostPage';
import NotFoundPage from './pages/NotFoundPage';

function CartConditional() {
    const location = useLocation();
    // Show cart on shop AND product details page
    const showCart = location.pathname === '/shop' || location.pathname.startsWith('/shop/');
    return showCart ? <CartSidebar /> : null;
}

/** Restores the session from a stored token on startup. */
function useSessionRestore() {
    const dispatch = useDispatch();
    const status = useSelector((state) => state.auth.status);
    useEffect(() => {
        if (status === 'idle') dispatch(fetchMe());
    }, [status, dispatch]);
}

export default function App() {
    useSessionRestore();

    return (
        <Router>
            <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] theme-transition-colors relative">
                <Header />
                <main>
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/shop" element={<MarketPage />} />
                        <Route path="/shop/:id" element={<ProductPage />} />
                        <Route path="/news/:id" element={<NewsPostPage />} />
                        <Route path="/about" element={<AboutPage />} />
                        <Route path="/education" element={<EducationPage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />
                        <Route element={<ProtectedRoute />}>
                            <Route path="/checkout" element={<CheckoutPage />} />
                            <Route path="/success" element={<SuccessPage />} />
                            <Route path="/profile" element={<ProfilePage />} />
                        </Route>
                        <Route path="*" element={<NotFoundPage />} />
                    </Routes>
                </main>
                <Footer />
                <CartConditional />
                <ScrollToTop />
            </div>
        </Router>
    );
}
