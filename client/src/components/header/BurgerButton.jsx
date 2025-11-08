export default function BurgerButton({ isOpen, toggleMenu }) {
    return (
        <button
            onClick={toggleMenu}
            className="md:hidden text-brand-orange p-2"
            aria-label="Toggle menu"
        >
            <div className="w-6 h-6 flex flex-col justify-center space-y-1">
                <span className={`block h-0.5 w-6 bg-current transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
                <span className={`block h-0.5 w-6 bg-current transition-all duration-300 ${isOpen ? 'opacity-0' : 'opacity-100'}`} />
                <span className={`block h-0.5 w-6 bg-current transition-all duration-300 ${isOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
            </div>
        </button>
    );
}