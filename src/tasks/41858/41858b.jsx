import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";

const keywordList = [
  "react", "javascript", "typescript", "node.js", "python", "java", "c++",
  "sql", "mongodb", "aws", "docker", "kubernetes", "agile", "scrum"
];

const grammarRules = [
  { regex: /\b(its|it's)\b/g, correct: "its/it's" },
  { regex: /\b(your|you're)\b/g, correct: "your/you're" },
  { regex: /\b(their|there|they're)\b/g, correct: "their/there/they're" },
];

function KeywordAnalysis({ keywords }) {
  return (
    <div className="mt-4">
      <h3 className="text-lg font-semibold mb-2">Keyword Analysis</h3>
      <div className="flex flex-wrap gap-2">
        {keywords.map((keyword, index) => (
          <Badge key={index} variant="secondary">{keyword}</Badge>
        ))}
      </div>
    </div>
  );
}

function GrammarFeedback({ issues }) {
  return (
    <div className="mt-4">
      <h3 className="text-lg font-semibold mb-2">Grammar Issues</h3>
      <ul className="list-disc pl-5">
        {issues.map((issue, index) => (
          <li key={index}>{issue}</li>
        ))}
      </ul>
    </div>
  );
}

function ScoreDisplay({ score }) {
  return (
    <div className="mt-4">
      <h3 className="text-lg font-semibold mb-2">Resume Score</h3>
      <Progress value={score} className="w-full" />
      <p className="text-sm text-gray-600 mt-1">{score}% - {getScoreLabel(score)}</p>
    </div>
  );
}

function getScoreLabel(score) {
  if (score >= 90) return "Excellent";
  if (score >= 70) return "Good";
  if (score >= 50) return "Average";
  return "Needs Improvement";
}

function ResumeAnalyzer() {
  const [resumeText, setResumeText] = useState("");
  const [analysis, setAnalysis] = useState(null);

  const analyzeResume = () => {
    const keywords = keywordList.filter(keyword => 
      new RegExp(`\\b${keyword}\\b`, "i").test(resumeText)
    );

    const grammarIssues = grammarRules
      .filter(rule => rule.regex.test(resumeText))
      .map(rule => `Check usage of "${rule.correct}"`);

    const score = calculateScore(keywords.length, grammarIssues.length);

    setAnalysis({ keywords, grammarIssues, score });
  };

  const calculateScore = (keywordCount, issueCount) => {
    const baseScore = (keywordCount / keywordList.length) * 100;
    const penaltyPerIssue = 5;
    return Math.max(0, Math.min(100, baseScore - (issueCount * penaltyPerIssue)));
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Resume Analyzer</CardTitle>
        <CardDescription>Upload your resume for analysis and feedback</CardDescription>
      </CardHeader>
      <CardContent>
        <Textarea
          placeholder="Paste your resume text here..."
          value={resumeText}
          onChange={(e) => setResumeText(e.target.value)}
          className="min-h-[200px]"
        />
        <Button onClick={analyzeResume} className="mt-4">Analyze Resume</Button>
        
        {analysis && (
          <div className="mt-6">
            <KeywordAnalysis keywords={analysis.keywords} />
            <GrammarFeedback issues={analysis.grammarIssues} />
            <ScoreDisplay score={analysis.score} />
          </div>
        )}
      </CardContent>
      <CardFooter>
        <p className="text-sm text-gray-500">
          This analysis is automated and may not catch all issues. Always review your resume carefully.
        </p>
      </CardFooter>
    </Card>
  );
}

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <ResumeAnalyzer />
    </div>
  );
}