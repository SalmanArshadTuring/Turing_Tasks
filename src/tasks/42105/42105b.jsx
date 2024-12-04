import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

const skills = ["Programming", "Design", "Marketing", "Management"];
const roles = ["Developer", "Designer", "Marketer", "Manager"];

const MemberInput = ({ onAdd }) => {
  const [name, setName] = useState("");
  const [skill, setSkill] = useState("");
  const [role, setRole] = useState("");

  const handleAdd = () => {
    if (name && skill && role) {
      onAdd({ name, skill, role });
      setName("");
      setSkill("");
      setRole("");
    }
  };

  return (
    <div className="flex flex-col space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0">
      <Input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
      <Select value={skill} onValueChange={setSkill}>
        <SelectTrigger>
          <SelectValue placeholder="Skill" />
        </SelectTrigger>
        <SelectContent>
          {skills.map((s) => (
            <SelectItem key={s} value={s}>
              {s}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={role} onValueChange={setRole}>
        <SelectTrigger>
          <SelectValue placeholder="Role" />
        </SelectTrigger>
        <SelectContent>
          {roles.map((r) => (
            <SelectItem key={r} value={r}>
              {r}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button onClick={handleAdd}>Add Member</Button>
    </div>
  );
};

const TeamCard = ({ team, onMemberMove }) => (
  <Card className="w-full sm:w-64">
    <CardHeader>
      <CardTitle>Team {team.id}</CardTitle>
    </CardHeader>
    <CardContent>
      <ScrollArea className="h-48">
        {team.members.map((member, index) => (
          <div key={index} className="flex items-center justify-between mb-2">
            <div>
              <div>{member.name}</div>
              <div className="text-sm text-gray-500">{member.role}</div>
            </div>
            <Badge>{member.skill}</Badge>
            <Button variant="outline" size="sm" onClick={() => onMemberMove(team.id, index)}>
              Move
            </Button>
          </div>
        ))}
      </ScrollArea>
    </CardContent>
  </Card>
);

export default function App() {
  const [members, setMembers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [numTeams, setNumTeams] = useState(2);
  const [maxMembersPerTeam, setMaxMembersPerTeam] = useState(5);

  const addMember = (member) => {
    setMembers([...members, member]);
  };

  const formTeams = () => {
    const shuffled = [...members].sort(() => 0.5 - Math.random());
    const newTeams = Array.from({ length: numTeams }, (_, i) => ({
      id: i + 1,
      members: [],
    }));

    shuffled.forEach((member, index) => {
      const teamIndex = index % numTeams;
      if (newTeams[teamIndex].members.length < maxMembersPerTeam) {
        newTeams[teamIndex].members.push(member);
      }
    });

    setTeams(newTeams);
  };

  const moveMember = (fromTeamId, memberIndex) => {
    const newTeams = [...teams];
    const member = newTeams[fromTeamId - 1].members.splice(memberIndex, 1)[0];
    const toTeamId = (fromTeamId % numTeams) + 1;
    newTeams[toTeamId - 1].members.push(member);
    setTeams(newTeams);
  };

  const exportTeams = () => {
    const json = JSON.stringify(teams, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "teams.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const resetTeams = () => {
    setTeams([]);
    setMembers([]);
  };

  useEffect(() => {
    if (teams.length > 0) {
      formTeams();
    }
  }, [numTeams, maxMembersPerTeam]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Dynamic Team Formation Tool</h1>
      <MemberInput onAdd={addMember} />
      <div className="my-4">
        <h2 className="text-xl font-semibold mb-2">Members</h2>
        <ScrollArea className="h-32">
          {members.map((member, index) => (
            <div key={index} className="flex items-center space-x-2 mb-1">
              <span>{member.name}</span>
              <Badge>{member.skill}</Badge>
              <span className="text-sm text-gray-500">{member.role}</span>
            </div>
          ))}
        </ScrollArea>
      </div>
      <div className="my-4 space-y-2">
        <div className="flex items-center space-x-2">
          <span>Number of Teams:</span>
          <Slider
            min={1}
            max={10}
            step={1}
            value={[numTeams]}
            onValueChange={(value) => setNumTeams(value[0])}
            className="w-64"
          />
          <span>{numTeams}</span>
        </div>
        <div className="flex items-center space-x-2">
          <span>Max Members per Team:</span>
          <Slider
            min={1}
            max={10}
            step={1}
            value={[maxMembersPerTeam]}
            onValueChange={(value) => setMaxMembersPerTeam(value[0])}
            className="w-64"
          />
          <span>{maxMembersPerTeam}</span>
        </div>
      </div>
      <div className="my-4 space-x-2">
        <Button onClick={formTeams}>Form Teams</Button>
        <Button onClick={exportTeams}>Export Teams</Button>
        <Button onClick={resetTeams} variant="outline">
          Reset
        </Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {teams.map((team) => (
          <TeamCard key={team.id} team={team} onMemberMove={moveMember} />
        ))}
      </div>
    </div>
  );
}