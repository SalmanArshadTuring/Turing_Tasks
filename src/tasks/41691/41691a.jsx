import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const users = [
  {
    id: 1,
    name: "Alice Johnson",
    avatar: "AJ",
    shortBio: "Software Engineer",
    details: "Passionate about building scalable web applications and exploring new technologies.",
    email: "alice@example.com",
    location: "San Francisco, CA",
    skills: ["React", "Node.js", "GraphQL"]
  },
  {
    id: 2,
    name: "Bob Smith",
    avatar: "BS",
    shortBio: "UX Designer",
    details: "Creating intuitive and beautiful user interfaces for digital products.",
    email: "bob@example.com",
    location: "New York, NY",
    skills: ["UI/UX", "Figma", "Adobe XD"]
  },
  {
    id: 3,
    name: "Carol Davis",
    avatar: "CD",
    shortBio: "Data Scientist",
    details: "Analyzing complex datasets to derive meaningful insights for business decisions.",
    email: "carol@example.com",
    location: "Chicago, IL",
    skills: ["Python", "Machine Learning", "Data Visualization"]
  },
  // Add more users as needed
];

function UserCard({ user }) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
            {user.avatar ? (
              <img
                src={`https://api.dicebear.com/6.x/initials/svg?seed=${user.avatar}`}
                alt={`${user.name}'s avatar`}
                className="w-full h-full rounded-full"
              />
            ) : (
              <span className="text-xl font-semibold text-gray-500">{user.avatar}</span>
            )}
          </div>
          <div>
            <CardTitle>{user.name}</CardTitle>
            <CardDescription>{user.shortBio}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600">{user.details}</p>
        {showDetails && (
          <div className="mt-4">
            <p className="text-sm"><strong>Email:</strong> {user.email}</p>
            <p className="text-sm"><strong>Location:</strong> {user.location}</p>
            <div className="mt-2">
              <strong className="text-sm">Skills:</strong>
              <div className="flex flex-wrap gap-2 mt-1">
                {user.skills.map((skill, index) => (
                  <span key={index} className="px-2 py-1 text-xs bg-gray-200 rounded-full">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button
          onClick={() => setShowDetails(!showDetails)}
          variant="outline"
          className="w-full"
        >
          {showDetails ? "Hide Details" : "View Details"}
        </Button>
      </CardFooter>
    </Card>
  );
}

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">User Profiles</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map((user) => (
            <UserCard key={user.id} user={user} />
          ))}
        </div>
      </div>
    </div>
  );
}
