import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

const TeamCard = ({ team, onScoreChange, onStatChange, onDelete }) => {
  return (
    <Card className="w-full sm:w-64 mb-4">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>{team.name}</span>
          <Button variant="destructive" size="sm" onClick={onDelete}>
            X
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <Label>Score:</Label>
            <div className="flex gap-2">
              <Button size="sm" onClick={() => onScoreChange(-1)}>-</Button>
              <span className="text-2xl font-bold">{team.score}</span>
              <Button size="sm" onClick={() => onScoreChange(1)}>+</Button>
            </div>
          </div>
          <Separator />
          <div className="flex justify-between items-center">
            <Label>Fouls:</Label>
            <div className="flex gap-2">
              <Button size="sm" onClick={() => onStatChange("fouls", -1)}>-</Button>
              <span>{team.stats.fouls}</span>
              <Button size="sm" onClick={() => onStatChange("fouls", 1)}>+</Button>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <Label>Timeouts:</Label>
            <div className="flex gap-2">
              <Button size="sm" onClick={() => onStatChange("timeouts", -1)}>-</Button>
              <span>{team.stats.timeouts}</span>
              <Button size="sm" onClick={() => onStatChange("timeouts", 1)}>+</Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const AddTeamForm = ({ onAddTeam }) => {
  const [teamName, setTeamName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (teamName.trim()) {
      onAddTeam(teamName.trim());
      setTeamName("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
      <Input
        type="text"
        value={teamName}
        onChange={(e) => setTeamName(e.target.value)}
        placeholder="Enter team name"
        className="flex-grow"
      />
      <Button type="submit">Add Team</Button>
    </form>
  );
};

export default function App() {
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    const savedTeams = localStorage.getItem("teams");
    if (savedTeams) {
      setTeams(JSON.parse(savedTeams));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("teams", JSON.stringify(teams));
  }, [teams]);

  const addTeam = (name) => {
    setTeams([...teams, { name, score: 0, stats: { fouls: 0, timeouts: 0 } }]);
  };

  const updateScore = (index, change) => {
    const newTeams = [...teams];
    newTeams[index].score = Math.max(0, newTeams[index].score + change);
    setTeams(newTeams);
  };

  const updateStat = (index, stat, change) => {
    const newTeams = [...teams];
    newTeams[index].stats[stat] = Math.max(0, newTeams[index].stats[stat] + change);
    setTeams(newTeams);
  };

  const deleteTeam = (index) => {
    const newTeams = teams.filter((_, i) => i !== index);
    setTeams(newTeams);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Sports Scoreboard</h1>
      <AddTeamForm onAddTeam={addTeam} />
      <div className="flex flex-wrap gap-4">
        {teams.map((team, index) => (
          <TeamCard
            key={index}
            team={team}
            onScoreChange={(change) => updateScore(index, change)}
            onStatChange={(stat, change) => updateStat(index, stat, change)}
            onDelete={() => deleteTeam(index)}
          />
        ))}
      </div>
    </div>
  );
}