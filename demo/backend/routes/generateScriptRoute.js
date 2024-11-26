const express = require('express');
const router = express.Router();
const axios = require('axios');
const config = require('../config');
const fs = require('fs');
const path = require('path');

const generateScriptHandler = async (req, res) => {
  try {
    const { text, author } = req.body;

    // 参数验证
    if (!text || !author) {
      return res.status(400).json({ 
        error: 'Missing required parameters', 
        details: 'Both book title and author are required' 
      });
    }

    const requestBody = {
      inputs: {
        bookTitle: text,
        author: author,
      },
      response_mode: "blocking",
      user: "abc-123"
    };

    const response = await axios.post(config.apiUrl, requestBody, {
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    const gptGeneratedText = response.data.data.outputs.result;
    
    res.status(200).json({ 
      message: 'Script generated successfully', 
      scriptText: gptGeneratedText 
    });
  } catch (error) {
    console.error('Script Generation Error:', error);
    res.status(500).json({ 
      error: 'Failed to generate script', 
      details: error.message 
    });
  }
};

router.post('/generate_script', generateScriptHandler);

module.exports = router;
module.exports.post = generateScriptHandler;
