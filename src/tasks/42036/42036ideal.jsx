import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function App() {
  const [countries, setCountries] = useState([]);
  const [newCountry, setNewCountry] = useState({ name: '', population: '', growthRate: '', density: '' });
  const [timeFilter, setTimeFilter] = useState("all");
  const [sortCriteria, setSortCriteria] = useState("population");

  // Derived global statistics
  const totalPopulation = countries.reduce((sum, c) => sum + parseFloat(c.population || 0), 0);
  const averageGrowthRate =
    countries.length > 0
      ? countries.reduce((sum, c) => sum + parseFloat(c.growthRate || 0), 0) / countries.length
      : 0;

  const addCountry = (e) => {
    e.preventDefault();
    setCountries([
      ...countries,
      { ...newCountry, id: Date.now(), population: parseFloat(newCountry.population) || 0 },
    ]);
    setNewCountry({ name: '', population: '', growthRate: '', density: '' });
  };

  const deleteCountry = (id) => {
    setCountries(countries.filter((c) => c.id !== id));
  };

  const sortedCountries = [...countries].sort((a, b) =>
    sortCriteria === "population"
      ? b.population - a.population
      : sortCriteria === "growthRate"
      ? b.growthRate - a.growthRate
      : b.density - a.density
  );

  const filteredCountries =
    timeFilter === "all"
      ? sortedCountries
      : sortedCountries.filter((c) => {
          const years = parseInt(timeFilter);
          const growth = parseFloat(c.growthRate || 0);
          return growth > 0 && c.population * Math.pow(1 + growth / 100, years) > c.population;
        });

  const exportData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(countries));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "population_data.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  return (
    <div className="container mx-auto p-4 sm:p-8">
      <Card>
        <CardHeader>
          <CardTitle>World Population Growth Visualizer</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={addCountry} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Label>Country Name</Label>
              <Input
                type="text"
                value={newCountry.name}
                onChange={(e) => setNewCountry({ ...newCountry, name: e.target.value })}
                placeholder="Country Name"
                required
              />
            </div>
            <div>
              <Label>Population (in Crores)</Label>
              <Input
                type="number"
                value={newCountry.population}
                onChange={(e) => setNewCountry({ ...newCountry, population: e.target.value })}
                placeholder="Population in Crores"
                required
              />
            </div>
            <div>
              <Label>Growth Rate (%)</Label>
              <Input
                type="number"
                value={newCountry.growthRate}
                onChange={(e) => setNewCountry({ ...newCountry, growthRate: e.target.value })}
                placeholder="Growth Rate"
                required
              />
            </div>
            <div>
              <Label>Density</Label>
              <Input
                type="number"
                value={newCountry.density}
                onChange={(e) => setNewCountry({ ...newCountry, density: e.target.value })}
                placeholder="Density"
                required
              />
            </div>
            <Button type="submit" className="col-span-2 sm:col-span-1">
              Add Country
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Global Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Total Population: {totalPopulation.toFixed(2)} Crores</p>
            <p>Average Growth Rate: {averageGrowthRate.toFixed(2)}%</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Filter & Sort</CardTitle>
          </CardHeader>
          <CardContent>
            <Label>Time Period</Label>
            <select
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
              className="block w-full border border-gray-300 rounded p-2"
            >
              <option value="all">All Time</option>
              <option value="10">Past 10 Years</option>
              <option value="50">Past 50 Years</option>
            </select>
            <Label className="mt-4">Sort By</Label>
            <select
              value={sortCriteria}
              onChange={(e) => setSortCriteria(e.target.value)}
              className="block w-full border border-gray-300 rounded p-2"
            >
              <option value="population">Population</option>
              <option value="growthRate">Growth Rate</option>
              <option value="density">Density</option>
            </select>
          </CardContent>
        </Card>
      </div>

      <div className="mt-4">
        {filteredCountries.map((country) => (
          <Card key={country.id} className="mb-2">
            <CardHeader>
              <CardTitle>{country.name}</CardTitle>
              <CardDescription>
                Population: {country.population.toFixed(2)} Crores, Growth Rate: {country.growthRate}%
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Density: {country.density}</p>
            </CardContent>
            <CardFooter>
              <Button onClick={() => deleteCountry(country.id)}>Remove</Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="mt-4">
        <Label>Visualization</Label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
          {filteredCountries.map((country) => (
            <div key={country.id} className="flex flex-col items-center">
              <div
                style={{
                  height: `${country.population * 10}px`, // Scaled for crores (1 crore = 10 units)
                  width: '50px',
                  backgroundColor: 'rgba(75, 192, 192, 0.6)',
                }}
                className="rounded shadow-lg"
              ></div>
              <span className="mt-2 text-center text-sm">{country.name}</span>
              <span className="text-xs text-gray-500">
                {country.population.toFixed(2)} Crores
              </span>
            </div>
          ))}
        </div>
      </div>

      <Button onClick={exportData} className="mt-4">
        Export Data
      </Button>
    </div>
  );
}
