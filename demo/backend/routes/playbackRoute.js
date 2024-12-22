const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');
const redis = require('../redisClient'); // Redis client

const db = mysql.createPool({
  host: 'localhost',
  user: 'audiobook_user',
  password: 'new_password',
  database: 'audiobook',
});

// Get the number of book plays
router.get('/playback/:bookId', async (req, res) => {
  const { bookId } = req.params;

  try {
    // Check the Redis cache
    const cachedData = await redis.get(`playback:${bookId}`);
    if (cachedData) {
      console.log('Cache hit');
      return res.json(JSON.parse(cachedData));
    }

    console.log('Cache miss');

    // Reading Data from MySQL
    const [rows] = await db.query(
      'SELECT book_id, title, playback_count FROM book_playback WHERE book_id = ?',
      [bookId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Book not found' });
    }

    const playbackData = rows[0];

    // Storing data in Redis cache
    await redis.set(`playback:${bookId}`, JSON.stringify(playbackData), 'EX', 3600);

    return res.json(playbackData);
  } catch (error) {
    console.error('Error fetching playback data:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Update the book playback volume
router.post('/playback/:bookId', async (req, res) => {
  const { bookId } = req.params;

  try {
    // Update the MySQL database
    await db.query(
      'UPDATE book_playback SET playback_count = playback_count + 1, last_played = NOW() WHERE book_id = ?',
      [bookId]
    );

    // Read updated data from the database
    const [rows] = await db.query(
      'SELECT book_id, title, playback_count FROM book_playback WHERE book_id = ?',
      [bookId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Book not found' });
    }

    const updatedPlaybackData = rows[0];

    // Synchronously update the Redis cache
    await redis.set(`playback:${bookId}`, JSON.stringify(updatedPlaybackData), 'EX', 3600);

    res.json(updatedPlaybackData);
  } catch (error) {
    console.error('Error updating playback data:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
