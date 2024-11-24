const express = require('express');
const router = express.Router();
const axios = require('axios');
const path = require('path');
const fs = require('fs');
// const util = require('util');
const { execSync } = require('child_process');
const config = require('../config'); // assuming config is in a separate file
const { TextToSpeechClient } = require('@google-cloud/text-to-speech');
const ttsClient = new TextToSpeechClient();

async function generatePodcastScript(bookTitle, author) {
  const { apiUrl, apiKey } = config;

  const payload = {
    inputs: {
      bookTitle,
      author,
    },
    response_mode: "blocking",
    user: "abc-123"
  };

  const response = await axios.post(apiUrl, payload, {
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
  });

  const gptGeneratedText = response.data.data.outputs.result;
  return gptGeneratedText;
}

function splitTextIntoChunks(text) {
  const chunkSize = 5000; // Example chunk size
  const regex = new RegExp(`.{1,${chunkSize}}`, 'g');
  return text.match(regex);
}

const synthesizeHandler = async (req, res) => {
  try {
    const booktitle = req.body.text;
    const author = req.body.author;

    // 参数验证
    if (!booktitle || !author) {
      return res.status(400).json({ 
        error: 'Missing required parameters', 
        details: 'Both book title and author are required' 
      });
    }

    // 生成播客脚本
    const scriptText = await generatePodcastScript(booktitle, author);
    const textChunks = splitTextIntoChunks(scriptText);

    const audioBuffers = [];

    for (const textChunk of textChunks) {
      const request = {
        input: { text: textChunk },
        voice: { languageCode: 'en-US', ssmlGender: 'NEUTRAL' },
        audioConfig: { audioEncoding: 'MP3' },
      };

      const [response] = await ttsClient.synthesizeSpeech(request);
      audioBuffers.push(response.audioContent);
    }

    const finalAudioBuffer = Buffer.concat(audioBuffers);

    res.setHeader('Content-Type', 'audio/mpeg');
    res.send(finalAudioBuffer);
  } catch (error) {
    console.error('Synthesize Route Error:', error);
    res.status(500).json({ 
      error: 'Failed to synthesize audio', 
      details: error.message 
    });
  }
};

router.post('/synthesize', synthesizeHandler);

async function addEndMusic(inputFile) {
  try {
    const endMusicPath = path.join(__dirname, 'music', 'end_music.mp3');
    const finalOutputPath = path.join(__dirname, 'output', 'final_podcast.mp3');

    if (!fs.existsSync(endMusicPath)) {
      throw new Error(`End music file not found: ${endMusicPath}`);
    }

    const durationCommand = `ffprobe -i "${inputFile}" -show_entries format=duration -v quiet -of csv="p=0"`;
    const durationOutput = execSync(durationCommand).toString().trim();

    if (!durationOutput) {
      throw new Error('Failed to retrieve the duration of the input file.');
    }

    const duration = parseFloat(durationOutput);
    const delay = Math.floor(duration * 990);

    const command = `ffmpeg -y -i "${inputFile}" -i "${endMusicPath}" -filter_complex "[1]adelay=${delay}|${delay}[delayed]; [0:a][delayed]amix=inputs=2:duration=longest:dropout_transition=2" -acodec libmp3lame "${finalOutputPath}"`;

    execSync(command, { stdio: 'inherit' });
    return finalOutputPath;
  } catch (error) {
    console.error('Error adding end music:', error.message);
    return null;
  }
}

module.exports = router;
module.exports.post = synthesizeHandler;
