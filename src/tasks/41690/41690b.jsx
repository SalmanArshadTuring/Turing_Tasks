import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button"; // Keep your button component if you're using it
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; // Keep your Card components

const TodoItem = ({ task, onEdit, onDelete, onToggle }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState(task.text);

  const handleEdit = () => {
    onEdit(task.id, editedTask);
    setIsEditing(false);
  };

  return (
    <div className="flex items-center justify-between p-2 border-b">
      <div className="flex items-center space-x-2">
        {/* Default checkbox */}
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggle(task.id)}
        />
        {isEditing ? (
          // Default input field for editing
          <input
            type="text"
            value={editedTask}
            onChange={(e) => setEditedTask(e.target.value)}
            className="w-full"
          />
        ) : (
          <span className={task.completed ? "line-through" : ""}>
            {task.text}
          </span>
        )}
      </div>
      <div className="space-x-2">
        {isEditing ? (
          <Button onClick={handleEdit} size="sm">
            Save
          </Button>
        ) : (
          <Button onClick={() => setIsEditing(true)} size="sm">
            Edit
          </Button>
        )}
        <Button onClick={() => onDelete(task.id)} size="sm" variant="destructive">
          Delete
        </Button>
      </div>
    </div>
  );
};

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");

  useEffect(() => {
    const storedTasks = localStorage.getItem("tasks");
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (newTask.trim() !== "") {
      setTasks([
        ...tasks,
        { id: Date.now(), text: newTask, completed: false },
      ]);
      setNewTask("");
    }
  };

  const editTask = (id, newText) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, text: newText } : task
      )
    );
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const toggleTask = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            To-Do List
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex space-x-2">
              {/* Default input field for adding new task */}
              <input
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="Add a new task"
                className="flex-grow"
              />
              <Button onClick={addTask}>Add</Button>
            </div>
            <div className="space-y-2">
              {tasks.map((task) => (
                <TodoItem
                  key={task.id}
                  task={task}
                  onEdit={editTask}
                  onDelete={deleteTask}
                  onToggle={toggleTask}
                />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
