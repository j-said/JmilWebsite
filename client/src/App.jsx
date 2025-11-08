import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

import Header from './components/header/Header';
import Footer from './components/Footer';

import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import MarketPage from './pages/MarketPage';
import EducationPage from './pages/EducationPage';

import { CartProvider } from './context/CartContext';
import CartSidebar from './components/market/cart/CartSidebar';

// Component to conditionally render cart
function CartConditional() {
    const location = useLocation();
    const isMarketPage = location.pathname === '/shop';
    return isMarketPage ? <CartSidebar /> : null;
}

export default function App() {
    return (
        <Router>
            <CartProvider>
                <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] theme-transition">
                    <Header />
                    <main>
                        <Routes>
                            <Route path="/" element={<HomePage />} />
                            <Route path="/shop" element={<MarketPage />} />
                            <Route path="/about" element={<AboutPage />} />
                            <Route path="/education" element={<EducationPage />} />
                        </Routes>
                    </main>
                    <Footer />
                    <CartConditional />
                </div>
            </CartProvider>
        </Router>
    );
}

