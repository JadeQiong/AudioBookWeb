const textToSpeech = require('@google-cloud/text-to-speech');
const client = new textToSpeech.TextToSpeechClient();

async function testGoogleCloudCredentials() {
  const request = {
    input: { text: 'Hello, world!' },
    voice: { languageCode: 'en-US', ssmlGender: 'NEUTRAL' },
    audioConfig: { audioEncoding: 'MP3' },
  };

  try {
    const [response] = await client.synthesizeSpeech(request);
    if (response.audioContent) {
      console.log('Google Cloud credentials are working correctly.');
    } else {
      console.error('Failed to generate audio content.');
    }
  } catch (error) {
    console.error('Error during Google Cloud API call:', error);
  }
}

testGoogleCloudCredentials();
