import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";

const VisionBoard = () => {
  const [goals, setGoals] = useState([]);
  const [newGoal, setNewGoal] = useState({ title: "", description: "", image: null, reminder: null });

  useEffect(() => {
    const savedGoals = localStorage.getItem("visionBoardGoals");
    if (savedGoals) {
      setGoals(JSON.parse(savedGoals));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("visionBoardGoals", JSON.stringify(goals));
  }, [goals]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setNewGoal({ ...newGoal, image: reader.result });
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleAddGoal = () => {
    if (newGoal.title && newGoal.image) {
      setGoals([...goals, { ...newGoal, id: Date.now() }]);
      setNewGoal({ title: "", description: "", image: null, reminder: null });
    }
  };

  const handleRemoveGoal = (id) => {
    setGoals(goals.filter((goal) => goal.id !== id));
  };

  const handleReminderSet = (date, goalId) => {
    setGoals(
      goals.map((goal) =>
        goal.id === goalId ? { ...goal, reminder: date } : goal
      )
    );
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Digital Vision Board</h1>
      <div className="mb-6">
        <Dialog>
          <DialogTrigger asChild>
            <Button>Add New Goal</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Goal</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">
                  Title
                </Label>
                <Input
                  id="title"
                  value={newGoal.title}
                  onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={newGoal.description}
                  onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="image" className="text-right">
                  Image
                </Label>
                <Input
                  id="image"
                  type="file"
                  onChange={handleImageUpload}
                  className="col-span-3"
                />
              </div>
            </div>
            <Button onClick={handleAddGoal}>Add Goal</Button>
          </DialogContent>
        </Dialog>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {goals.map((goal) => (
          <Card key={goal.id} className="w-full">
            <CardHeader>
              <CardTitle>{goal.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <img src={goal.image} alt={goal.title} className="w-full h-40 object-cover mb-2" />
              <p className="text-sm mb-2">{goal.description}</p>
              <div className="flex justify-between items-center">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline">
                      {goal.reminder
                        ? format(new Date(goal.reminder), "PPP")
                        : "Set Reminder"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={goal.reminder ? new Date(goal.reminder) : undefined}
                      onSelect={(date) => handleReminderSet(date, goal.id)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <Button variant="destructive" onClick={() => handleRemoveGoal(goal.id)}>
                  Remove
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <VisionBoard />
    </div>
  );
}