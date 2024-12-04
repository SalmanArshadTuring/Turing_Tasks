import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDrag, useDrop } from 'react-dnd';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const Quadrant = ({ title, tasks, moveTask, index, canDrop, isOver }) => {
  const [{ isDragging }, drag] = useDrag({
    type: "TASK",
    item: { index },
    collect: monitor => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: "TASK",
    drop: (item) => moveTask(item.index, index),
    canDrop: () => canDrop,
    collect: monitor => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  return (
    <div ref={drop} className="flex-1 min-w-0">
      <Card className="h-full">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent className={`p-2 ${isOver ? 'bg-slate-100' : ''}`}>
          <div ref={drag} className="space-y-2">
            {tasks.map((task, idx) => (
              <div 
                key={idx} 
                className={`p-2 rounded border ${isDragging ? 'opacity-25' : 'opacity-100'}`}
              >
                {task.name} {task.completed ? '✅' : '❌'}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default function App() {
  const [taskInput, setTaskInput] = useState('');
  const [tasks, setTasks] = useState({
    urgentImportant: [],
    notUrgentImportant: [],
    urgentNotImportant: [],
    notUrgentNotImportant: [],
  });

  const addTask = () => {
    if (taskInput) {
      setTasks(prev => ({
        ...prev,
        urgentImportant: [...prev.urgentImportant, { name: taskInput, completed: false }],
      }));
      setTaskInput('');
    }
  };

  const moveTask = (from, to) => {
    const quadrants = Object.keys(tasks);
    const fromQuadrant = quadrants[from];
    const toQuadrant = quadrants[to];
    const taskToMove = tasks[fromQuadrant].splice(from, 1)[0];
    setTasks(prev => ({
      ...prev,
      [fromQuadrant]: [...prev[fromQuadrant]],
      [toQuadrant]: [...prev[toQuadrant], taskToMove]
    }));
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="container mx-auto p-4">
        <div className="mb-4 flex flex-col sm:flex-row gap-2">
          <Input 
            value={taskInput} 
            onChange={(e) => setTaskInput(e.target.value)} 
            placeholder="Enter a new task"
            className="flex-grow"
          />
          <Button onClick={addTask}>Add Task</Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Object.entries(tasks).map(([key, quadrantTasks], idx) => (
            <Quadrant 
              key={key}
              title={key.replace(/([A-Z])/g, ' $1').trim()}
              tasks={quadrantTasks}
              index={idx}
              moveTask={moveTask}
              canDrop={true}
            />
          ))}
        </div>
      </div>
    </DndProvider>
  );
}