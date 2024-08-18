const express = require('express');
const bodyParser = require('body-parser');
const textToSpeech = require('@google-cloud/text-to-speech');
const fs = require('fs');
const util = require('util');
const cors = require('cors');
const path = require('path');
const getOpenAIClient = require('./openaiClient'); 
const { execSync } = require('child_process'); // Import execSync

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
    // Generate transcript using OpenAI
    const gptGeneratedText = await generatePodcastScript(booktitle, author);
    console.log('GPT Generated Text:', gptGeneratedText);

    // Write the generated transcript to a file
    const scriptPath = await writeScriptToFile(gptGeneratedText);
    console.log('Transcript has been written to', scriptPath);

    // Process the script and merge the audio files
    const combinedFilePath = await processAndMerge(scriptPath);

    // Add end music to the combined podcast
    const finalOutputPath = await addEndMusic(combinedFilePath);
    console.log('Process completed. Final podcast with start and end music is ready.');

    // Send the final file as a response
    res.sendFile(finalOutputPath);
  } catch (error) {
    console.error('Error during processing:', error);
    res.status(500).send('Error during processing');
  }
});

app.post('/generate_script', async (req, res) => {
  try {
    const { text, author } = req.body;
    const gptGeneratedText = await generatePodcastScript(text, author);
    console.log('GPT Generated Text:', gptGeneratedText);

    // Write the generated transcript to a file
    const scriptPath = await writeScriptToFile(gptGeneratedText);
    console.log('Transcript has been written to', scriptPath);

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

// // Generate podcast script using OpenAI
// async function generatePodcastScript(booktitle) {
//   const openai = getOpenAIClient();
//   const prompt = `
//     Give me a transcript of podcasts that last for 7000 words for the book:
//     1. ${booktitle} by Elie Wiesel
//     Please follow these requirements: 
//     1. One host naming Emma, one guest naming Michael, who is humorous, for each podcast. 
//     2. Coming up about 7 topics in the book, and discuss them in the podcast. Each time one person should talk more than 3 sentences.
//     3. Be clear, and close to reality. Remember this is a podcast in a causual style.
//     4. In the end, the host will ask the audience, "What book would you like to know about next time?".
//     5. Format the transcript exactly like 
//     "Emma: Hello everyone, and welcome back to Book talks! I'm your host, Emma. Today, we have our guest Michael. Welcome, Michael!

//     Michael: Thank you, Emma. I'm excited to be here.

//     Emma: So, Michael, you're known for your quick wit and sense of humor."
//   `;


//     // Use GPT to generate content based on the input text
//     const gptResponse = await openai.chat.completions.create({
//     model: 'gpt-4', // Replace with the desired model, like 'text-davinci-003'
//     messages: [{ role: 'user', content: prompt }],
//   });
//   let gptGeneratedText = gptResponse.choices[0].message.content.trim();
//   gptGeneratedText = cleanUpScript(gptGeneratedText);
//   return gptGeneratedText;
// }



async function processAndMergeExistingMusic() {
  const outputDir = path.join(__dirname, 'output');

  // Read all files from the output directory
  const files = fs.readdirSync(outputDir)
    .filter(file => file.endsWith('.mp3')) // Only include MP3 files
    .sort((a, b) => {
      // Extract the numeric part from filenames like 'michael_44.mp3' and sort them
      const numA = parseInt(a.match(/\d+/), 10);
      const numB = parseInt(b.match(/\d+/), 10);
      return numA - numB;
    });

  // Create file paths from the sorted files
  const filePaths = files.map(file => path.join(outputDir, file));
  console.log('filePaths:', filePaths);

  const combinedPodcastPath = path.join(__dirname, 'output', 'combined_podcast.mp3');
  combineAudioFiles(filePaths, combinedPodcastPath);

  const startingMusicPath = path.join(__dirname, 'music', 'start_music.mp3');
  const finalCombinedFilePath = path.join(__dirname, 'output', 'combined_podcast2.mp3');

  console.log('Combining start music with podcast...');
  combineAudioFilesWithConcatFilter([startingMusicPath, combinedPodcastPath], finalCombinedFilePath);

  return finalCombinedFilePath;
}

async function generatePodcastScript(bookTitle, author) {
  const openai = getOpenAIClient();

  // Define the segments or topics to be discussed in the podcast
  const topics = [
    "Discussion on the main theme of the book",
    "Key characters or ideas presented in the book",
    "Important quotes and their implications",
    "How the book relates to current societal issues",
    "Final thoughts and recommendations for readers"
  ];

  let fullScript = "";

  // Generate the initial greeting and the first topic
  const initialPrompt = `
    Generate a podcast transcript discussing the book '${bookTitle}' by '${author}'.
    Start with an introduction where Emma greets the audience and introduces the guest, Michael.
    Then discuss the first topic: ${topics[0]}.
    Requirements:
    1. Emma is the host and Michael is the guest.
    2. Michael should have a humorous tone.
    3. The generated transcript should be at least 500 words.
    4. Do not include "[Opening music plays]" or "[End of transcript]" or any other start or end-of-transcript markers.
    5. Do not include any non-verbal cues like "(laughs)", "(sighs)", "(pauses)", or any similar expressions.
  `;
  const initialResponse = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: initialPrompt }],
  });
  fullScript += initialResponse.choices[0].message.content.trim() + "\n\n";

  // Generate the remaining topics without repetitive greetings
  for (let i = 1; i < topics.length; i++) {
    const prompt = `
      Continue the podcast transcript discussing the book '${bookTitle}'.
      The host Emma should smoothly transition into the next topic: ${topics[i]}.
      Requirements:
      1. Emma should continue without greeting the audience again and should not reintroduce the book. She should start directly with a question about the topic.
      2. The conversation between Emma and Michael should be back-and-forth, focusing on discussing the topic without any transition into ending remarks.
      3. Include specific examples from the book in the conversation.
      4. The generated transcript should be about 150 words.
      5. Do not include any ending greetings, closing remarks, or phrases like "Thank you for listening", "Final thoughts", or "See you next time". The conversation should feel ongoing and leave room for further discussion without implying the end of the podcast.
      6. Do not include any non-verbal cues like "(laughs)", "(sighs)", "(pauses)", or any similar expressions.
      7. The transcript should maintain a conversational tone and flow naturally without wrapping up the discussion.
    `;
  

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
    });

    fullScript += response.choices[0].message.content.trim() + "\n\n";
  }

    // Generate the final thoughts and closing segment separately
    const closingPrompt = `
    Generate the final segment of the podcast discussing the book '${bookTitle}'.
    Emma should ask Michael for his final thoughts on the book and then wrap up the discussion.
    Requirements:
    1. Emma should thank Michael for joining the podcast.
    2. The segment should include a closing statement inviting listeners to suggest books for the next discussion.
    3. The generated transcript should be at most 100 words.
    4. Do not include any non-verbal cues like "(laughs)", "(sighs)", "(pauses)", or any similar expressions.
    5. Do not include "[End of transcript]" or any other end-of-transcript markers.
  `;

    const closingResponse = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: closingPrompt }],
    });

    fullScript += closingResponse.choices[0].message.content.trim() + "\n\n";



  // Add the final question at the end
  fullScript += `
Emma: What book would you like to know about next time?
  `;

  return fullScript;
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
  const endMusicPath = path.join(__dirname, 'music', 'end_music.mp3');
  const finalOutputPath = path.join(__dirname, 'output', 'final_podcast.mp3');

  const durationCommand = `ffprobe -i ${inputFile} -show_entries format=duration -v quiet -of csv="p=0"`;
  const duration = parseFloat(execSync(durationCommand).toString().trim());
  const delay = Math.floor(duration * 990); // Convert to milliseconds
  console.log("Calculated Delay (milliseconds):", delay);

  const command = `ffmpeg -y -i ${inputFile} -i ${endMusicPath} -filter_complex "[1]adelay=${delay}|${delay}[delayed]; [0:a][delayed]amix=inputs=2:duration=longest:dropout_transition=2" -acodec libmp3lame ${finalOutputPath}`;
  execSync(command, { stdio: 'inherit' });

  console.log(`Final podcast with end music saved to ${finalOutputPath}`);
  return finalOutputPath;
}

// Process the script to generate audio files
async function processScript(filePath) {
  const script = fs.readFileSync(filePath, 'utf8');
  const lines = script.split('\n').filter(line => line.trim() !== '');
  let fileIndex = 1;
  const tasks = lines.map(line => async () => {
    const [speaker, ...speechArray] = line.split(':');
    const speech = speechArray.join(':').trim();

    const ttsRequest = {
      input: { text: speech },
      voice: { languageCode: 'en-US', ssmlGender: speaker.trim() === 'Emma' ? 'FEMALE' : 'MALE', name: speaker.trim() === 'Emma' ? 'en-US-Journey-F' : 'en-US-Journey-D' },
      audioConfig: { audioEncoding: 'MP3' },
    };

    const outputDir = path.join(__dirname, 'output');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir);
    }

    const fileName = `${speaker.trim().toLowerCase()}_${fileIndex}.mp3`;
    const filePath = path.join(outputDir, fileName);
    fileIndex++;

    const [ttsResponse] = await ttsClient.synthesizeSpeech(ttsRequest);
    await util.promisify(fs.writeFile)(filePath, ttsResponse.audioContent, 'binary');
    console.log(`Generated ${fileName}`);
    return filePath;
  });

  const filePaths = await Promise.all(tasks.map(task => task()));
  return filePaths;
}

function cleanUpScript(script) {
  // Remove lines with just "---"
  let cleanedScript = script.split('\n').filter(line => line.trim() !== '---').join('\n');

  cleanedScript = cleanedScript.replace(/Michael|any_other_host_name/g, 'Michael');

  return cleanedScript;
}

// Combine multiple audio files into one
function combineAudioFiles(filePaths, outputFile) {
  const command = `ffmpeg -y -i "concat:${filePaths.join('|')}" -acodec copy ${outputFile}`;
  execSync(command, { stdio: 'inherit' });
  console.log(`Combined audio saved to ${outputFile}`);
}

// Combine audio files using concat filter
function combineAudioFilesWithConcatFilter(inputFiles, outputFile) {
  const concatFilter = inputFiles.map(file => `-i ${file}`).join(' ');
  const filterComplex = `-filter_complex "[0:0][1:0]concat=n=${inputFiles.length}:v=0:a=1[out]" -map "[out]"`;
  
  const command = `ffmpeg -y ${concatFilter} ${filterComplex} -acodec libmp3lame ${outputFile}`;
  
  execSync(command, { stdio: 'inherit' });
  console.log(`Combined audio saved to ${outputFile}`);
}

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});