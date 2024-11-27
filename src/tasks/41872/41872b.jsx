import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

// Syntax highlighting would typically be handled by a library like prism.js or highlight.js
// Here, we'll simulate it with simple text coloring
const syntaxHighlight = (code, language) => {
  const color = language === 'javascript' ? 'text-yellow-500' : language === 'python' ? 'text-blue-500' : 'text-gray-500';
  return <pre className={`language-${language} ${color}`}>{code}</pre>;
};

function SnippetCard({ snippet, onDelete }) {
  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>{snippet.title}</CardTitle>
        <CardDescription>{snippet.language}</CardDescription>
      </CardHeader>
      <CardContent>
        {syntaxHighlight(snippet.code, snippet.language)}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="destructive" onClick={() => onDelete(snippet.id)}>Delete</Button>
      </CardFooter>
    </Card>
  );
}

function AddSnippetForm({ onAddSnippet }) {
  const [title, setTitle] = useState('');
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title && code) {
      onAddSnippet({ title, code, language, id: Date.now() });
      setTitle('');
      setCode('');
      setLanguage('javascript');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8">
      <div className="space-y-4">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <div>
          <Label htmlFor="code">Code</Label>
          <Textarea id="code" value={code} onChange={(e) => setCode(e.target.value)} required className="h-48" />
        </div>
        <div>
          <Label htmlFor="language">Language</Label>
          <select 
            id="language" 
            value={language} 
            onChange={(e) => setLanguage(e.target.value)} 
            className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
          >
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
          </select>
        </div>
        <Button type="submit">Add Snippet</Button>
      </div>
    </form>
  );
}

export default function App() {
  const [snippets, setSnippets] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const storedSnippets = JSON.parse(localStorage.getItem('codeSnippets') || '[]');
    setSnippets(storedSnippets);
  }, []);

  useEffect(() => {
    localStorage.setItem('codeSnippets', JSON.stringify(snippets));
  }, [snippets]);

  const addSnippet = (snippet) => {
    setSnippets([...snippets, snippet]);
  };

  const deleteSnippet = (id) => {
    setSnippets(snippets.filter(snippet => snippet.id !== id));
  };

  const filteredSnippets = snippets.filter(snippet => 
    snippet.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    snippet.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-4 sm:p-6">
      <h1 className="text-2xl font-bold mb-6">Code Snippet Manager</h1>
      <Input 
        placeholder="Search snippets..." 
        value={searchTerm} 
        onChange={(e) => setSearchTerm(e.target.value)} 
        className="mb-4 w-full sm:w-1/2"
      />
      <AddSnippetForm onAddSnippet={addSnippet} />
      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {filteredSnippets.map(snippet => (
          <SnippetCard key={snippet.id} snippet={snippet} onDelete={deleteSnippet} />
        ))}
      </div>
      {filteredSnippets.length === 0 && <p className="text-center text-gray-500">No snippets found.</p>}
    </div>
  );
}