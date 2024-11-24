import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const quotes = {
  motivation: [
    { text: "Believe you can and you're halfway there.", sentiment: 'positive' },
    // More quotes...
  ],
  love: [
    { text: "Love is not only something you feel, it is something you do.", sentiment: 'positive' },
    // More quotes...
  ],
  wisdom: [
    { text: "The only true wisdom is in knowing you know nothing.", sentiment: 'neutral' },
    // More quotes...
  ]
};

const sentimentColors = {
  positive: 'bg-green-200',
  neutral: 'bg-yellow-200',
  negative: 'bg-red-200'
};

function Bubble({ theme, onClick }) {
  return (
    <div className="m-2 p-4 rounded-full bg-blue-200 hover:bg-blue-300 cursor-pointer" onClick={() => onClick(theme)}>
      {theme}
    </div>
  );
}

function QuoteCard({ quote, onAddToJourney }) {
  return (
    <Card className={`mb-4 ${sentimentColors[quote.sentiment]}`}>
      <CardHeader>
        <CardTitle>{quote.text}</CardTitle>
      </CardHeader>
      <CardContent>
        <Button onClick={() => onAddToJourney(quote)}>Add to Journey</Button>
      </CardContent>
    </Card>
  );
}

function QuoteJourney({ journey, onRemove }) {
  return (
    <div className="mt-4">
      <h2 className="text-xl mb-2">Your Quote Journey</h2>
      {journey.map((q, index) => (
        <div key={index} className="flex items-center justify-between bg-gray-100 p-2 mb-1">
          <span>{q.text}</span>
          <Button onClick={() => onRemove(index)} variant="destructive">Remove</Button>
        </div>
      ))}
    </div>
  );
}

export default function App() {
  const [selectedTheme, setSelectedTheme] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [journey, setJourney] = useState([]);

  const filteredQuotes = selectedTheme 
    ? quotes[selectedTheme].filter(q => q.text.toLowerCase().includes(searchTerm.toLowerCase()))
    : [];

  const handleAddToJourney = (quote) => {
    if (!journey.some(j => j.text === quote.text)) {
      setJourney([...journey, quote]);
    }
  };

  const handleRemoveFromJourney = (index) => {
    setJourney(journey.filter((_, i) => i !== index));
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Quote Explorer</h1>
      
      {!selectedTheme ? (
        <div className="flex flex-wrap justify-center">
          {Object.keys(quotes).map(theme => (
            <Bubble key={theme} theme={theme} onClick={setSelectedTheme} />
          ))}
        </div>
      ) : (
        <div>
          <Button onClick={() => setSelectedTheme(null)} className="mb-4">Back to Themes</Button>
          <input 
            type="text" 
            placeholder="Search quotes..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-4 p-2 border border-gray-300 rounded w-full sm:w-auto"
          />
          {filteredQuotes.map((quote, idx) => (
            <QuoteCard key={idx} quote={quote} onAddToJourney={handleAddToJourney} />
          ))}
        </div>
      )}
      
      <QuoteJourney journey={journey} onRemove={handleRemoveFromJourney} />
    </div>
  );
}