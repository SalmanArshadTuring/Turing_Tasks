import React, { useState, useEffect } from 'react';
import {  Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

function JobSearch() {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');
  const [salaryRange, setSalaryRange] = useState([0, 100000]);
  const [jobType, setJobType] = useState('');
  const [favorites, setFavorites] = useState(() => {
    const savedFavs = localStorage.getItem('jobFavorites');
    return savedFavs ? JSON.parse(savedFavs) : [];
  });

  useEffect(() => {
    localStorage.setItem('jobFavorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    const mockJobs = [
      { id: 1, title: "Software Engineer", company: "Tech Corp", location: "New York", salary: 90000, type: "Full-time" },
      { id: 2, title: "UX Designer", company: "Design Co", location: "San Francisco", salary: 85000, type: "Part-time" },
      // Add more mock jobs here...
    ];
    setJobs(mockJobs);
    setFilteredJobs(mockJobs);
  }, []);

  const applyFilters = () => {
    let result = jobs.filter(job => 
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      job.location.toLowerCase().includes(location.toLowerCase()) &&
      job.salary >= salaryRange[0] && job.salary <= salaryRange[1] &&
      (jobType === '' || job.type === jobType)
    );
    setFilteredJobs(result);
  };

  const toggleFavorite = (jobId) => {
    setFavorites(prev => {
      if (prev.includes(jobId)) {
        return prev.filter(id => id !== jobId);
      } else {
        return [...prev, jobId];
      }
    });
  };

  const JobCard = ({ job, status, onStatusChange }) => (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>{job.title}</CardTitle>
        <CardDescription>{job.company} - {job.location}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Salary: ${job.salary}</p>
        <p>Type: {job.type}</p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Checkbox checked={favorites.includes(job.id)} onChange={() => toggleFavorite(job.id)}>Favorite</Checkbox>
        <select value={status} onChange={(e) => onStatusChange(job.id, e.target.value)}>
          <option value="not-applied">Not Applied</option>
          <option value="applied">Applied</option>
          <option value="interview">Interview</option>
          <option value="offered">Offered</option>
          <option value="rejected">Rejected</option>
        </select>
      </CardFooter>
    </Card>
  );

  return (
    <div className="container mx-auto p-4 sm:p-6">
      <div className="filter-section mb-6">
        <Input 
          placeholder="Search job titles..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-2"
        />
        <Input 
          placeholder="Location" 
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="mb-2"
        />
        <div className="mb-2">
          <Label>Salary Range: ${salaryRange[0]} - ${salaryRange[1]}</Label>
          <Slider 
            value={salaryRange} 
            onValueChange={setSalaryRange} 
            max={150000}
            step={5000}
          />
        </div>
        <Input 
          placeholder="Job Type (e.g., Full-time)"
          value={jobType}
          onChange={(e) => setJobType(e.target.value)}
          className="mb-2"
        />
        <Button onClick={applyFilters}>Apply Filters</Button>
      </div>
      <div className="job-list">
        {filteredJobs.map(job => (
          <JobCard 
            key={job.id} 
            job={job} 
            status={favorites.includes(job.id) ? 'applied' : 'not-applied'}
            onStatusChange={(id, status) => console.log(`Status changed for ${id} to ${status}`)}
          />
        ))}
      </div>
      <div className="summary mt-8">
        <h2 className="text-xl mb-4">Favorites Summary</h2>
        {favorites.map(favId => {
          const job = jobs.find(j => j.id === favId);
          return job ? <p key={favId}>{job.title} - {job.status || 'Not Applied'}</p> : null;
        })}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="p-4 sm:p-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center">Job Search Dashboard</h1>
        <JobSearch />
      </div>
    </div>
  );
}