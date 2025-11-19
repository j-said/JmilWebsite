import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer className="bg-[var(--background)] text-[var(--foreground)] p-8 mt-16 border-t border-[var(--muted)] theme-transition-colors">
            <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                    <h3 className="text-xl font-bold text-brand-orange mb-4">JmilDrones</h3>
                    <p className="text-[color-mix(in_oklab,var(--foreground)_60%,transparent)]">Innovating the future of autonomous flight.</p>
                </div>
                <div>
                    <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                    <ul className="space-y-2">
                        <li><Link to="/about" className="hover:text-brand-yellow transition-colors duration-300">About Us</Link></li>
                        <li><Link to="/shop" className="hover:text-brand-yellow transition-colors duration-300">Shop</Link></li>
                        <li><Link to="/education" className="hover:text-brand-yellow transition-colors duration-300">Education</Link></li>
                    </ul>
                </div>
                <div>
                    <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
                    <div className="flex space-x-4">
                        <a href="#" className="text-[color-mix(in_oklab,var(--foreground)_60%,transparent)] hover:text-brand-yellow transition-colors duration-300">FB</a>
                        <a href="#" className="text-[color-mix(in_oklab,var(--foreground)_60%,transparent)] hover:text-brand-yellow transition-colors duration-300">IG</a>
                        <a href="#" className="text-[color-mix(in_oklab,var(--foreground)_60%,transparent)] hover:text-brand-yellow transition-colors duration-300">X</a>
                    </div>
                </div>
            </div>
            <div className="text-center text-[color-mix(in_oklab,var(--foreground)_40%,transparent)] border-t border-[var(--muted)] pt-4 mt-8">
                © 2025 JmilDrones. All rights reserved.
            </div>
        </footer>
    );
}