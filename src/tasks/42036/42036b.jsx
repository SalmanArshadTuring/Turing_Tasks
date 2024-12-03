import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const countriesData = [
  // Dummy data for demonstration
  { name: "China", population: 1439323776, growthRate: 0.39, density: 153 },
  { name: "India", population: 1380004385, growthRate: 0.99, density: 464 },
  // More countries...
];

export default function App() {
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [filterYears, setFilterYears] = useState({ from: 2010, to: 2020 });
  const [sortBy, setSortBy] = useState('population');

  const addCountry = (country) => {
    if (!selectedCountries.some(c => c.name === country.name)) {
      setSelectedCountries(prev => [...prev, country]);
    }
  };

  const removeCountry = (countryName) => {
    setSelectedCountries(selectedCountries.filter(c => c.name !== countryName));
  };

  const filteredData = countriesData.filter(country => 
    country.year >= filterYears.from && country.year <= filterYears.to
  );

  const sortedData = [...filteredData].sort((a, b) => b[sortBy] - a[sortBy]);

  const globalStats = {
    totalPopulation: filteredData.reduce((sum, c) => sum + c.population, 0),
    avgGrowthRate: filteredData.reduce((sum, c) => sum + c.growthRate, 0) / filteredData.length,
  };

  const exportData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(selectedCountries));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href",     dataStr);
    downloadAnchorNode.setAttribute("download", "population_data.json");
    document.body.appendChild(downloadAnchorNode); 
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  return (
    <div className="container mx-auto p-4 sm:p-6">
      <Card>
        <CardHeader>
          <CardTitle>World Population Growth Visualizer</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Input 
              type="number" 
              placeholder="From Year" 
              value={filterYears.from} 
              onChange={(e) => setFilterYears({...filterYears, from: Number(e.target.value)})} 
            />
            <Input 
              type="number"              placeholder="To Year" 
              value={filterYears.to} 
              onChange={(e) => setFilterYears({...filterYears, to: Number(e.target.value)})} 
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">Sort By</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Sort Options</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setSortBy('population')}>Population</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('growthRate')}>Growth Rate</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('density')}>Density</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {sortedData.map(country => (
              <Card key={country.name} className="cursor-pointer" onClick={() => addCountry(country)}>
                <CardContent>
                  <p>{country.name}</p>
                  <p>Population: {country.population.toLocaleString()}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">Selected Countries</h3>
            {selectedCountries.map(country => (
              <Card key={country.name} className="mb-2">
                <CardContent>
                  <div className="flex justify-between items-center">
                    <span>{country.name}</span>
                    <Button onClick={() => removeCountry(country.name)} variant="destructive">Remove</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <Button onClick={exportData}>Export Data</Button>
        </CardContent>
        <CardFooter>
          <p>Global Population: {globalStats.totalPopulation.toLocaleString()}</p>
          <p>Average Growth Rate: {globalStats.avgGrowthRate.toFixed(2)}%</p>
        </CardFooter>
      </Card>
    </div>
  );
}