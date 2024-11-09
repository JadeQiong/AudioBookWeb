const express = require('express');
const bodyParser = require('body-parser');
const textToSpeech = require('@google-cloud/text-to-speech');
const fs = require('fs');
const util = require('util');
const cors = require('cors');
const path = require('path');
const getOpenAIClient = require('./openaiClient'); 
const { execSync } = require('child_process'); // Import execSync
const axios = require('axios');
const config = require('./config');

const app = express();
const port = 3001;

app.use(cors()); // Enable CORS
app.use(bodyParser.json());

app.use(cors()); // Enable CORS
app.use(express.json());
// Initialize Google Text-to-Speech Client
const ttsClient = new textToSpeech.TextToSpeechClient();

app.post('/synthesize', async (req, res) => {
  console.log('Received request:', req.body);

  const booktitle = req.body.text;
  const author = req.body.author;

  try {
    // 调用新的 API 生成脚本
    const gptGeneratedText = await generatePodcastScript(booktitle, author);
    console.log('Generated Text:', gptGeneratedText);

    // 继续处理生成的脚本（写入文件、音频生成等）
    const scriptPath = await writeScriptToFile(gptGeneratedText);
    console.log('Transcript has been written to', scriptPath);

    const combinedFilePath = await processAndMerge(scriptPath);
    const finalOutputPath = await addEndMusic(combinedFilePath);
    console.log('Process completed. Final podcast with start and end music is ready.');

    res.sendFile(finalOutputPath);
  } catch (error) {
    console.error('Error during processing:', error);
    res.status(500).send('Error during processing');
  }
});

app.post('/generate_script', async (req, res) => {
  try {
    const { text, author } = req.body;

    // 构建请求体以发送到外部 API
    const requestBody = {
      inputs: {
        bookTitle: text,
        author: author,
      },
      response_mode: "blocking",
      user: "abc-123"
    };

    // 发送请求到外部 API
    const response = await axios.post(config.apiUrl, requestBody, {
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    // 提取生成的文本
    const gptGeneratedText = response.data.data.outputs.result; // 确保提取正确的字段
    console.log('GPT Generated Text:', gptGeneratedText);

    // 将生成的文本写入文件
    const scriptPath = await writeScriptToFile(gptGeneratedText);
    console.log('Transcript has been written to', scriptPath);

    res.status(200).json({ message: 'Script generated successfully', scriptPath });
  } catch (error) {
    console.error('Error generating script:', error);
    res.status(500).json({ error: 'Failed to generate script' });
  }
});


// Route for combining music and sending the final file
app.post('/combine_music', async (req, res) => {
  console.log('Received request:', req.body);

  // Process the script and merge the audio files
  const combinedFilePath = await processAndMergeExistingMusic();

  // Add end music to the combined podcast
  const finalOutputPath = await addEndMusic(combinedFilePath);
  console.log('Process completed. Final podcast with start and end music is ready.');

  // Send the final file as a response
  res.sendFile(finalOutputPath);
});

app.post('/generate_audio', async (req, res) => {
  try {

    // Create a temporary script file for processing
    const scriptPath = path.join(__dirname, './scripts/think_faster.txt');

    // Process the script and generate audio files
    const filePaths = await processScript(scriptPath);

    // Optionally, you can combine all generated files into one audio file
    // const combinedFilePath = await combineGeneratedAudio(filePaths);

    res.sendFile(filePaths[0]); // Send the first generated audio file as a response, you can adjust this as needed
  } catch (error) {
    console.error('Error generating audio:', error);
    res.status(500).json({ error: 'Failed to generate audio' });
  }
});




async function processAndMergeExistingMusic() {
  const outputDir = path.join(__dirname, 'output');

  // Read all files from the output directory
  const files = fs.readdirSync(outputDir)
    .filter(file => file.endsWith('.wav')) // Only include MP3 files
    .sort((a, b) => {
      // Extract the numeric part from filenames like 'michael_44.mp3' and sort them
      const numA = parseInt(a.match(/\d+/), 10);
      const numB = parseInt(b.match(/\d+/), 10);
      return numA - numB;
    });

  // Create file paths from the sorted files
  const filePaths = files.map(file => path.join(outputDir, file));
  const combinedPodcastPath = path.join(__dirname, 'output', 'combined_podcast.mp3');
  combineAudioFiles(filePaths, combinedPodcastPath);

  // Path to the starting music
  const startingMusicPath = path.join(__dirname, 'music', 'start_music.mp3');

  // Define the final output path after combining the start music with the podcast
  const finalCombinedFilePath = path.join(__dirname, 'output', 'combined_podcast_with_start.mp3');

  console.log('Combining start music with podcast...');
  // Combine the starting music with the podcast
  combineAudioFilesWithConcatFilter([startingMusicPath, combinedPodcastPath], finalCombinedFilePath);

  return finalCombinedFilePath;
  // // Define the output file path
  // const combinedPodcastPath = path.join(__dirname, 'output', 'combined_podcast.mp3');

  // // Combine the MP3 files
  // combineAudioFiles(filePaths, combinedPodcastPath);

  // return combinedPodcastPath;
}

// async function generatePodcastScript_origin(bookTitle, author) {
//   const openai = getOpenAIClient();
//
//   // Define the segments or topics to be discussed in the podcast
//   const topics = [
//     "Discussion on the main theme of the book",
//     "Key characters or ideas presented in the book",
//     "Important quotes and their implications",
//     "How the book relates to current societal issues",
//     "Final thoughts and recommendations for readers"
//   ];
//
//   let fullScript = "";
//
//   // Generate the initial greeting and the first topic
//   const initialPrompt = `
//     Generate a podcast transcript discussing the book '${bookTitle}' by '${author}'.
//     Start with an introduction where Emma greets the audience and welcomes them to the podcast "BookTalks," where she introduces Michael as the regular guest.
//     Then discuss the first topic: ${topics[0]}.
//     Requirements:
//     1. Emma is the host and Michael is the guest, starting with Emma, and end with Michael's response. Even number of turns.
//     2. Michael should have a humorous tone.
//     3. The generated transcript should be at least 350-450 words.
//     4. Do not include "[Opening music plays]" or "[End of transcript]" or any other start or end-of-transcript markers.
//     5. Do not include any non-verbal cues like "(laughs)", "(sighs)", "(pauses)", or any similar expressions.
//     6. Do **NOT** include any ending greetings, closing remarks, or phrases like "Thank you for listening", "Final thoughts", or "See you next time". **Do not imply the end of the podcast at all.**
//   `;
//   const initialResponse = await openai.chat.completions.create({
//     model: 'gpt-3.5-turbo',
//     messages: [{ role: 'user', content: initialPrompt }],
//   });
//   fullScript += initialResponse.choices[0].message.content.trim() + "\n\n";
//
//   // Generate the remaining topics without repetitive greetings
//   for (let i = 1; i < topics.length; i++) {
//     const prompt = `
//       Continue the podcast transcript discussing the book '${bookTitle}'.
//       The host Emma should smoothly transition into the next topic: ${topics[i]}.
//       Requirements:
//       1. Emma should continue without greeting the audience again and should not reintroduce the book. She should start directly with a question about the topic.
//       2. The conversation between Emma and Michael should be back-and-forth, focusing on discussing the topic without any transition into ending remarks, starting with Emma, and end with Michael's response. Even number of turns.
//       3. Include specific examples from the book in the conversation.
//       4. The generated transcript should be about 150 words.
//       5. Do **NOT** include any ending greetings, closing remarks, or phrases like "Thank you for listening", "Final thoughts", or "See you next time". **Do not imply the end of the podcast at all.**
//       6. Do not include any non-verbal cues like "(laughs)", "(sighs)", "(pauses)", or any similar expressions.
//       7. The transcript should maintain a conversational tone and flow naturally without wrapping up the discussion.
//     `;
//
//
//     const response = await openai.chat.completions.create({
//       model: 'gpt-3.5-turbo',
//       messages: [{ role: 'user', content: prompt }],
//     });
//
//     // // Process the response to exclude the last line
//     // const transcript = response.choices[0].message.content.trim();
//     // const lines = transcript.split('\n');
//
//     // // Exclude the last line
//     // const filteredTranscript = lines.slice(0, -1).join('\n');
//
//     // fullScript += filteredTranscript + "\n\n";
//     fullScript += response.choices[0].message.content.trim();
//   }
//
//     // Generate the final thoughts and closing segment separately
//     const closingPrompt = `
//     Generate the final segment of the podcast discussing the book '${bookTitle}'.
//     Emma should ask Michael for his final thoughts on the book and then wrap up the discussion.
//     Requirements:
//     1. The segment should have exactly two turns: Emma starts by asking for final thoughts, Michael responds, and Emma gives a brief closing statement.
//     2. Include a closing statement inviting listeners to suggest books for the next discussion.
//     3. The generated transcript should be concise and within 80 words.
//     4. Do not include any non-verbal cues like "(laughs)", "(sighs)", "(pauses)", or any similar expressions.
//     5. Do not include "[End of transcript]" or any other end-of-transcript markers.
//   `;
//
//   const closingResponse = await openai.chat.completions.create({
//     model: 'gpt-3.5-turbo',
//     messages: [{ role: 'user', content: closingPrompt }],
//   });
//
//   // Process the response to ensure each dialogue line is on a separate line with a blank line in between
//   const lines = closingResponse.choices[0].message.content.trim()
//     .split('\n')
//     .filter(line => line.trim() !== ''); // Remove any extra empty lines
//
//   // Format with a blank line between Emma and Michael
//   const formattedDialogue = lines.join('\n\n'); // Join with double line breaks for separation
//
//   fullScript += formattedDialogue + "\n\n";
//
//
//
//
//
//   // Add the final question at the end
//   fullScript += `
// Emma: What book would you like to know about next time?
//   `;
//
//   return fullScript;
// }

async function generatePodcastScript(bookTitle, author) {
  const { apiUrl, apiKey } = config;// 从配置文件获取 apiUrl 和 apiKey

  const payload = {
    inputs: {
      bookTitle: bookTitle,
      author: author
    },
    response_mode: 'streaming', // 可选择 'blocking' 作为替代
    user: 'abc-123' // 适当修改为实际的用户标识
  };

  try {
    // 发送请求
    const response = await axios.post(apiUrl, payload, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    const result = response.data;
    console.log('API Response:', result);

    // 检查请求状态并提取文本输出
    if (result.data && result.data.status === 'succeeded') {
      const scriptText = result.data.outputs.result; // 获取生成的脚本文本
      return scriptText;
    } else {
      throw new Error(`API 请求失败：${result.data.error || '未知错误'}`);
    }
  } catch (error) {
    console.error('Error generating podcast script:', error);
    throw error;
  }
}



// Write the generated script to a file
async function writeScriptToFile(scriptText) {
  const scriptPath = path.join(__dirname, './scripts/think_faster.txt');
  await util.promisify(fs.writeFile)(scriptPath, scriptText);
  return scriptPath;
}

// Process the script and merge audio files
async function processAndMerge(scriptPath) {
  const filePaths = await processScript(scriptPath);
  console.log('filePaths', filePaths);

  const combinedPodcastPath = path.join(__dirname, 'output', 'combined_podcast.mp3');
  combineAudioFiles(filePaths, combinedPodcastPath);

  const startingMusicPath = path.join(__dirname, 'music', 'start_music.mp3');
  const finalCombinedFilePath = path.join(__dirname, 'output', 'combined_podcast2.mp3');

  console.log('Combining start music with podcast...');
  combineAudioFilesWithConcatFilter([startingMusicPath, combinedPodcastPath], finalCombinedFilePath);

  return finalCombinedFilePath;
}

// Add end music to the combined podcast
async function addEndMusic(inputFile) {
  try {
    // Ensure input file exists
    if (!fs.existsSync(inputFile)) {
      throw new Error(`Input file not found: ${inputFile}`);
    }

    const endMusicPath = path.join(__dirname, 'music', 'end_music.mp3');
    const finalOutputPath = path.join(__dirname, 'output', 'final_podcast.mp3');

    // Ensure end music file exists
    if (!fs.existsSync(endMusicPath)) {
      throw new Error(`End music file not found: ${endMusicPath}`);
    }

    // Get the duration of the input file
    const durationCommand = `ffprobe -i "${inputFile}" -show_entries format=duration -v quiet -of csv="p=0"`;
    const durationOutput = execSync(durationCommand).toString().trim();

    if (!durationOutput) {
      throw new Error('Failed to retrieve the duration of the input file.');
    }

    const duration = parseFloat(durationOutput);
    const delay = Math.floor(duration * 990); // Convert to milliseconds

    console.log('Calculated Delay (milliseconds):', delay);

    // Construct the ffmpeg command
    const command = `ffmpeg -y -i "${inputFile}" -i "${endMusicPath}" -filter_complex "[1]adelay=${delay}|${delay}[delayed]; [0:a][delayed]amix=inputs=2:duration=longest:dropout_transition=2" -acodec libmp3lame "${finalOutputPath}"`;

    // Execute the ffmpeg command
    execSync(command, { stdio: 'inherit' });

    console.log(`Final podcast with end music saved to ${finalOutputPath}`);
    return finalOutputPath;

  } catch (error) {
    console.error('Error adding end music:', error.message);
    return null;
  }
}

// Process the script to generate audio files
async function processScript(filePath) {
  const script = fs.readFileSync(filePath, 'utf8');
  const lines = script.split('\n').filter(line => line.trim() !== '');

  // Split the lines into two halves
  const middleIndex = Math.ceil(lines.length / 2);
  const firstHalf = lines.slice(0, middleIndex);
  const secondHalf = lines.slice(middleIndex);

  // Function to process a set of lines
  const processLines = async (lines, startIndex) => {
    let fileIndex = startIndex;
    const tasks = lines.map(line => async () => {
      const [speaker, ...speechArray] = line.split(':');
      const speech = speechArray.join(':').trim();

      const ttsRequest = {
        input: { text: speech },
        voice: { languageCode: 'en-US', ssmlGender: speaker.trim() === 'Emma' ? 'FEMALE' : 'MALE', name: speaker.trim() === 'Emma' ? 'en-US-Journey-F' : 'en-US-Journey-D' },
        audioConfig: { audioEncoding: 'LINEAR16' },
      };

      const outputDir = path.join(__dirname, 'output');
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir);
      }

      const fileName = `${speaker.trim().toLowerCase()}_${fileIndex}.wav`;
      const filePath = path.join(outputDir, fileName);
      fileIndex++;

      const [ttsResponse] = await ttsClient.synthesizeSpeech(ttsRequest);
      await util.promisify(fs.writeFile)(filePath, ttsResponse.audioContent, 'binary');
      console.log(`Generated ${fileName}`);
      return filePath;
    });

    return Promise.all(tasks.map(task => task()));
  };

  // Process the first half
  const firstHalfPaths = await processLines(firstHalf, 1);
  // Process the second half
  const secondHalfPaths = await processLines(secondHalf, middleIndex + 1);

  return [...firstHalfPaths, ...secondHalfPaths];
}


function cleanUpScript(script) {
  // Remove lines with just "---"
  let cleanedScript = script.split('\n').filter(line => line.trim() !== '---').join('\n');

  cleanedScript = cleanedScript.replace(/Michael|any_other_host_name/g, 'Michael');

  return cleanedScript;
}

// Example function to combine audio files (in MP3 format)
function combineAudioFiles(filePaths, outputFile) {
  const listFile = path.join(__dirname, 'filelist.txt');
  const fileListContent = filePaths.map(filePath => `file '${filePath}'`).join('\n');
  fs.writeFileSync(listFile, fileListContent);
  console.log('List file created:', listFile);
  try {
    // Use libmp3lame codec for MP3 output
    const command = `ffmpeg -y -f concat -safe 0 -i ${listFile} -acodec libmp3lame -q:a 2 ${outputFile}`;
    execSync(command, { stdio: 'inherit' });
    console.log(`Combined audio saved to ${outputFile}`);
  } catch (error) {
    console.error('Error combining audio files:', error);
  } finally {
    fs.unlinkSync(listFile);
  }
}

// Combine audio files using concat filter
function combineAudioFilesWithConcatFilter(inputFiles, outputFile) {
  // Generate the input files portion of the command
  const concatFilter = inputFiles.map(file => `-i ${file}`).join(' ');

  // Generate the filter_complex portion dynamically based on the number of input files
  const inputIndexes = inputFiles.map((_, index) => `[${index}:0]`).join('');
  const filterComplex = `-filter_complex "${inputIndexes}concat=n=${inputFiles.length}:v=0:a=1[out]" -map "[out]"`;

  // Final ffmpeg command
  const command = `ffmpeg -y ${concatFilter} ${filterComplex} -acodec libmp3lame ${outputFile}`;

  // Execute the command
  try {
    execSync(command, { stdio: 'inherit' });
    console.log(`Combined audio saved to ${outputFile}`);
  } catch (error) {
    console.error('Error combining audio files:', error);
  }
}

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});