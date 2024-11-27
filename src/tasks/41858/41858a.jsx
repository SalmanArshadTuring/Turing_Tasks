import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

function ResumeAnalyzer() {
  const [resumeText, setResumeText] = useState('');
  const [analysis, setAnalysis] = useState({ score: 0, feedback: '', keywords: [] });
  const [isLoading, setIsLoading] = useState(false);

  const analyzeResume = () => {
    setIsLoading(true);
    // Simulate API call or complex logic for resume analysis
    setTimeout(() => {
      const mockKeywords = ['JavaScript', 'React', 'Node.js', 'Tailwind'];
      const mockScore = Math.floor(Math.random() * 100);
      const mockFeedback = "Your resume could benefit from more details on project outcomes. Also, consider adding more industry-specific keywords.";
      
      setAnalysis({
        score: mockScore,
        feedback: mockFeedback,
        keywords: mockKeywords,
      });
      setIsLoading(false);
    }, 1500);
  };

  return (
    <Card className="max-w-lg mx-auto mt-10 p-6 shadow-xl sm:w-full">
      <CardHeader>
        <CardTitle>Resume Analyzer</CardTitle>
      </CardHeader>
      <CardContent>
        <Textarea 
          placeholder="Paste your resume text here..." 
          value={resumeText} 
          onChange={(e) => setResumeText(e.target.value)}
          className="mb-4 h-48"
        />
        <Button onClick={analyzeResume} disabled={isLoading}>
          {isLoading ? 'Analyzing...' : 'Analyze Resume'}
        </Button>

        {analysis.score > 0 && (
          <div className="mt-6">
            <h2 className="text-xl font-bold mb-2">Analysis Results</h2>
            <p>Score: {analysis.score}/100</p>
            <p className="mt-2">Feedback: {analysis.feedback}</p>
            <div className="mt-2">
              <p>Detected Keywords:</p>
              <ul className="list-disc pl-5">
                {analysis.keywords.map((kw, idx) => <li key={idx}>{kw}</li>)}
              </ul>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-start p-4">
      <h1 className="text-2xl font-bold mb-5 sm:text-center">Interactive Resume Analyzer</h1>
      <ResumeAnalyzer />
    </div>
  );
}