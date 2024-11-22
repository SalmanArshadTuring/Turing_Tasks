import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// Dummy data for periodic elements. In a real app, this would come from an API or a more comprehensive dataset.
const elements = [
  { atomicNumber: 1, symbol: 'H', name: 'Hydrogen', group: 'Nonmetal' },
  { atomicNumber: 2, symbol: 'He', name: 'Helium', group: 'Noble gas' },
  // ... Add more elements here or fetch from an API
  { atomicNumber: 118, symbol: 'Og', name: 'Oganesson', group: 'Noble gas' }
];

function ElementCard({ element }) {
  return (
    <Card className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 p-2">
      <CardHeader>
        <CardTitle>{element.atomicNumber}</CardTitle>
      </CardHeader>
      <CardContent className="text-center">
        <div className="text-2xl font-bold">{element.symbol}</div>
        <div>{element.name}</div>
      </CardContent>
    </Card>
  );
}

function ElementDetail({ element, onClose }) {
  return (
    <Card className="fixed inset-4 sm:inset-10 bg-white shadow-lg">
      <CardHeader>
        <CardTitle>{element.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Atomic Number: {element.atomicNumber}</p>
        <p>Symbol: {element.symbol}</p>
        <p>Group: {element.group}</p>
      </CardContent>
      <Button onClick={onClose} className="mt-4">Close</Button>
    </Card>
  );
}

export default function App() {
  const [search, setSearch] = useState('');
  const [selectedElement, setSelectedElement] = useState(null);
  const [filteredElements, setFilteredElements] = useState(elements);

  useEffect(() => {
    const results = elements.filter(element => 
      element.name.toLowerCase().includes(search.toLowerCase()) || 
      element.symbol.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredElements(results);
  }, [search]);

  const handleSearch = (event) => {
    setSearch(event.target.value);
  };

  const groupColors = {
    'Noble gas': 'bg-purple-200',
    'Nonmetal': 'bg-green-200',
    'Alkali metal': 'bg-red-200',
    // Add more groups as needed
  };

  return (
    <div className="p-4 space-y-4">
      <Input 
        placeholder="Search for an element..." 
        value={search} 
        onChange={handleSearch} 
        className="mb-4"
      />
      <div className="flex flex-wrap gap-4">
        {filteredElements.map(element => (
          <div 
            key={element.atomicNumber} 
            onClick={() => setSelectedElement(element)}
            className={`cursor-pointer ${groupColors[element.group] || 'bg-gray-200'} p-2 rounded transition-colors hover:bg-opacity-75`}
          >
            <ElementCard element={element} />
          </div>
        ))}
      </div>
      {selectedElement && (
        <ElementDetail 
          element={selectedElement} 
          onClose={() => setSelectedElement(null)} 
        />
      )}
    </div>
  );
}