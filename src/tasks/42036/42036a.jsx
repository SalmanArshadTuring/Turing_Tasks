import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Mock data (replace with real API data in a production app)
const mockData = {
  countries: [
    { id: 1, name: "China", population: 1439323776, growthRate: 0.39, density: 153 },
    { id: 2, name: "India", population: 1380004385, growthRate: 0.99, density: 464 },
    { id: 3, name: "USA", population: 331002651, growthRate: 0.59, density: 36 },
    // Add more countries...
  ],
  globalStats: {
    totalPopulation: 7794798739,
    averageGrowthRate: 1.05,
    mostPopulous: ["China", "India", "USA"],
  },
};

const Chart = ({ data }) => {
  const maxPopulation = Math.max(...data.map((country) => country.population));

  return (
    <div className="flex h-64 items-end space-x-2">
      {data.map((country) => (
        <div
          key={country.id}
          className="bg-blue-500 w-16 transition-all duration-500 ease-in-out"
          style={{ height: `${(country.population / maxPopulation) * 100}%` }}
        >
          <div className="transform -rotate-90 text-white text-xs mt-2">{country.name}</div>
        </div>
      ))}
    </div>
  );
};

const CountryCard = ({ country, onToggle, isSelected }) => (
  <Card className="mb-4">
    <CardHeader>
      <CardTitle className="flex justify-between items-center">
        <span>{country.name}</span>
        <Button onClick={() => onToggle(country)} variant={isSelected ? "destructive" : "default"}>
          {isSelected ? "Remove" : "Add"}
        </Button>
      </CardTitle>
    </CardHeader>
    <CardContent>
      <p>Population: {country.population.toLocaleString()}</p>
      <p>Growth Rate: {country.growthRate}%</p>
      <p>Density: {country.density} people/km²</p>
    </CardContent>
  </Card>
);

const GlobalStats = ({ stats }) => (
  <Card className="mb-4">
    <CardHeader>
      <CardTitle>Global Statistics</CardTitle>
    </CardHeader>
    <CardContent>
      <p>Total Population: {stats.totalPopulation.toLocaleString()}</p>
      <p>Average Growth Rate: {stats.averageGrowthRate}%</p>
      <p>Most Populous: {stats.mostPopulous.join(", ")}</p>
    </CardContent>
  </Card>
);

export default function App() {
  const [countries, setCountries] = useState(mockData.countries);
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [sortCriteria, setSortCriteria] = useState("population");
  const [filterPeriod, setFilterPeriod] = useState("10");

  useEffect(() => {
    // Sort countries based on criteria
    const sortedCountries = [...countries].sort((a, b) => b[sortCriteria] - a[sortCriteria]);
    setCountries(sortedCountries);
  }, [sortCriteria]);

  const toggleCountry = (country) => {
    setSelectedCountries((prev) =>
      prev.some((c) => c.id === country.id)
        ? prev.filter((c) => c.id !== country.id)
        : [...prev, country]
    );
  };

  const exportData = () => {
    const dataStr = JSON.stringify(selectedCountries, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    const exportFileDefaultName = "population_data.json";

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">World Population Growth Visualizer</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h2 className="text-2xl font-semibold mb-2">Countries</h2>
          <div className="mb-4">
            <Select onValueChange={setSortCriteria}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="population">Population</SelectItem>
                <SelectItem value="growthRate">Growth Rate</SelectItem>
                <SelectItem value="density">Density</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="mb-4">
            <Input
              type="number"
              placeholder="Filter by years"
              value={filterPeriod}
              onChange={(e) => setFilterPeriod(e.target.value)}
            />
          </div>
          {countries.map((country) => (
            <CountryCard
              key={country.id}
              country={country}
              onToggle={toggleCountry}
              isSelected={selectedCountries.some((c) => c.id === country.id)}
            />
          ))}
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-2">Comparison</h2>
          <Chart data={selectedCountries} />
          <Button className="mt-4" onClick={exportData}>
            Export Data
          </Button>
          <GlobalStats stats={mockData.globalStats} />
        </div>
      </div>
    </div>
  );
}