import { useState } from "react";

export default function ProductTabs({ product }) {
  const [activeTab, setActiveTab] = useState("about");

  // FAQ Accordion Item Component
  const FAQItem = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div className="border border-[--muted] rounded-xl overflow-hidden bg-[--background] theme-transition-colors">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-6 py-4 flex justify-between items-center text-left font-bold text-[--foreground] hover:bg-[--muted]/10 transition-colors"
        >
          <span>{question}</span>
          <span
            className={`transform transition-transform duration-300 text-brand-orange ${
              isOpen ? "rotate-180" : ""
            }`}
          >
            ▼
          </span>
        </button>
        <div
          className={`grid transition-all duration-300 ease-in-out ${
            isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="overflow-hidden">
            <div className="px-6 pb-4 text-[color-mix(in_oklab,var(--foreground)_80%,transparent)] leading-relaxed">
              {answer}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case "specs":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fadeIn">
            {product.features.map((feature, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-4 bg-[--muted]/20 rounded-xl border border-[--muted]/50"
              >
                <span className="font-medium text-[--foreground]">
                  {feature}
                </span>
                <span className="text-brand-orange font-bold">✓</span>
              </div>
            ))}
            <div className="flex items-center justify-between p-4 bg-[--muted]/20 rounded-xl border border-[--muted]/50">
              <span className="font-medium text-[--foreground]">Brand</span>
              <span className="text-[--foreground]">{product.brand}</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-[--muted]/20 rounded-xl border border-[--muted]/50">
              <span className="font-medium text-[--foreground]">SKU</span>
              <span className="text-[--foreground]">
                JD-{product.id}00{product.id}
              </span>
            </div>
          </div>
        );
      case "reviews":
        return (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex items-center space-x-6 p-6 bg-[--muted]/10 rounded-2xl border border-[--muted]">
              <div className="text-center">
                <div className="text-5xl font-bold text-brand-orange mb-1">
                  {product.rating}
                </div>
                <div className="text-yellow-400 text-lg">★★★★★</div>
              </div>
              <div className="h-12 w-px bg-[--muted]"></div>
              <div>
                <h4 className="font-bold text-lg text-[--foreground]">
                  Customer Rating
                </h4>
                <p className="text-sm opacity-70 text-[--foreground]">
                  Based on {product.reviewCount} verified reviews
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {[1, 2].map((r) => (
                <div
                  key={r}
                  className="p-4 border-b border-[--muted] theme-transition-colors"
                >
                  <div className="flex justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-[--muted] rounded-full flex items-center justify-center font-bold text-xs text-[--foreground]">
                        U{r}
                      </div>
                      <span className="font-bold text-[--foreground]">
                        Verified User
                      </span>
                    </div>
                    <span className="text-xs text-[color-mix(in_oklab,--foreground_50%,transparent)]">
                      2 days ago
                    </span>
                  </div>
                  <div className="text-yellow-400 text-sm mb-2">★★★★★</div>
                  <p className="text-sm text-[color-mix(in_oklab,--foreground_80%,transparent)]">
                    Excellent drone, handles wind very well. Battery life is
                    exactly as advertised. Highly recommended!
                  </p>
                </div>
              ))}
            </div>
          </div>
        );
      case "faq":
        return (
          <div className="space-y-4 animate-fadeIn">
            <FAQItem
              question="Does this product come with a warranty?"
              answer="Yes, all our drones come with a comprehensive 1-year manufacturer warranty covering defects in materials and workmanship."
            />
            <FAQItem
              question="What is the return policy?"
              answer="We offer a 30-day return policy for all unused items in their original packaging. Please contact support to initiate a return."
            />
            <FAQItem
              question="Is shipping free?"
              answer="Yes, we offer free standard shipping on all orders over $500 within the continental US."
            />
            <FAQItem
              question="Do I need a license to fly this drone?"
              answer="For drones under 250g, registration might not be required for recreational use, but please check your local FAA regulations."
            />
          </div>
        );
      default: // 'about'
        return (
          <div className="prose prose-lg max-w-none text-[--foreground] animate-fadeIn">
            <p className="leading-relaxed">
              Unlock your creative potential with the {product.name}. Engineered
              for precision and performance, this drone offers unparalleled
              stability and image quality.
            </p>
            <p className="leading-relaxed mt-4">
              Whether you are a professional filmmaker or an aerial photography
              enthusiast, the advanced features of the {product.name} will help
              you capture the world from a new perspective.
            </p>
            <ul className="list-disc pl-5 mt-4 space-y-2">
              <li>Advanced stabilization system</li>
              <li>High-resolution imaging sensor</li>
              <li>Intelligent flight modes</li>
            </ul>
          </div>
        );
    }
  };

  return (
    <div className="theme-transition-colors">
      <div className="flex border-b border-[--muted] mb-8 overflow-x-auto scrollbar-hide">
        {["about", "specs", "reviews", "faq"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`
                            px-8 py-4 font-bold text-lg transition-all duration-300 whitespace-nowrap border-b-2 relative
                            ${
                              activeTab === tab
                                ? "text-brand-orange border-brand-orange bg-brand-orange/5"
                                : "text-[--foreground] border-transparent hover:text-brand-orange/70 hover:bg-[--muted]/10"
                            }
                        `}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>
      <div className="min-h-[200px]">{renderContent()}</div>
    </div>
  );
}
