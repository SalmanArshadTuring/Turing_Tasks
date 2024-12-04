import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription,CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";


function App() {
  const [members, setMembers] = useState([]);
  const [teams, setTeams] = useState([{ name: 'Team 1', members: [] }]);
  const [memberInput, setMemberInput] = useState({ name: '', skills: '', role: '', preference: '' });

  const addMember = () => {
    if (memberInput.name && memberInput.skills && memberInput.role) {
      setMembers([...members, { ...memberInput, id: Date.now() }]);
      setMemberInput({ name: '', skills: '', role: '', preference: '' });
    }
  };

  const distributeMembers = () => {
    let balancedTeams = Array.from({ length: teams.length }, () => ({ name: `Team ${teams.length}`, members: [] }));
    let memberPool = [...members];

    members.forEach((member, index) => {
      const teamIndex = index % balancedTeams.length;
      balancedTeams[teamIndex].members.push(member);
    });

    setTeams(balancedTeams);
  };

  const adjustTeams = (direction, teamIndex) => {
    const newTeams = [...teams];
    if (direction === 'add') {
      newTeams.push({ name: `Team ${newTeams.length + 1}`, members: [] });
    } else if (direction === 'remove' && newTeams.length > 1) {
      const lastTeamMembers = newTeams.pop().members;
      newTeams[teamIndex].members.push(...lastTeamMembers);
    }
    setTeams(newTeams);
  };

  const exportTeams = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(teams, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href",     dataStr);
    downloadAnchorNode.setAttribute("download", "teams.json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const resetTeams = () => {
    setTeams([{ name: 'Team 1', members: [] }]);
    setMembers([]);
  };

  return (
    <div className="flex flex-col items-center p-4 sm:p-8 space-y-4">
      <h1 className="text-2xl font-bold">Dynamic Team Formation Tool</h1>
      
      {/* Member Input */}
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Add Team Member</CardTitle>
        </CardHeader>
        <CardContent>
          <Input 
            value={memberInput.name} 
            onChange={(e) => setMemberInput({...memberInput, name: e.target.value})} 
            placeholder="Name" 
            className="mb-2"
          />
          <Input 
            value={memberInput.skills} 
            onChange={(e) => setMemberInput({...memberInput, skills: e.target.value})} 
            placeholder="Skills" 
            className="mb-2"
          />
          <Input 
            value={memberInput.role} 
            onChange={(e) => setMemberInput({...memberInput, role: e.target.value})} 
            placeholder="Role" 
            className="mb-2"
          />
          <Input 
            value={memberInput.preference} 
            onChange={(e) => setMemberInput({...memberInput, preference: e.target.value})} 
            placeholder="Preference" 
          />
          <Button onClick={addMember} className="mt-4">Add Member</Button>
        </CardContent>
      </Card>

      {/* Teams Display */}
      <div className="w-full max-w-3xl flex flex-col sm:flex-row flex-wrap justify-center gap-4">
        {teams.map((team, index) => (
          <Card key={index} className="flex-1 min-w-[280px]">
            <CardHeader>
              <CardTitle>{team.name}</CardTitle>
              <CardDescription>{team.members.length} members</CardDescription>
            </CardHeader>
            <CardContent>
              <ul>
                {team.members.map((member) => (
                  <li key={member.id}>{member.name} - {member.role}</li>
                ))}
              </ul>
            </CardContent>
            {index === teams.length - 1 && (
              <CardFooter className="flex justify-between">
                <Button onClick={() => adjustTeams('add', index)}>Add Team</Button>
                {teams.length > 1 && <Button onClick={() => adjustTeams('remove', index)}>Remove Team</Button>}
              </CardFooter>
            )}
          </Card>
        ))}
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <Button onClick={distributeMembers}>Form Teams</Button>
        <Button onClick={exportTeams}>Export Teams</Button>
        <Button onClick={resetTeams}>Reset</Button>
      </div>
    </div>
  );
}

export default App;