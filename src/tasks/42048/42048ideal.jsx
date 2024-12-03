import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function App() {
  // Mock job data
  const initialJobs = [
    {
      id: 1,
      title: 'Software Engineer',
      company: 'Tech Corp',
      location: 'New York',
      salary: 120000,
      jobType: 'Full-time',
      description: 'Develop and maintain software applications.',
    },
    {
      id: 2,
      title: 'Data Scientist',
      company: 'Data Inc',
      location: 'San Francisco',
      salary: 140000,
      jobType: 'Full-time',
      description: 'Analyze data and build predictive models.',
    },
    {
      id: 3,
      title: 'Web Developer',
      company: 'Web Solutions',
      location: 'Remote',
      salary: 80000,
      jobType: 'Contract',
      description: 'Create and maintain websites.',
    },
    {
      id: 4,
      title: 'Project Manager',
      company: 'Business Co',
      location: 'Chicago',
      salary: 90000,
      jobType: 'Part-time',
      description: 'Manage projects and coordinate teams.',
    },
    {
      id: 5,
      title: 'UX Designer',
      company: 'Design Studio',
      location: 'Seattle',
      salary: 100000,
      jobType: 'Full-time',
      description: 'Design user interfaces and experiences.',
    },
    {
      id: 6,
      title: 'DevOps Engineer',
      company: 'Cloud Services',
      location: 'Austin',
      salary: 115000,
      jobType: 'Full-time',
      description: 'Manage infrastructure and deployment pipelines.',
    },
  ];

  const [jobs, setJobs] = useState(initialJobs);

  // State for filters
  const [filters, setFilters] = useState({
    location: '',
    salaryRange: [0, 200000],
    jobType: '',
  });

  // State for filtered jobs
  const [filteredJobs, setFilteredJobs] = useState(jobs);

  // State for favorites
  const [favorites, setFavorites] = useState([]);

  // State for application statuses
  const [applicationStatuses, setApplicationStatuses] = useState({});

  // Effect to filter jobs whenever filters change
  useEffect(() => {
    const results = jobs.filter((job) => {
      const matchesLocation = job.location
        .toLowerCase()
        .includes(filters.location.toLowerCase());
      const matchesSalary =
        job.salary >= filters.salaryRange[0] &&
        job.salary <= filters.salaryRange[1];
      const matchesJobType = filters.jobType
        ? job.jobType === filters.jobType
        : true;
      return matchesLocation && matchesSalary && matchesJobType;
    });
    setFilteredJobs(results);
  }, [filters, jobs]);

  // Handler functions
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    if (name === 'salaryMin') {
      setFilters((prev) => ({
        ...prev,
        salaryRange: [Number(value), prev.salaryRange[1]],
      }));
    } else if (name === 'salaryMax') {
      setFilters((prev) => ({
        ...prev,
        salaryRange: [prev.salaryRange[0], Number(value)],
      }));
    } else {
      setFilters((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleAddToFavorites = (job) => {
    if (!favorites.some((fav) => fav.id === job.id)) {
      setFavorites([...favorites, job]);
    }
  };

  const handleStatusChange = (jobId, status) => {
    setApplicationStatuses((prev) => ({
      ...prev,
      [jobId]: status,
    }));
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Job Search Dashboard</h1>
      <SearchFilters filters={filters} onFilterChange={handleFilterChange} />
      <JobList jobs={filteredJobs} onAddToFavorites={handleAddToFavorites} />
      <FavoritesList
        favorites={favorites}
        applicationStatuses={applicationStatuses}
        onStatusChange={handleStatusChange}
      />
      <Summary favorites={favorites} applicationStatuses={applicationStatuses} />
    </div>
  );
}

function SearchFilters({ filters, onFilterChange }) {
  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>Search Filters</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Location</label>
            <input
              type="text"
              name="location"
              value={filters.location}
              onChange={onFilterChange}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Enter location"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Job Type</label>
            <select
              name="jobType"
              value={filters.jobType}
              onChange={onFilterChange}
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="">All</option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Salary Range</label>
            <div className="flex space-x-2">
              <input
                type="number"
                name="salaryMin"
                value={filters.salaryRange[0]}
                onChange={onFilterChange}
                className="w-1/2 p-2 border border-gray-300 rounded"
                placeholder="Min"
              />
              <input
                type="number"
                name="salaryMax"
                value={filters.salaryRange[1]}
                onChange={onFilterChange}
                className="w-1/2 p-2 border border-gray-300 rounded"
                placeholder="Max"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function JobList({ jobs, onAddToFavorites }) {
  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold mb-2">Job Results</h2>
      {jobs.length === 0 ? (
        <p>No jobs match your search criteria.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} onAddToFavorites={onAddToFavorites} />
          ))}
        </div>
      )}
    </div>
  );
}

function JobCard({ job, onAddToFavorites }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{job.title}</CardTitle>
        <CardDescription>{job.company}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-500 mb-2">
          <strong>Location:</strong> {job.location}
        </p>
        <p className="text-sm text-gray-500 mb-2">
          <strong>Salary:</strong> ${job.salary}
        </p>
        <p className="text-sm text-gray-500 mb-2">
          <strong>Type:</strong> {job.jobType}
        </p>
        <p className="text-sm">{job.description}</p>
      </CardContent>
      <CardFooter>
        <button
          onClick={() => onAddToFavorites(job)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Save to Favorites
        </button>
      </CardFooter>
    </Card>
  );
}

function FavoritesList({ favorites, applicationStatuses, onStatusChange }) {
  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold mb-2">Favorites</h2>
      {favorites.length === 0 ? (
        <p>No favorite jobs saved.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {favorites.map((job) => (
            <Card key={job.id}>
              <CardHeader>
                <CardTitle>{job.title}</CardTitle>
                <CardDescription>{job.company}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 mb-2">
                  <strong>Location:</strong> {job.location}
                </p>
                <p className="text-sm text-gray-500 mb-2">
                  <strong>Salary:</strong> ${job.salary}
                </p>
                <p className="text-sm text-gray-500 mb-2">
                  <strong>Type:</strong> {job.jobType}
                </p>
                <p className="text-sm mb-4">{job.description}</p>
                <label className="block text-sm font-medium mb-1">
                  Application Status
                </label>
                <select
                  value={applicationStatuses[job.id] || ''}
                  onChange={(e) => onStatusChange(job.id, e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                >
                  <option value="">Select Status</option>
                  <option value="Applied">Applied</option>
                  <option value="Interview">Interview</option>
                  <option value="Offered">Offered</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function Summary({ favorites, applicationStatuses }) {
  const statusCounts = favorites.reduce((acc, job) => {
    const status = applicationStatuses[job.id] || 'No Status';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="mt-8 mb-8">
      <h2 className="text-xl font-bold mb-2">Summary</h2>
      {favorites.length === 0 ? (
        <p>No favorite jobs to summarize.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {Object.keys(statusCounts).map((status) => (
            <Card key={status}>
              <CardHeader>
                <CardTitle>{status}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{statusCounts[status]}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
