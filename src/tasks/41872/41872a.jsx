import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const languages = ["JavaScript", "Python", "Java", "C++", "Ruby", "Go", "Rust"];
const categories = ["Algorithm", "Data Structure", "UI/UX", "API", "Database", "Utility"];

const CodeSnippet = ({ snippet, onDelete }) => {
  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>{snippet.title}</CardTitle>
        <CardDescription>{snippet.language} - {snippet.category}</CardDescription>
      </CardHeader>
      <CardContent>
        <pre className="bg-gray-100 p-2 rounded-md overflow-x-auto">
          <code>{snippet.code}</code>
        </pre>
      </CardContent>
      <CardFooter>
        <Button variant="destructive" onClick={() => onDelete(snippet.id)}>Delete</Button>
      </CardFooter>
    </Card>
  );
};

const SnippetForm = ({ onSubmit }) => {
  const [title, setTitle] = useState("");
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("");
  const [category, setCategory] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ title, code, language, category });
    setTitle("");
    setCode("");
    setLanguage("");
    setCategory("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="code">Code</Label>
        <Textarea
          id="code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          required
          className="font-mono"
        />
      </div>
      <div>
        <Label htmlFor="language">Language</Label>
        <Select value={language} onValueChange={setLanguage} required>
          <SelectTrigger id="language">
            <SelectValue placeholder="Select language" />
          </SelectTrigger>
          <SelectContent>
            {languages.map((lang) => (
              <SelectItem key={lang} value={lang}>{lang}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="category">Category</Label>
        <Select value={category} onValueChange={setCategory} required>
          <SelectTrigger id="category">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Button type="submit">Add Snippet</Button>
    </form>
  );
};

export default function App() {
  const [snippets, setSnippets] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredSnippets, setFilteredSnippets] = useState([]);

  useEffect(() => {
    const storedSnippets = JSON.parse(localStorage.getItem("codeSnippets") || "[]");
    setSnippets(storedSnippets);
  }, []);

  useEffect(() => {
    localStorage.setItem("codeSnippets", JSON.stringify(snippets));
    setFilteredSnippets(
      snippets.filter((snippet) =>
        snippet.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        snippet.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        snippet.language.toLowerCase().includes(searchTerm.toLowerCase()) ||
        snippet.category.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [snippets, searchTerm]);

  const addSnippet = (newSnippet) => {
    setSnippets([...snippets, { ...newSnippet, id: Date.now() }]);
  };

  const deleteSnippet = (id) => {
    setSnippets(snippets.filter((snippet) => snippet.id !== id));
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6">Code Snippet Manager</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">Add New Snippet</h2>
          <SnippetForm onSubmit={addSnippet} />
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-4">Search Snippets</h2>
          <Input
            type="text"
            placeholder="Search snippets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-4"
          />
          <div className="space-y-4">
            {filteredSnippets.map((snippet) => (
              <CodeSnippet key={snippet.id} snippet={snippet} onDelete={deleteSnippet} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}