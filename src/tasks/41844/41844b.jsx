import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardFooter,
} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";

function Scoreboard() {
  const [teams, setTeams] = useState([{ id: 1, name: 'Team A', score: 0, fouls: 0, timeouts: 3 }, { id: 2, name: 'Team B', score: 0, fouls: 0, timeouts: 3 }]);

  const updateTeam = (id, field, value) => {
    setTeams(teams.map(team => 
      team.id === id ? { ...team, [field]: value } : team
    ));
  };

  const addTeam = () => {
    const newId = teams.length ? Math.max(...teams.map(t => t.id)) + 1 : 1;
    setTeams([...teams, { id: newId, name: `Team ${newId}`, score: 0, fouls: 0, timeouts: 3 }]);
  };

  return (
    <div className="p-4 sm:p-8">
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Sports Scoreboard</CardTitle>
        </CardHeader>
        <CardContent>
          {teams.map((team, index) => (
            <div key={team.id} className="mb-4 last:mb-0">
              <h3 className="text-lg font-semibold mb-2">{team.name}</h3>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                <div className="mb-2 sm:mb-0">
                  <Label htmlFor={`score-${team.id}`}>Score:</Label>
                  <Input 
                    type="number" 
                    id={`score-${team.id}`} 
                    value={team.score} 
                    onChange={(e) => updateTeam(team.id, 'score', parseInt(e.target.value || 0))} 
                    className="w-full sm:w-20"
                  />
                </div>
                <div className="mb-2 sm:mb-0 sm:mx-4">
                  <Label htmlFor={`fouls-${team.id}`}>Fouls:</Label>
                  <Input 
                    type="number" 
                    id={`fouls-${team.id}`} 
                    value={team.fouls} 
                    onChange={(e) => updateTeam(team.id, 'fouls', parseInt(e.target.value || 0))} 
                    className="w-full sm:w-20"
                  />
                </div>
                <div>
                  <Label htmlFor={`timeouts-${team.id}`}>Timeouts:</Label>
                  <Input 
                    type="number" 
                    id={`timeouts-${team.id}`} 
                    value={team.timeouts} 
                    onChange={(e) => updateTeam(team.id, 'timeouts', parseInt(e.target.value || 0))} 
                    className="w-full sm:w-20"
                  />
                </div>
              </div>
            </div>
          ))}
        </CardContent>
        <CardFooter>
          <Button onClick={addTeam}>Add Team</Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default function App() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto">
        <Scoreboard />
      </div>
    </div>
  );
}