import React, { useState, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader,CardTitle,CardDescription } from "@/components/ui/card";
import WordCloud from 'react-d3-cloud';

const FileUpload = ({ onFileRead }) => {
  const handleFileChange = (e) => {
    const fileReader = new FileReader();
    fileReader.onload = (event) => {
      onFileRead(event.target.result);
    };
    fileReader.readAsText(e.target.files[0]);
  };

  return (
    <div className="flex items-center justify-center w-full">
      <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100">
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <svg aria-hidden="true" className="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
          <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">TXT only</p>
        </div>
        <input id="dropzone-file" type="file" className="hidden" onChange={handleFileChange} accept=".txt" />
      </label>
    </div> 
  );
};

const WordCloudComponent = ({ data }) => {
  const fontSizeMapper = word => Math.log2(word.value) * 5;
  const rotate = word => word.value % 360;

  return (
    <Card className="mt-4 w-full">
      <CardHeader>
        <CardTitle>Word Cloud</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-96 w-full">
          <WordCloud
            data={data}
            fontSizeMapper={fontSizeMapper}
            rotate={rotate}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default function App() {
  const [wordData, setWordData] = useState([]);

  const processText = useCallback((text) => {
    const words = text.toLowerCase().match(/\b\w+\b/g) || [];
    const wordCount = words.reduce((acc, word) => {
      acc[word] = (acc[word] || 0) + 1;
      return acc;
    }, {});

    const data = Object.entries(wordCount).map(([text, value]) => ({
      text, value
    })).sort((a, b) => b.value - a.value).slice(0, 50);

    setWordData(data);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Upload Text File</CardTitle>
            <CardDescription>Create a word cloud from your text file.</CardDescription>
          </CardHeader>
          <CardContent>
            <FileUpload onFileRead={processText} />
          </CardContent>
        </Card>
        {wordData.length > 0 && <WordCloudComponent data={wordData} />}
      </div>
    </div>
  );
}