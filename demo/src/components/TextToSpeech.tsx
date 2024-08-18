import React, { useState } from 'react';

const TextToSpeech: React.FC = () => {
  const [text, setText] = useState('');
  const [author, setAuthor] = useState('');
  const [speaking, setSpeaking] = useState(false);
  const [audioUrl, setAudioUrl] = useState('');
  const [processing, setProcessing] = useState(false);
  const [combinedAudioUrl, setCombinedAudioUrl] = useState('');
  const [generating, setGenerating] = useState(false);

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(event.target.value);
  };

  const handleAuthorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAuthor(event.target.value);
  };



  const speak = async () => {
    if (!speaking) {
      setSpeaking(true);
      const response = await fetch('http://localhost:3001/synthesize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: text, author: author }),
      });

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);

      const audio = new Audio(url);
      audio.onended = () => {
        setSpeaking(false);
      };
      audio.play();
    } else {
      setSpeaking(false);
    }
  };

  const generateScript = async () => {
    if (!generating) {
      setGenerating(true);
      const response = await fetch('http://localhost:3001/generate_script', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: text, author: author }), // Send text, title, and author to backend
      });

    }
  };

  const combineMusic = async () => {
    if (!processing) {
      setProcessing(true);
      const response = await fetch('http://localhost:3001/combine_music', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}), // You can pass additional data if needed
      });

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setCombinedAudioUrl(url);
      setProcessing(false);
    }
  };

  const generateAudioFragment = async () => {
    if (!processing) {
      setProcessing(true);
      const response = await fetch('http://localhost:3001/generate_audio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);
      setProcessing(false);
    }
  };



  return (
    <div>
      <textarea
        value={text}
        onChange={handleInputChange}
        placeholder="Enter text to read"
        rows={5}
        cols={40}
      />
      <br />
      <input
        value={author}
        onChange={handleAuthorChange}
        placeholder="Enter author name"
      />
      <br />
      <button onClick={speak}>
        {speaking ? 'Stop' : 'Speak'}
      </button>
      <button onClick={combineMusic} disabled={processing}>
        {processing ? 'Processing...' : 'Combine Music'}
      </button>
      <button onClick={generateAudioFragment} disabled={processing}>
        {processing ? 'Generating...' : 'Generate Audio Fregment'}
      </button>
      <button onClick={generateScript} disabled={generating}>
        {generating ? 'Generating...' : 'Generate Script'}
      </button>
      {audioUrl && <audio src={audioUrl} controls />}
    </div>
  );
};

export default TextToSpeech;
