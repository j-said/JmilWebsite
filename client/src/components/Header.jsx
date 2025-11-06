import { Link } from 'react-router-dom';


export default function Header() {
    return (
        <header className="bg-brand-black text-brand-white p-4 sticky top-0 z-50">
            <nav className="container mx-auto flex justify-between items-center">
                <div className="text-2xl font-bold text-brand-orange">JmilDrones</div>
                <div className="space-x-6 hidden md:block">
                    <Link to="/" className="hover:text-brand-yellow transition-colors">Home</Link>
                    <Link to="/shop" className="hover:text-brand-yellow transition-colors">Shop</Link>
                    <Link to="/education" className="hover:text-brand-yellow transition-colors">Education</Link>
                    <Link to="/about" className="hover:text-brand-yellow transition-colors">About</Link>
                </div>
                <button className="md:hidden text-brand-orange">
                    {/* Mobile menu icon */}
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                    </svg>
                </button>
            </nav>
        </header>
    );
}