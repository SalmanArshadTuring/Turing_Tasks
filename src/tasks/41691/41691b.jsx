import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Sample user data
const users = [
  { id: 1, name: "Alice Johnson", avatar: "/avatar1.jpg", bio: "Loves coding and coffee.", details: "Alice is a software developer with a passion for clean code and new technologies." },
  { id: 2, name: "Bob Smith", avatar: "/avatar2.jpg", bio: "Photographer at heart.", details: "Bob specializes in nature photography and spends his weekends hiking." },
  { id: 3, name: "Charlie Brown", avatar: "/avatar3.jpg", bio: "Teacher and tech enthusiast.", details: "Charlie teaches computer science at a local high school." },
];

// UserProfileCard Component
function UserProfileCard({ user }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card className="mb-4 shadow-lg sm:w-full md:w-1/2 lg:w-1/3">
      <CardHeader>
        <CardTitle>{user.name}</CardTitle>
        <div className="mt-2 w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              className="w-full h-full rounded-full"
            />
          ) : (
            <span className="text-xl font-semibold text-gray-500">{user.name[0]}</span>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription>{user.bio}</CardDescription>
        {isExpanded && <p className="mt-2 text-sm">{user.details}</p>}
      </CardContent>
      <CardFooter>
        <Button onClick={() => setIsExpanded(!isExpanded)}>
          {isExpanded ? 'Hide Details' : 'View Details'}
        </Button>
      </CardFooter>
    </Card>
  );
}

// Main App Component
export default function App() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-6">User Profiles</h1>
      <div className="flex flex-wrap gap-4 justify-center">
        {users.map(user => (
          <UserProfileCard key={user.id} user={user} />
        ))}
      </div>
    </div>
  );
}
