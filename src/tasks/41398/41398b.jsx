import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

// Mock data for quotes
const mockQuotes = [
  { id: 1, text: "To be or not to be", author: "Shakespeare", theme: "Wisdom", sentiment: "Neutral" },
  { id: 2, text: "Love all, trust a few", author: "Shakespeare", theme: "Love", sentiment: "Positive" },
  { id: 3, text: "The only way to do great work is to love what you do", author: "Steve Jobs", theme: "Motivation", sentiment: "Positive" },
  // Add more quotes as needed
];

const themes = ["Wisdom", "Love", "Motivation"];

const sentimentColors = {
  Positive: "bg-green-200",
  Neutral: "bg-yellow-200",
  Negative: "bg-red-200",
};

function BubbleChart({ themes, onThemeClick }) {
  return (
    <div className="flex flex-wrap justify-center gap-4 p-4">
      {themes.map((theme) => (
        <Button
          key={theme}
          onClick={() => onThemeClick(theme)}
          className="rounded-full px-6 py-3 text-lg font-semibold"
        >
          {theme}
        </Button>
      ))}
    </div>
  );
}

function QuoteCard({ quote }) {
  return (
    <Card className={`mb-4 ${sentimentColors[quote.sentiment]}`}>
      <CardHeader>
        <CardTitle>{quote.text}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600">- {quote.author}</p>
        <Badge>{quote.theme}</Badge>
      </CardContent>
    </Card>
  );
}

function QuoteJourney({ quotes, addToJourney, removeFromJourney }) {
  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Quote Journey</h2>
      {quotes.map((quote) => (
        <div key={quote.id} className="flex items-center mb-2">
          <QuoteCard quote={quote} />
          <Button onClick={() => removeFromJourney(quote.id)} className="ml-2">
            Remove
          </Button>
        </div>
      ))}
    </div>
  );
}

function Scrapbook({ quotes, addReflection }) {
  const [reflection, setReflection] = useState("");

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Scrapbook</h2>
      {quotes.map((quote) => (
        <div key={quote.id} className="mb-4">
          <QuoteCard quote={quote} />
          <Input
            placeholder="Add your reflection..."
            value={reflection}
            onChange={(e) => setReflection(e.target.value)}
            className="mt-2"
          />
          <Button onClick={() => addReflection(quote.id, reflection)} className="mt-2">
            Save Reflection
          </Button>
        </div>
      ))}
    </div>
  );
}

export default function App() {
  const [selectedTheme, setSelectedTheme] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [journeyQuotes, setJourneyQuotes] = useState([]);
  const [scrapbookQuotes, setScrapbookQuotes] = useState([]);

  const filteredQuotes = mockQuotes.filter(
    (quote) =>
      (!selectedTheme || quote.theme === selectedTheme) &&
      (quote.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quote.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quote.theme.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const addToJourney = (quote) => {
    if (!journeyQuotes.find((q) => q.id === quote.id)) {
      setJourneyQuotes([...journeyQuotes, quote]);
    }
  };

  const removeFromJourney = (quoteId) => {
    setJourneyQuotes(journeyQuotes.filter((q) => q.id !== quoteId));
  };

  const addToScrapbook = (quote) => {
    if (!scrapbookQuotes.find((q) => q.id === quote.id)) {
      setScrapbookQuotes([...scrapbookQuotes, quote]);
    }
  };

  const addReflection = (quoteId, reflection) => {
    setScrapbookQuotes(
      scrapbookQuotes.map((q) =>
        q.id === quoteId ? { ...q, reflection } : q
      )
    );
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">Quote Explorer</h1>
      <BubbleChart themes={themes} onThemeClick={setSelectedTheme} />
      <Input
        placeholder="Search quotes..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredQuotes.map((quote) => (
          <div key={quote.id}>
            <QuoteCard quote={quote} />
            <div className="flex justify-between mt-2">
              <Button onClick={() => addToJourney(quote)}>Add to Journey</Button>
              <Button onClick={() => addToScrapbook(quote)}>Add to Scrapbook</Button>
            </div>
          </div>
        ))}
      </div>
      <QuoteJourney
        quotes={journeyQuotes}
        addToJourney={addToJourney}
        removeFromJourney={removeFromJourney}
      />
      <Scrapbook quotes={scrapbookQuotes} addReflection={addReflection} />
    </div>
  );
}