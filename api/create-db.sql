
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