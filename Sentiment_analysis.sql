CREATE DATABASE sentiment_analysis;
USE sentiment_analysis;
CREATE TABLE tweets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tweet TEXT NOT NULL,
    sentiment VARCHAR(255) NOT NULL
);
USE sentiment_analysis;
CREATE TABLE IF NOT EXISTS tweets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tweet TEXT NOT NULL,
    sentiment VARCHAR(255) NOT NULL
);
SELECT * FROM tweets;
