const express = require('express');
const router = express.Router();
const path = require('path');
const { TextToSpeechClient } = require('@google-cloud/text-to-speech');
const ttsClient = new TextToSpeechClient();

const generateAudioHandler = async (req, res) => {
  try {
    const { scriptPath } = req.body;

    // 参数验证
    if (!scriptPath) {
      return res.status(400).json({ 
        error: 'Missing required parameters', 
        details: 'Script path is required' 
      });
    }

    // 读取脚本文件
    const script = await require('fs').promises.readFile(scriptPath, 'utf8');
    const lines = script.split('\n').filter(line => line.trim() !== '');

    // 生成音频片段
    const audioChunks = await Promise.all(lines.map(async (line, index) => {
      const [speaker, ...speechArray] = line.split(':');
      const speech = speechArray.join(':').trim();

      const ttsRequest = {
        input: { text: speech },
        voice: { 
          languageCode: 'en-US', 
          ssmlGender: speaker.trim() === 'Emma' ? 'FEMALE' : 'MALE', 
          name: speaker.trim() === 'Emma' ? 'en-US-Journey-F' : 'en-US-Journey-D' 
        },
        audioConfig: { audioEncoding: 'MP3' },
      };

      const [ttsResponse] = await ttsClient.synthesizeSpeech(ttsRequest);
      return ttsResponse.audioContent;
    }));

    // 合并音频片段
    const { Buffer } = require('buffer');
    const finalAudioBuffer = Buffer.concat(audioChunks);

    // 发送音频
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Content-Length', finalAudioBuffer.length);
    res.send(finalAudioBuffer);
  } catch (error) {
    console.error('Audio Generation Error:', error);
    res.status(500).json({ 
      error: 'Failed to generate audio', 
      details: error.message 
    });
  }
};

// 路由配置
router.post('/generate_audio', generateAudioHandler);

module.exports = router;
module.exports.post = generateAudioHandler;
