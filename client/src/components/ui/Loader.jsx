import Logo from './Logo';

export default function Loader() {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm transition-all duration-300">
            <div className="flex flex-col items-center">
                <div className="animate-bounce-gentle">
                    <div className="relative">
                        {/* Дрон з новими лопатями */}
                        <Logo
                            className="w-24 h-24 text-(--foreground)"
                            isSpinning={true}
                        />
                        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-16 h-1 bg-black/20 rounded-full blur-sm animate-pulse"></div>
                    </div>
                </div>

                <div className="mt-8 flex items-center space-x-3 bg-[var(--background)] px-6 py-2 rounded-full border border-(--foreground)/30 shadow-xl">
                    <div className="flex space-x-1">
                        <span className="w-2 h-2 bg-(--foreground) rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                        <span className="w-2 h-2 bg-(--foreground) rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                        <span className="w-2 h-2 bg-(--foreground) rounded-full animate-bounce"></span>
                    </div>
                    <span className="text-(--foreground) font-bold text-sm tracking-wider uppercase">
                        Loading
                    </span>
                </div>
            </div>
        </div>
    );
}