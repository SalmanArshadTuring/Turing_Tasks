import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

// Simple word cloud implementation
const WordCloud = ({ words }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    words.forEach((word) => {
      const fontSize = Math.min(100, Math.max(12, word.count * 5));
      ctx.font = `${fontSize}px Arial`;
      ctx.fillStyle = `hsl(${Math.random() * 360}, 70%, 50%)`;
      
      const x = Math.random() * (width - ctx.measureText(word.text).width);
      const y = Math.random() * (height - fontSize) + fontSize;
      
      ctx.fillText(word.text, x, y);
    });
  }, [words]);

  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={600}
      className="w-full h-auto border border-gray-300 rounded-lg"
    />
  );
};

export default function App() {
  const [file, setFile] = useState(null);
  const [wordCloud, setWordCloud] = useState([]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const processFile = () => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      const words = text.toLowerCase().match(/\b\w+\b/g);
      const wordCount = {};

      words.forEach((word) => {
        if (word.length > 3) {
          wordCount[word] = (wordCount[word] || 0) + 1;
        }
      });

      const sortedWords = Object.entries(wordCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 100)
        .map(([text, count]) => ({ text, count }));

      setWordCloud(sortedWords);
    };

    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Word Cloud Generator
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
              <Input
                type="file"
                accept=".txt"
                onChange={handleFileChange}
                className="flex-grow"
              />
              <Button onClick={processFile} disabled={!file}>
                Generate Word Cloud
              </Button>
            </div>
            {wordCloud.length > 0 && <WordCloud words={wordCloud} />}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}