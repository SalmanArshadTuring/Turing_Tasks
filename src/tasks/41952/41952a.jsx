import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

function VoiceRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioChunks, setAudioChunks] = useState([]);
  const audioRef = useRef(null);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);
    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        setAudioChunks(prev => [...prev, e.data]);
      }
    };
    recorder.onstop = () => {
      const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
      const audioUrl = URL.createObjectURL(audioBlob);
      audioRef.current.src = audioUrl;
      audioRef.current.controls = true;
    };
    recorder.start();
    setIsRecording(true);
    setMediaRecorder(recorder);
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
      mediaRecorder.stop();
      setIsRecording(false);
      setAudioChunks([]);
    }
  };

  return (
    <div>
      <Button onClick={isRecording ? stopRecording : startRecording}>
        {isRecording ? 'Stop Recording' : 'Start Recording'}
      </Button>
      <audio ref={audioRef} style={{ display: 'block', marginTop: '10px' }} />
    </div>
  );
}

function TranscriptionEditor({ transcription, setTranscription }) {
  return (
    <Textarea 
      value={transcription} 
      onChange={(e) => setTranscription(e.target.value)} 
      placeholder="Your transcription will appear here..."
    />
  );
}

function ExportButton({ text }) {
  const handleExport = () => {
    const element = document.createElement('a');
    const file = new Blob([text], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = "transcription.txt";
    document.body.appendChild(element); 
    element.click();
    document.body.removeChild(element);
  };

  return <Button onClick={handleExport}>Export Text</Button>;
}

export default function App() {
  const [transcription, setTranscription] = useState("");

  // This is a placeholder for actual transcription logic
  const fakeTranscribe = () => {
    setTranscription("This is a mock transcription of what was just recorded. Edit as necessary.");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-100 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md sm:max-w-lg">
        <CardHeader>
          <CardTitle>Voice Memo Recorder & Transcription</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <VoiceRecorder />
          <Button onClick={fakeTranscribe} disabled={transcription !== ""}>Transcribe</Button>
          <TranscriptionEditor transcription={transcription} setTranscription={setTranscription} />
        </CardContent>
        <CardContent>
          <ExportButton text={transcription} />
        </CardContent>
      </Card>
    </div>
  );
}