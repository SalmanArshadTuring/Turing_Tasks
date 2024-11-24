import React, { useState } from 'react';
import {  Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {  Button } from "@/components/ui/button";


function Task({ task, onToggle, onDelete, onEdit }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(task.text);

  const handleEdit = () => {
    if (isEditing) {
      onEdit(task.id, editValue);
    }
    setIsEditing(!isEditing);
  };

  return (
    <Card className="mb-2">
      <CardContent className="p-4 flex items-center justify-between">
        {isEditing ? (
          <input
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            className="flex-grow mr-2"
          />
        ) : (
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => onToggle(task.id)}
              className="mr-2"
            />
            <span className={task.completed ? 'line-through text-gray-500' : ''}>
              {task.text}
            </span>
          </div>
        )}
        <div>
          <Button variant="outline" size="sm" onClick={handleEdit}>
            {isEditing ? 'Save' : 'Edit'}
          </Button>
          <Button variant="destructive" size="sm" className="ml-2" onClick={() => onDelete(task.id)}>
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');

  const addTask = () => {
    if (newTask.trim()) {
      setTasks([...tasks, { id: Date.now(), text: newTask, completed: false }]);
      setNewTask('');
    }
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const editTask = (id, newText) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, text: newText } : task
    ));
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-10">
      <Card>
        <CardHeader>
          <CardTitle>My To-Do List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex mb-4">
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="Add a new task..."
              className="flex-grow mr-2"
            />
            <Button onClick={addTask}>Add</Button>
          </div>
          {tasks.map(task => (
            <Task 
              key={task.id} 
              task={task} 
              onToggle={toggleTask} 
              onDelete={deleteTask}
              onEdit={editTask}
            />
          ))}
          {tasks.length === 0 && <p className="text-center text-gray-500">No tasks yet. Add one!</p>}
        </CardContent>
      </Card>
    </div>
  );
}
