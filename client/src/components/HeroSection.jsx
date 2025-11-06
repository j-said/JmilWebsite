import { Link } from 'react-router-dom';

export default function HeroSection() {
    return (
        <section className="bg-brand-black text-brand-white py-20 px-4 text-center">
            <h1 className="text-5xl font-bold mb-4 text-brand-yellow">Welcome to JmilDrones</h1>
            <p className="text-xl mb-8 max-w-2xl mx-auto">Your one-stop destination for e-commerce, education, and insights into the world of drones.</p>
            <Link
                to="/shop"
                className="bg-brand-orange text-brand-black font-bold py-3 px-8 rounded-lg hover:bg-brand-yellow transition-all"
            >
                Shop Now
            </Link>
        </section>
    );
}