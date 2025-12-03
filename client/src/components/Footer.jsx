import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer className="bg-[var(--background)] text-[var(--foreground)] pt-16 pb-8 border-t border-[var(--muted)] theme-transition-colors">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    {/* Brand */}
                    <div className="space-y-4">
                        <h3 className="text-2xl font-bold text-brand-orange">JmilDrones</h3>
                        <p className="text-[color-mix(in_oklab,var(--foreground)_70%,transparent)] leading-relaxed">
                            Innovating the future of autonomous flight with cutting-edge technology and education.
                        </p>
                    </div>

                    {/* Categories */}
                    <div>
                        <h3 className="text-lg font-bold mb-6 border-b border-brand-orange/20 pb-2 inline-block">Shop</h3>
                        <ul className="space-y-3">
                            <li><Link to="/shop?category=Professional" className="hover:text-brand-orange transition-colors">Professional Drones</Link></li>
                            <li><Link to="/shop?category=FPV" className="hover:text-brand-orange transition-colors">FPV Racing</Link></li>
                            <li><Link to="/shop?category=Camera" className="hover:text-brand-orange transition-colors">Camera Drones</Link></li>
                            <li><Link to="/shop?category=Accessories" className="hover:text-brand-orange transition-colors">Accessories</Link></li>
                        </ul>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-bold mb-6 border-b border-brand-orange/20 pb-2 inline-block">Company</h3>
                        <ul className="space-y-3">
                            <li><Link to="/about" className="hover:text-brand-orange transition-colors">About Us</Link></li>
                            <li><Link to="/education" className="hover:text-brand-orange transition-colors">Education Hub</Link></li>
                            <li><Link to="/support" className="hover:text-brand-orange transition-colors">Support</Link></li>
                            <li><Link to="/terms" className="hover:text-brand-orange transition-colors">Terms & Conditions</Link></li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h3 className="text-lg font-bold mb-6 border-b border-brand-orange/20 pb-2 inline-block">Stay Updated</h3>
                        <p className="text-sm mb-4 text-[color-mix(in_oklab,var(--foreground)_70%,transparent)]">
                            Subscribe for latest drone drops and tech news.
                        </p>
                        <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="w-full px-4 py-2 rounded-lg bg-[var(--background)] border border-[var(--muted)] focus:border-brand-orange focus:outline-none"
                            />
                            <button className="w-full bg-brand-orange text-brand-black font-bold py-2 rounded-lg hover:bg-brand-yellow transition-colors">
                                Subscribe
                            </button>
                        </form>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-[var(--muted)] pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="text-sm text-[color-mix(in_oklab,var(--foreground)_50%,transparent)]">
                        © 2025 JmilDrones. All rights reserved.
                    </div>
                    <div className="flex space-x-6">
                        <a href="#" className="text-[color-mix(in_oklab,var(--foreground)_60%,transparent)] hover:text-brand-orange transition-colors">Instagram</a>
                        <a href="#" className="text-[color-mix(in_oklab,var(--foreground)_60%,transparent)] hover:text-brand-orange transition-colors">Twitter / X</a>
                        <a href="#" className="text-[color-mix(in_oklab,var(--foreground)_60%,transparent)] hover:text-brand-orange transition-colors">YouTube</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}