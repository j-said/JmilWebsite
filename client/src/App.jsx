import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

import Header from './components/header/Header';
import Footer from './components/Footer';

import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import MarketPage from './pages/MarketPage';
import EducationPage from './pages/EducationPage';
import ProductPage from './pages/ProductPage';

import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import CartSidebar from './components/market/cart/CartSidebar';

function CartConditional() {
    const location = useLocation();
    // Show cart on shop AND product details page
    const showCart = location.pathname === '/shop' || location.pathname.startsWith('/shop/');
    return showCart ? <CartSidebar /> : null;
}

export default function App() {
    return (
        <Router>
            <WishlistProvider>
                <CartProvider>
                    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] theme-transition">
                        <Header />
                        <main>
                            <Routes>
                                <Route path="/" element={<HomePage />} />
                                <Route path="/shop" element={<MarketPage />} />
                                <Route path="/shop/:id" element={<ProductPage />} />
                                <Route path="/about" element={<AboutPage />} />
                                <Route path="/education" element={<EducationPage />} />
                            </Routes>
                        </main>
                        <Footer />
                        <CartConditional />
                    </div>
                </CartProvider>
            </WishlistProvider>
        </Router>
    );
}