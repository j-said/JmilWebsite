import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

import Header from './components/header/Header';
import Footer from './components/Footer';
import ScrollToTop from './components/ui/ScrollToTop';
import Loader from './components/ui/Loader';

import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import MarketPage from './pages/MarketPage';
import EducationPage from './pages/EducationPage';
import ProductPage from './pages/ProductPage';
import CheckoutPage from './pages/CheckoutPage';
import SuccessPage from './pages/SuccessPage';

import CartSidebar from './components/market/cart/CartSidebar';

function CartConditional() {
    const location = useLocation();
    // Show cart on shop AND product details page
    const showCart = location.pathname === '/shop' || location.pathname.startsWith('/shop/');
    return showCart ? <CartSidebar /> : null;
}

export default function App() {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 1000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <>
            {/* Show Loader if loading */}
            {isLoading && <Loader />}
            <div>
                <Router>
                    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] theme-transition-colors relative">
                        <Header />
                        <main>
                            <Routes>
                                <Route path="/" element={<HomePage />} />
                                <Route path="/shop" element={<MarketPage />} />
                                <Route path="/shop/:id" element={<ProductPage />} />
                                <Route path="/about" element={<AboutPage />} />
                                <Route path="/education" element={<EducationPage />} />
                                <Route path="/checkout" element={<CheckoutPage />} />
                                <Route path="/success" element={<SuccessPage />} />
                            </Routes>
                        </main>
                        <Footer />
                        <CartConditional />
                        <ScrollToTop />
                    </div>
                </Router>
            </div>
        </>
    );
}