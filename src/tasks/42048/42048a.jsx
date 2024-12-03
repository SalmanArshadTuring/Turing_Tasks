import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const jobTypes = ["Full-time", "Part-time", "Contract", "Remote"];
const applicationStatuses = ["Saved", "Applied", "Interview", "Offered", "Rejected"];

const JobCard = ({ job, onSave, onStatusChange, isSaved }) => (
  <Card className="mb-4">
    <CardHeader>
      <CardTitle className="text-lg font-bold">{job.title}</CardTitle>
      <p className="text-sm text-gray-500">{job.company}</p>
    </CardHeader>
    <CardContent>
      <p className="mb-2">{job.description}</p>
      <div className="flex flex-wrap gap-2 mb-2">
        <Badge>{job.location}</Badge>
        <Badge>{job.type}</Badge>
        <Badge>${job.salary.toLocaleString()}</Badge>
      </div>
      {isSaved ? (
        <Select
          onValueChange={(value) => onStatusChange(job.id, value)}
          defaultValue={job.status || applicationStatuses[0]} // Default to a valid status
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Update status" />
          </SelectTrigger>
          <SelectContent>
            {applicationStatuses.map((status) => (
              <SelectItem key={status} value={status}>
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : (
        <Button onClick={() => onSave(job)}>Save Job</Button>
      )}
    </CardContent>
  </Card>
);

const JobSearchDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [filters, setFilters] = useState({
    location: "",
    salary: [0, 200000],
    type: "",
  });

  useEffect(() => {
    const fetchedJobs = [
      { id: 1, title: "Software Engineer", company: "TechCorp", description: "Developing web applications", location: "New York", type: "Full-time", salary: 120000 },
      { id: 2, title: "Data Analyst", company: "DataInc", description: "Analyzing business data", location: "San Francisco", type: "Full-time", salary: 90000 },
      { id: 3, title: "UX Designer", company: "DesignStudio", description: "Creating user-friendly interfaces", location: "Remote", type: "Contract", salary: 80000 },
      { id: 4, title: "Marketing Specialist", company: "MarketPro", description: "Managing digital marketing campaigns", location: "Chicago", type: "Part-time", salary: 60000 },
    ];
    setJobs(fetchedJobs);
  }, []);

  const filteredJobs = jobs.filter((job) => {
    return (
      job.location.toLowerCase().includes(filters.location.toLowerCase()) &&
      job.salary >= filters.salary[0] &&
      job.salary <= filters.salary[1] &&
      (filters.type === "" || job.type === filters.type)
    );
  });

  const handleSaveJob = (job) => {
    setSavedJobs([...savedJobs, { ...job, status: "Saved" }]);
  };

  const handleStatusChange = (jobId, newStatus) => {
    setSavedJobs(
      savedJobs.map((job) => (job.id === jobId ? { ...job, status: newStatus } : job))
    );
  };

  const renderJobCards = (jobList, isSaved = false) => (
    <div className="space-y-4">
      {jobList.map((job) => (
        <JobCard
          key={job.id}
          job={job}
          onSave={handleSaveJob}
          onStatusChange={handleStatusChange}
          isSaved={isSaved}
        />
      ))}
    </div>
  );

  const renderSummary = () => {
    const summary = applicationStatuses.map((status) => ({
      status,
      count: savedJobs.filter((job) => job.status === status).length,
    }));

    return (
      <Card>
        <CardHeader>
          <CardTitle>Application Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-5">
            {summary.map(({ status, count }) => (
              <div key={status} className="text-center">
                <p className="font-semibold">{status}</p>
                <p className="text-2xl font-bold">{count}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Job Search Dashboard</h1>
      <div className="grid gap-4 mb-6 sm:grid-cols-2 lg:grid-cols-4">
        <Input
          placeholder="Location"
          value={filters.location}
          onChange={(e) => setFilters({ ...filters, location: e.target.value })}
        />
        <div>
          <p className="mb-2">Salary Range: ${filters.salary[0].toLocaleString()} - ${filters.salary[1].toLocaleString()}</p>
          <Slider
            min={0}
            max={200000}
            step={10000}
            value={filters.salary}
            onValueChange={(value) => setFilters({ ...filters, salary: value })}
          />
        </div>
        <Select
          onValueChange={(value) => setFilters({ ...filters, type: value })}
          defaultValue={filters.type || "All Types"}
        >
          <SelectTrigger>
            <SelectValue placeholder="Job Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All Types">All Types</SelectItem>
            {jobTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Tabs defaultValue="search">
        <TabsList className="mb-4">
          <TabsTrigger value="search">Search Jobs</TabsTrigger>
          <TabsTrigger value="saved">Saved Jobs</TabsTrigger>
        </TabsList>
        <TabsContent value="search">
          <h2 className="text-2xl font-semibold mb-4">Search Results</h2>
          {renderJobCards(filteredJobs)}
        </TabsContent>
        <TabsContent value="saved">
          <h2 className="text-2xl font-semibold mb-4">Saved Jobs</h2>
          {renderSummary()}
          <div className="mt-6">{renderJobCards(savedJobs, true)}</div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default function App() {
  return <JobSearchDashboard />;
}
