
CREATE DATABASE spa_bd;
\c spa_bd;
CREATE TABLE news_posts (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO news_posts (title, content) VALUES
('First Post', 'This is the content of the first post.'),
('Postgres API Ready', 'The new backend is up and running.'),
('New Drone Models Arrive', 'We have just received the latest shipment of DJI and Autel drones. Check them out in the shop!'),
('Education Section Launch', 'Our new Education portal is live, featuring courses on drone cinematography and FAA regulations.'),
('Maintenance Tips', 'Learn how to properly care for your drone batteries to extend their lifespan and ensure flight safety.'),
('Upcoming Workshop', 'Sign up for our "Intro to FPV" workshop happening next month. Spots are limited!'),
('Black Friday Sneak Peek', 'Get ready for our biggest sale of the year. Deals on drones, accessories, and more.'),
('Community Spotlight', 'Check out this amazing footage captured by one of our customers, Jane Doe, using the Mavic 3 Pro.');

CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  original_price DECIMAL(10, 2),
  on_sale BOOLEAN DEFAULT false,
  rating DECIMAL(3, 1),
  review_count INTEGER DEFAULT 0,
  category VARCHAR(100),
  brand VARCHAR(100),
  features TEXT[], -- Масив рядків для фіч
  in_stock BOOLEAN DEFAULT true,
  image_url TEXT,
  images TEXT[],   -- Масив рядків для додаткових фото
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO products (name, description, price, original_price, on_sale, rating, review_count, category, brand, features, in_stock, image_url, images) VALUES
('DJI Mavic 3 Pro', 'Professional drone with Hasselblad camera and 4/3 CMOS sensor. Perfect for aerial photography and videography.', 2199, 2499, true, 4.8, 342, 'Professional Drones', 'DJI', ARRAY['4K Camera', 'GPS', 'Obstacle Avoidance', 'Follow Me Mode', 'Auto Return Home', 'Long Battery Life'], true, 'https://placehold.co/600x400/1a1a1a/FFA500?text=Mavic+3+Pro+Main', ARRAY['https://placehold.co/600x400/1a1a1a/FFA500?text=Mavic+3+Pro+Front', 'https://placehold.co/600x400/1a1a1a/FFA500?text=Mavic+3+Pro+Side']),
('Autel Robotics Evo Lite+', 'Premium drone with 6K camera and night vision capabilities. Ideal for professional filmmakers.', 1799, null, false, 4.6, 128, 'Professional Drones', 'Autel Robotics', ARRAY['6K Camera', 'GPS', 'Obstacle Avoidance', 'Night Vision', 'Auto Return Home'], true, 'https://placehold.co/600x400/1a1a1a/FFA500?text=Autel+Evo+Lite+', ARRAY['https://placehold.co/600x400/1a1a1a/FFA500?text=Autel+Front']),
('DJI Inspire 3', 'Cinematic drone with dual operator support and 8K video recording. For professional film production.', 12499, null, false, 4.9, 56, 'Professional Drones', 'DJI', ARRAY['8K Camera', 'Dual Operator', 'GPS', 'Obstacle Avoidance', 'Cinematic Mode'], true, 'https://placehold.co/600x400/1a1a1a/FFA500?text=DJI+Inspire+3', null),
('iFlight Nazgul Evoque F5', 'High-performance FPV racing drone with digital HD system. Built for speed and agility.', 399, 499, true, 4.5, 89, 'FPV Racing Drones', 'iFlight', ARRAY['First Person View', 'High Speed', 'Acro Mode', 'Digital HD', 'Racing Kit'], true, 'https://placehold.co/400x300/1a1a1a/FFA500?text=Nazgul+Evoque+F5', null),
('BetaFPV Cetus Pro Kit', 'Complete FPV starter kit for beginners. Includes drone, goggles, and controller.', 299, null, false, 4.3, 156, 'FPV Racing Drones', 'BetaFPV', ARRAY['Beginner Friendly', 'Complete Kit', 'First Person View', 'Protection Frame'], true, 'https://placehold.co/400x300/1a1a1a/FFA500?text=Cetus+Pro+Kit', null),
('GEPRC Mark5 HD', 'Competition-grade FPV drone with digital HD video transmission and long range.', 649, null, false, 4.7, 67, 'FPV Racing Drones', 'GEPRC', ARRAY['Digital HD', 'Long Range', 'Competition Grade', 'High Performance'], false, 'https://placehold.co/400x300/1a1a1a/FFA500?text=GEPRC+Mark5+HD', null),
('DJI Mini 4 Pro', 'Ultra-light camera drone with 4K HDR video and advanced obstacle sensing.', 759, 899, true, 4.8, 423, 'Camera Drones', 'DJI', ARRAY['4K HDR', 'Obstacle Avoidance', 'Foldable Design', 'Under 250g', 'Follow Me Mode'], true, 'https://placehold.co/400x300/1a1a1a/FFA500?text=DJI+Mini+4+Pro', null),
('Autel Robotics Evo Nano+', 'Compact drone with 48MP camera and three-way obstacle avoidance system.', 899, null, false, 4.4, 94, 'Camera Drones', 'Autel Robotics', ARRAY['48MP Camera', 'Three-way Obstacle Avoidance', 'Compact Design', 'GPS'], true, 'https://placehold.co/400x300/1a1a1a/FFA500?text=Evo+Nano+Plus', null),
('Holy Stone HS720G', '4K GPS drone with brushless motors and 2-axis gimbal for stable footage.', 329, null, false, 4.2, 287, 'Camera Drones', 'Holy Stone', ARRAY['4K Camera', 'GPS', 'Brushless Motors', '2-Axis Gimbal', 'Auto Return'], true, 'https://placehold.co/400x300/1a1a1a/FFA500?text=HS720G+4K+GPS', null),
('DJI Tello', 'Educational drone perfect for beginners. Programmable with Scratch.', 99, null, false, 4.1, 512, 'Beginner Drones', 'DJI', ARRAY['Beginner Friendly', 'Programmable', 'Stable Flight', '720p Camera'], true, 'https://placehold.co/400x300/1a1a1a/FFA500?text=DJI+Tello', null),
('Ryze Tech Tello Boost Combo', 'Complete starter kit with extra batteries and propeller guards.', 149, null, false, 4.3, 198, 'Beginner Drones', 'Ryze Tech', ARRAY['Complete Kit', 'Extra Batteries', 'Propeller Guards', 'Beginner Friendly'], true, 'https://placehold.co/400x300/1a1a1a/FFA500?text=Tello+Boost+Combo', null),
('Holy Stone HS175', 'GPS drone with altitude hold and one-key takeoff/landing for easy operation.', 199, null, false, 4.0, 156, 'Beginner Drones', 'Holy Stone', ARRAY['GPS', 'Altitude Hold', 'One-key Control', 'Beginner Friendly'], true, 'https://placehold.co/400x300/1a1a1a/FFA500?text=HS175+Beginner', null),
('DJI Smart Controller', 'High-brightness screen controller with built-in Android system.', 749, null, false, 4.6, 87, 'Accessories', 'DJI', ARRAY['High Brightness', 'Android System', 'Long Battery Life', 'Wireless Connectivity'], true, 'https://placehold.co/400x300/1a1a1a/FFA500?text=Smart+Controller', null),
('FPV Goggles V2', 'Digital HD FPV goggles with low latency and high-quality display.', 649, null, false, 4.5, 134, 'Accessories', 'DJI', ARRAY['Digital HD', 'Low Latency', 'High Quality Display', 'Comfortable Fit'], true, 'https://placehold.co/400x300/1a1a1a/FFA500?text=FPV+Goggles+V2', null),
('Professional Drone Backpack', 'Waterproof backpack with custom compartments for drone and accessories.', 129, null, false, 4.4, 76, 'Accessories', 'Generic', ARRAY['Waterproof', 'Custom Compartments', 'Comfortable', 'Durable'], true, 'https://placehold.co/400x300/1a1a1a/FFA500?text=Drone+Backpack', null),
('DJI Mavic 3 Pro Battery', 'Original smart battery for DJI Mavic 3 Pro with 45-minute flight time.', 199, null, false, 4.7, 45, 'Spare Parts', 'DJI', ARRAY['Original', 'Smart Battery', '45-min Flight', 'Safety Features'], true, 'https://placehold.co/400x300/1a1a1a/FFA500?text=Mavic+3+Battery', null),
('Propeller Set (4 Pairs)', 'High-quality replacement propellers for various drone models.', 29, null, false, 4.2, 89, 'Spare Parts', 'Generic', ARRAY['4 Pairs', 'High Quality', 'Multiple Models', 'Easy Installation'], true, 'https://placehold.co/400x300/1a1a1a/FFA500?text=Propeller+Set', null),
('FPV Drone Frame Kit', 'Carbon fiber frame kit for custom FPV drone builds.', 79, null, false, 4.3, 23, 'Spare Parts', 'iFlight', ARRAY['Carbon Fiber', 'Lightweight', 'Durable', 'Custom Build'], true, 'https://placehold.co/400x300/1a1a1a/FFA500?text=FPV+Frame+Kit', null),
('Multi-Battery Charging Hub', 'Charge up to 4 batteries simultaneously with intelligent power management.', 89, null, false, 4.5, 67, 'Batteries & Chargers', 'DJI', ARRAY['4-Battery Charging', 'Intelligent Management', 'Fast Charging', 'Safety Features'], true, 'https://placehold.co/400x300/1a1a1a/FFA500?text=Charging+Hub', null),
('Car Charger Adapter', 'Charge your drone batteries on the go with this car power adapter.', 39, null, false, 4.1, 34, 'Batteries & Chargers', 'Generic', ARRAY['Car Charging', 'Portable', 'Fast Charging', 'Universal'], true, 'https://placehold.co/400x300/1a1a1a/FFA500?text=Car+Charger', null),
('Battery Maintenance Kit', 'Complete kit for proper battery care and maintenance.', 49, null, false, 4.4, 28, 'Batteries & Chargers', 'Generic', ARRAY['Battery Care', 'Storage Bags', 'Maintenance Tools', 'Safety Guide'], true, 'https://placehold.co/400x300/1a1a1a/FFA500?text=Battery+Kit', null),
('ND Filter Set', 'Professional ND filter set for cinematic aerial photography.', 89, null, false, 4.6, 56, 'Camera Equipment', 'Freewell', ARRAY['ND Filters', 'Cinematic', 'Professional Grade', 'Multi-coating'], true, 'https://placehold.co/400x300/1a1a1a/FFA500?text=ND+Filter+Set', null),
('Camera Gimbal Protector', 'Protective cover for drone camera gimbals during transport.', 19, null, false, 4.0, 42, 'Camera Equipment', 'Generic', ARRAY['Gimbal Protection', 'Easy Installation', 'Durable', 'Universal Fit'], true, 'https://placehold.co/400x300/1a1a1a/FFA500?text=Gimbal+Protector', null),
('PolarPro Cinema Series', 'Premium filter collection for professional aerial cinematography.', 149, null, false, 4.8, 31, 'Camera Equipment', 'PolarPro', ARRAY['Premium Quality', 'Cinema Series', 'Color Accuracy', 'Scratch Resistant'], false, 'https://placehold.co/400x300/1a1a1a/FFA500?text=Cinema+Series', null);