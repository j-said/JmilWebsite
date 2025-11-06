
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
('Postgres API Ready', 'The new backend is up and running.');