export const mockProducts = [
    // Professional Drones
    {
        id: 1,
        name: "DJI Mavic 3 Pro",
        description: "Professional drone with Hasselblad camera and 4/3 CMOS sensor. Perfect for aerial photography and videography.",
        price: 2199,
        originalPrice: 2499,
        onSale: true,
        rating: 4.8,
        reviewCount: 342,
        category: "Professional Drones",
        brand: "DJI",
        features: ["4K Camera", "GPS", "Obstacle Avoidance", "Follow Me Mode", "Auto Return Home", "Long Battery Life"],
        inStock: true,
        imageUrl: "https://placehold.co/600x400/1a1a1a/FFA500?text=Mavic+3+Pro+Main",
        images: [
            "https://placehold.co/600x400/1a1a1a/FFA500?text=Mavic+3+Pro+Front",
            "https://placehold.co/600x400/1a1a1a/FFA500?text=Mavic+3+Pro+Side",
            "https://placehold.co/600x400/1a1a1a/FFA500?text=Mavic+3+Pro+Top",
            "https://placehold.co/600x400/1a1a1a/FFA500?text=Mavic+3+Pro+Camera"
        ]
    },
    {
        id: 2,
        name: "Autel Robotics Evo Lite+",
        description: "Premium drone with 6K camera and night vision capabilities. Ideal for professional filmmakers.",
        price: 1799,
        rating: 4.6,
        reviewCount: 128,
        category: "Professional Drones",
        brand: "Autel Robotics",
        features: ["6K Camera", "GPS", "Obstacle Avoidance", "Night Vision", "Auto Return Home"],
        inStock: true,
        imageUrl: "https://placehold.co/600x400/1a1a1a/FFA500?text=Autel+Evo+Lite+",
        images: [
             "https://placehold.co/600x400/1a1a1a/FFA500?text=Autel+Front",
             "https://placehold.co/600x400/1a1a1a/FFA500?text=Autel+Back"
        ]
    },
    // ... (інші товари можна залишити без images, код це обробить)
    {
        id: 3,
        name: "DJI Inspire 3",
        description: "Cinematic drone with dual operator support and 8K video recording. For professional film production.",
        price: 12499,
        rating: 4.9,
        reviewCount: 56,
        category: "Professional Drones",
        brand: "DJI",
        features: ["8K Camera", "Dual Operator", "GPS", "Obstacle Avoidance", "Cinematic Mode"],
        inStock: true,
        imageUrl: "https://placehold.co/600x400/1a1a1a/FFA500?text=DJI+Inspire+3"
    },
    // ... решта товарів з попереднього файлу
    {
        id: 4,
        name: "iFlight Nazgul Evoque F5",
        description: "High-performance FPV racing drone with digital HD system. Built for speed and agility.",
        price: 399,
        originalPrice: 499,
        onSale: true,
        rating: 4.5,
        reviewCount: 89,
        category: "FPV Racing Drones",
        brand: "iFlight",
        features: ["First Person View", "High Speed", "Acro Mode", "Digital HD", "Racing Kit"],
        inStock: true,
        imageUrl: "https://placehold.co/400x300/1a1a1a/FFA500?text=Nazgul+Evoque+F5"
    },
    {
        id: 5,
        name: "BetaFPV Cetus Pro Kit",
        description: "Complete FPV starter kit for beginners. Includes drone, goggles, and controller.",
        price: 299,
        rating: 4.3,
        reviewCount: 156,
        category: "FPV Racing Drones",
        brand: "BetaFPV",
        features: ["Beginner Friendly", "Complete Kit", "First Person View", "Protection Frame"],
        inStock: true,
        imageUrl: "https://placehold.co/400x300/1a1a1a/FFA500?text=Cetus+Pro+Kit"
    },
    {
        id: 6,
        name: "GEPRC Mark5 HD",
        description: "Competition-grade FPV drone with digital HD video transmission and long range.",
        price: 649,
        rating: 4.7,
        reviewCount: 67,
        category: "FPV Racing Drones",
        brand: "GEPRC",
        features: ["Digital HD", "Long Range", "Competition Grade", "High Performance"],
        inStock: false,
        imageUrl: "https://placehold.co/400x300/1a1a1a/FFA500?text=GEPRC+Mark5+HD"
    },
    {
        id: 7,
        name: "DJI Mini 4 Pro",
        description: "Ultra-light camera drone with 4K HDR video and advanced obstacle sensing.",
        price: 759,
        originalPrice: 899,
        onSale: true,
        rating: 4.8,
        reviewCount: 423,
        category: "Camera Drones",
        brand: "DJI",
        features: ["4K HDR", "Obstacle Avoidance", "Foldable Design", "Under 250g", "Follow Me Mode"],
        inStock: true,
        imageUrl: "https://placehold.co/400x300/1a1a1a/FFA500?text=DJI+Mini+4+Pro"
    },
    {
        id: 8,
        name: "Autel Robotics Evo Nano+",
        description: "Compact drone with 48MP camera and three-way obstacle avoidance system.",
        price: 899,
        rating: 4.4,
        reviewCount: 94,
        category: "Camera Drones",
        brand: "Autel Robotics",
        features: ["48MP Camera", "Three-way Obstacle Avoidance", "Compact Design", "GPS"],
        inStock: true,
        imageUrl: "https://placehold.co/400x300/1a1a1a/FFA500?text=Evo+Nano+Plus"
    },
    {
        id: 9,
        name: "Holy Stone HS720G",
        description: "4K GPS drone with brushless motors and 2-axis gimbal for stable footage.",
        price: 329,
        rating: 4.2,
        reviewCount: 287,
        category: "Camera Drones",
        brand: "Holy Stone",
        features: ["4K Camera", "GPS", "Brushless Motors", "2-Axis Gimbal", "Auto Return"],
        inStock: true,
        imageUrl: "https://placehold.co/400x300/1a1a1a/FFA500?text=HS720G+4K+GPS"
    },
    {
        id: 10,
        name: "DJI Tello",
        description: "Educational drone perfect for beginners. Programmable with Scratch.",
        price: 99,
        rating: 4.1,
        reviewCount: 512,
        category: "Beginner Drones",
        brand: "DJI",
        features: ["Beginner Friendly", "Programmable", "Stable Flight", "720p Camera"],
        inStock: true,
        imageUrl: "https://placehold.co/400x300/1a1a1a/FFA500?text=DJI+Tello"
    },
    {
        id: 11,
        name: "Ryze Tech Tello Boost Combo",
        description: "Complete starter kit with extra batteries and propeller guards.",
        price: 149,
        rating: 4.3,
        reviewCount: 198,
        category: "Beginner Drones",
        brand: "Ryze Tech",
        features: ["Complete Kit", "Extra Batteries", "Propeller Guards", "Beginner Friendly"],
        inStock: true,
        imageUrl: "https://placehold.co/400x300/1a1a1a/FFA500?text=Tello+Boost+Combo"
    },
    {
        id: 12,
        name: "Holy Stone HS175",
        description: "GPS drone with altitude hold and one-key takeoff/landing for easy operation.",
        price: 199,
        rating: 4.0,
        reviewCount: 156,
        category: "Beginner Drones",
        brand: "Holy Stone",
        features: ["GPS", "Altitude Hold", "One-key Control", "Beginner Friendly"],
        inStock: true,
        imageUrl: "https://placehold.co/400x300/1a1a1a/FFA500?text=HS175+Beginner"
    },
    {
        id: 13,
        name: "DJI Smart Controller",
        description: "High-brightness screen controller with built-in Android system.",
        price: 749,
        rating: 4.6,
        reviewCount: 87,
        category: "Accessories",
        brand: "DJI",
        features: ["High Brightness", "Android System", "Long Battery Life", "Wireless Connectivity"],
        inStock: true,
        imageUrl: "https://placehold.co/400x300/1a1a1a/FFA500?text=Smart+Controller"
    },
    {
        id: 14,
        name: "FPV Goggles V2",
        description: "Digital HD FPV goggles with low latency and high-quality display.",
        price: 649,
        rating: 4.5,
        reviewCount: 134,
        category: "Accessories",
        brand: "DJI",
        features: ["Digital HD", "Low Latency", "High Quality Display", "Comfortable Fit"],
        inStock: true,
        imageUrl: "https://placehold.co/400x300/1a1a1a/FFA500?text=FPV+Goggles+V2"
    },
    {
        id: 15,
        name: "Professional Drone Backpack",
        description: "Waterproof backpack with custom compartments for drone and accessories.",
        price: 129,
        rating: 4.4,
        reviewCount: 76,
        category: "Accessories",
        brand: "Generic",
        features: ["Waterproof", "Custom Compartments", "Comfortable", "Durable"],
        inStock: true,
        imageUrl: "https://placehold.co/400x300/1a1a1a/FFA500?text=Drone+Backpack"
    },
    {
        id: 16,
        name: "DJI Mavic 3 Pro Battery",
        description: "Original smart battery for DJI Mavic 3 Pro with 45-minute flight time.",
        price: 199,
        rating: 4.7,
        reviewCount: 45,
        category: "Spare Parts",
        brand: "DJI",
        features: ["Original", "Smart Battery", "45-min Flight", "Safety Features"],
        inStock: true,
        imageUrl: "https://placehold.co/400x300/1a1a1a/FFA500?text=Mavic+3+Battery"
    },
    {
        id: 17,
        name: "Propeller Set (4 Pairs)",
        description: "High-quality replacement propellers for various drone models.",
        price: 29,
        rating: 4.2,
        reviewCount: 89,
        category: "Spare Parts",
        brand: "Generic",
        features: ["4 Pairs", "High Quality", "Multiple Models", "Easy Installation"],
        inStock: true,
        imageUrl: "https://placehold.co/400x300/1a1a1a/FFA500?text=Propeller+Set"
    },
    {
        id: 18,
        name: "FPV Drone Frame Kit",
        description: "Carbon fiber frame kit for custom FPV drone builds.",
        price: 79,
        rating: 4.3,
        reviewCount: 23,
        category: "Spare Parts",
        brand: "iFlight",
        features: ["Carbon Fiber", "Lightweight", "Durable", "Custom Build"],
        inStock: true,
        imageUrl: "https://placehold.co/400x300/1a1a1a/FFA500?text=FPV+Frame+Kit"
    },
    {
        id: 19,
        name: "Multi-Battery Charging Hub",
        description: "Charge up to 4 batteries simultaneously with intelligent power management.",
        price: 89,
        rating: 4.5,
        reviewCount: 67,
        category: "Batteries & Chargers",
        brand: "DJI",
        features: ["4-Battery Charging", "Intelligent Management", "Fast Charging", "Safety Features"],
        inStock: true,
        imageUrl: "https://placehold.co/400x300/1a1a1a/FFA500?text=Charging+Hub"
    },
    {
        id: 20,
        name: "Car Charger Adapter",
        description: "Charge your drone batteries on the go with this car power adapter.",
        price: 39,
        rating: 4.1,
        reviewCount: 34,
        category: "Batteries & Chargers",
        brand: "Generic",
        features: ["Car Charging", "Portable", "Fast Charging", "Universal"],
        inStock: true,
        imageUrl: "https://placehold.co/400x300/1a1a1a/FFA500?text=Car+Charger"
    },
    {
        id: 21,
        name: "Battery Maintenance Kit",
        description: "Complete kit for proper battery care and maintenance.",
        price: 49,
        rating: 4.4,
        reviewCount: 28,
        category: "Batteries & Chargers",
        brand: "Generic",
        features: ["Battery Care", "Storage Bags", "Maintenance Tools", "Safety Guide"],
        inStock: true,
        imageUrl: "https://placehold.co/400x300/1a1a1a/FFA500?text=Battery+Kit"
    },
    {
        id: 22,
        name: "ND Filter Set",
        description: "Professional ND filter set for cinematic aerial photography.",
        price: 89,
        rating: 4.6,
        reviewCount: 56,
        category: "Camera Equipment",
        brand: "Freewell",
        features: ["ND Filters", "Cinematic", "Professional Grade", "Multi-coating"],
        inStock: true,
        imageUrl: "https://placehold.co/400x300/1a1a1a/FFA500?text=ND+Filter+Set"
    },
    {
        id: 23,
        name: "Camera Gimbal Protector",
        description: "Protective cover for drone camera gimbals during transport.",
        price: 19,
        rating: 4.0,
        reviewCount: 42,
        category: "Camera Equipment",
        brand: "Generic",
        features: ["Gimbal Protection", "Easy Installation", "Durable", "Universal Fit"],
        inStock: true,
        imageUrl: "https://placehold.co/400x300/1a1a1a/FFA500?text=Gimbal+Protector"
    },
    {
        id: 24,
        name: "PolarPro Cinema Series",
        description: "Premium filter collection for professional aerial cinematography.",
        price: 149,
        rating: 4.8,
        reviewCount: 31,
        category: "Camera Equipment",
        brand: "PolarPro",
        features: ["Premium Quality", "Cinema Series", "Color Accuracy", "Scratch Resistant"],
        inStock: false,
        imageUrl: "https://placehold.co/400x300/1a1a1a/FFA500?text=Cinema+Series"
    }
];

export const getUniqueCategories = () => {
    return [...new Set(mockProducts.map(product => product.category))];
};

export const getUniqueBrands = () => {
    return [...new Set(mockProducts.map(product => product.brand))];
};

export const getAllFeatures = () => {
    const allFeatures = mockProducts.flatMap(product => product.features);
    return [...new Set(allFeatures)];
};