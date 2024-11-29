import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const AudioRecorder = ({ onRecordingComplete }) => {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
        onRecordingComplete(audioBlob);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error starting recording:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <Button onClick={isRecording ? stopRecording : startRecording}>
        {isRecording ? "Stop Recording" : "Start Recording"}
      </Button>
      {isRecording && <div className="text-red-500">Recording...</div>}
    </div>
  );
};

const TranscriptionEditor = ({ transcription, onTranscriptionChange }) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="transcription">Transcription</Label>
      <Textarea
        id="transcription"
        value={transcription}
        onChange={(e) => onTranscriptionChange(e.target.value)}
        rows={10}
        className="w-full"
      />
    </div>
  );
};

const ExportButton = ({ transcription }) => {
  const handleExport = () => {
    const blob = new Blob([transcription], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "transcription.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return <Button onClick={handleExport}>Export Transcription</Button>;
};

export default function App() {
  const [audioBlob, setAudioBlob] = useState(null);
  const [transcription, setTranscription] = useState("");
  const [isTranscribing, setIsTranscribing] = useState(false);

  const handleRecordingComplete = (blob) => {
    setAudioBlob(blob);
    setIsTranscribing(true);
    // Simulate transcription process
    setTimeout(() => {
      setTranscription("This is a simulated transcription of the recorded audio.");
      setIsTranscribing(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Voice Recording and Transcription App</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <AudioRecorder onRecordingComplete={handleRecordingComplete} />
          {audioBlob && (
            <audio controls src={URL.createObjectURL(audioBlob)} className="w-full" />
          )}
          {isTranscribing && <div className="text-center">Transcribing...</div>}
          {transcription && (
            <>
              <TranscriptionEditor
                transcription={transcription}
                onTranscriptionChange={setTranscription}
              />
              <ExportButton transcription={transcription} />
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}