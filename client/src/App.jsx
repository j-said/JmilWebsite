import { Routes, Route} from 'react-router-dom';

// Pages Imports
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import MarketPage from './pages/MarketPage';
import EducationPage from './pages/EducationPage';

// Layout components Imports
import Header from './components/header/Header';
import Footer from './components/Footer';

export default function App() {
    return (
        <div className="min-h-screen antialiased overflow-hidden">
            <Header />
            <main className="p-4 md:p-8 overflow-hidden">
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/shop" element={<MarketPage />} />
                    <Route path="/education" element={<EducationPage />} />
                </Routes>
            </main>
            <Footer />
        </div>
    );
}