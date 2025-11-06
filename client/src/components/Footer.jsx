import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer className="bg-brand-black text-brand-white p-8 mt-16">
            <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                    <h3 className="text-xl font-bold text-brand-orange mb-4">JmilDrones</h3>
                    <p className="text-gray-400">Innovating the future of autonomous flight.</p>
                </div>
                <div>
                    <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                    <ul className="space-y-2">
                        <li><Link to="/about" className="hover:text-brand-yellow">About Us</Link></li>
                        <li><Link to="/shop" className="hover:text-brand-yellow">Shop</Link></li>
                        <li><Link to="/education" className="hover:text-brand-yellow">Education</Link></li>
                    </ul>
                </div>
                <div>
                    <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
                    <div className="flex space-x-4">
                        {/* Placeholder icons */}
                        <a href="#" className="text-gray-400 hover:text-brand-yellow">FB</a>
                        <a href="#" className="text-gray-400 hover:text-brand-yellow">IG</a>
                        <a href="#" className="text-gray-400 hover:text-brand-yellow">X</a>
                    </div>
                </div>
            </div>
            <div className="text-center text-gray-500 border-t border-gray-700 pt-4 mt-8">
                © 2025 JmilDrones. All rights reserved.
            </div>
        </footer>
    );
}