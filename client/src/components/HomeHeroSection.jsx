import { Link } from 'react-router-dom';

export default function HeroSection() {
    return (
        <section className="text-[var(--foreground)] py-24 px-4 text-center theme-transition">
            <div className="container mx-auto max-w-4xl">
                <h1 className="text-4xl md:text-6xl font-bold mb-6 text-brand-orange dark:text-brand-yellow theme-transition">
                    Welcome to JmilDrones
                </h1>
                <p className="text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed text-[color-mix(in_oklab,var(--foreground)_80%,transparent) theme-transition]">
                    Your one-stop destination for e-commerce, education, and insights into the world of drones.
                    Explore cutting-edge technology and join the future of autonomous flight.
                </p>
                <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                    <Link
                        to="/shop"
                        className="bg-brand-orange text-brand-black font-bold py-4 px-8 rounded-xl hover:bg-brand-yellow transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-center"
                    >
                        Shop Now
                    </Link>
                    <Link
                        to="/education"
                        className="border-2 border-brand-orange text-brand-orange font-bold py-4 px-8 rounded-xl hover:bg-brand-orange hover:text-brand-black transition-all duration-300 transform hover:scale-105 text-center"
                    >
                        Learn More
                    </Link>
                </div>
            </div>
        </section>
    );
}