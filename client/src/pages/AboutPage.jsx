import NewsFeed from '../components/news-section/NewsFeed';

export default function AboutPage() {
    return (
        <div className="min-h-screen theme-transition-colors">
            
            {/* Intro Section */}
            <section className="py-16 px-4">
                <div className="container mx-auto max-w-4xl text-center">
                    <h1 className="text-4xl font-bold text-brand-orange mb-6 theme-transition-colors">
                        About JmilDrones
                    </h1>
                    <div className="prose prose-lg text-[var(--foreground)] mx-auto">
                        <p className="leading-relaxed mb-6">
                            [Text Placeholder: Mission Statement] JmilDrones was founded with a single mission: to make the sky accessible to everyone. We combine engineering excellence with a passion for flight.
                        </p>
                        <p className="leading-relaxed">
                            [Text Placeholder: Company History] From humble beginnings in a garage to a leading provider of autonomous aerial technology...
                        </p>
                    </div>
                </div>
            </section>

            {/* Meet the Team */}
            <section className="py-16 bg-[var(--muted)]/10">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-[var(--foreground)] mb-10 text-center">
                        Meet the Team
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-8 max-w-6xl mx-auto">
                        {[1, 2, 3, 4, 5].map((item) => (
                            <div key={item} className="flex flex-col items-center group">
                                <div className="w-48 h-48 rounded-full bg-[var(--muted)] mb-4 overflow-hidden border-4 border-transparent group-hover:border-brand-orange transition-all duration-300">
                                    <img 
                                        src={`https://placehold.co/400x400/1a1a1a/FFA500?text=Member+${item}`} 
                                        alt="Team Member" 
                                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                                    />
                                </div>
                                <h3 className="text-xl font-bold text-[var(--foreground)]">Name Placeholder</h3>
                                <p className="text-brand-orange text-sm">Role Title</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Social Networks (Link Placeholders) */}
            <section className="py-12 border-y border-[var(--muted)]">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-2xl font-bold text-[var(--foreground)] mb-8">
                        Connect With Us
                    </h2>
                    <div className="flex flex-wrap justify-center gap-6">
                        {['Instagram', 'Twitter / X', 'YouTube', 'LinkedIn', 'Discord'].map((network) => (
                            <a 
                                key={network} 
                                href="#" 
                                className="px-6 py-3 rounded-lg border border-[var(--muted)] text-[var(--foreground)] hover:border-brand-orange hover:text-brand-orange hover:bg-brand-orange/10 transition-all duration-300 font-medium"
                            >
                                {network}
                            </a>
                        ))}
                    </div>
                </div>
            </section>

            {/* Media Section */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                     <h2 className="text-3xl font-bold text-[var(--foreground)] mb-8 text-center">
                        Our Story on Video
                    </h2>
                    <div className="max-w-4xl mx-auto aspect-video bg-black rounded-3xl overflow-hidden shadow-xl relative group">
                        <div className="absolute inset-0 flex items-center justify-center">
                            <button className="w-20 h-20 bg-brand-orange rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                                <div className="w-0 h-0 border-t-[12px] border-t-transparent border-l-[20px] border-l-black border-b-[12px] border-b-transparent ml-1"></div>
                            </button>
                        </div>
                        <img 
                            src="https://placehold.co/1280x720/222222/666666?text=Video+Placeholder" 
                            alt="Video Placeholder" 
                            className="w-full h-full object-cover opacity-50"
                        />
                    </div>
                </div>
            </section>

            {/* News Section */}
            {/* <div className="pt-8">
                <NewsFeed />
            </div> */}
        </div>
    );
}