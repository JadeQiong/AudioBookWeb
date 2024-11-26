const express = require('express');
const bodyParser = require('body-parser');
const textToSpeech = require('@google-cloud/text-to-speech');
const fs = require('fs');
// const util = require('util');
const cors = require('cors');
const path = require('path');
const getOpenAIClient = require('./openaiClient'); 
const { execSync } = require('child_process'); // Import execSync
const axios = require('axios');
const config = require('./config');

const synthesizeRoute = require('./routes/synthesizeRoute');
const generateScriptRoute = require('./routes/generateScriptRoute');
const combineMusicRoute = require('./routes/combineMusicRoute');
const generateAudioRoute = require('./routes/generateAudioRoute');

const app = express();
const port = 3001;

// Consolidated middleware setup
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// Initialize Google Text-to-Speech Client
const ttsClient = new textToSpeech.TextToSpeechClient();

// Detailed route registration with error handling
app.post('/synthesize', async (req, res, next) => {
  try {
    await synthesizeRoute.post(req, res);
  } catch (error) {
    console.error('Synthesize Route Error:', error);
    next(error);
  }
});

app.post('/generate_script', async (req, res, next) => {
  try {
    await generateScriptRoute.post(req, res);
  } catch (error) {
    console.error('Generate Script Route Error:', error);
    next(error);
  }
});

app.post('/combine_music', async (req, res, next) => {
  try {
    await combineMusicRoute.post(req, res);
  } catch (error) {
    console.error('Combine Music Route Error:', error);
    next(error);
  }
});

app.post('/generate_audio', async (req, res, next) => {
  try {
    await generateAudioRoute.post(req, res);
  } catch (error) {
    console.error('Generate Audio Route Error:', error);
    next(error);
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);
  res.status(err.status || 500).json({ 
    error: 'Internal Server Error', 
    details: err.message 
  });
});

module.exports = app;  // Export app for testing

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}