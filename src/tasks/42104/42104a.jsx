import React, { useState, useEffect } from "react";
import {
    DragDropContext,
    Droppable,
    Draggable,
  } from "@hello-pangea/dnd";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

const initialTasks = {
  urgent_important: [],
  not_urgent_important: [],
  urgent_not_important: [],
  not_urgent_not_important: [],
};

const TaskItem = ({ task, index, removeTask, toggleTaskCompletion }) => (
  <Draggable draggableId={task.id} index={index}>
    {(provided) => (
      <div
        ref={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        className="flex items-center justify-between p-2 mb-2 bg-white rounded shadow"
      >
        <div className="flex items-center">
          <Checkbox
            checked={task.completed}
            onCheckedChange={() => toggleTaskCompletion(task.id)}
            className="mr-2"
          />
          <span className={task.completed ? "line-through" : ""}>
            {task.content}
          </span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => removeTask(task.id)}
          className="text-red-500"
        >
          ×
        </Button>
      </div>
    )}
  </Draggable>
);

const TaskList = ({ tasks, removeTask, toggleTaskCompletion }) => (
  <Droppable droppableId="list">
    {(provided) => (
      <div {...provided.droppableProps} ref={provided.innerRef}>
        {tasks.map((task, index) => (
          <TaskItem
            key={task.id}
            task={task}
            index={index}
            removeTask={removeTask}
            toggleTaskCompletion={toggleTaskCompletion}
          />
        ))}
        {provided.placeholder}
      </div>
    )}
  </Droppable>
);

const QuadrantCard = ({ title, tasks, removeTask, toggleTaskCompletion }) => (
  <Card className="h-full">
    <CardHeader>
      <CardTitle className="text-lg">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <TaskList
        tasks={tasks}
        removeTask={removeTask}
        toggleTaskCompletion={toggleTaskCompletion}
      />
    </CardContent>
  </Card>
);

export default function App() {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem("eisenhowerTasks");
    return savedTasks ? JSON.parse(savedTasks) : initialTasks;
  });
  const [newTask, setNewTask] = useState("");

  useEffect(() => {
    localStorage.setItem("eisenhowerTasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (quadrant) => {
    if (newTask.trim() !== "") {
      const task = {
        id: Date.now().toString(),
        content: newTask,
        completed: false,
      };
      setTasks((prevTasks) => ({
        ...prevTasks,
        [quadrant]: [...prevTasks[quadrant], task],
      }));
      setNewTask("");
    }
  };

  const removeTask = (taskId) => {
    setTasks((prevTasks) => {
      const updatedTasks = { ...prevTasks };
      for (const quadrant in updatedTasks) {
        updatedTasks[quadrant] = updatedTasks[quadrant].filter(
          (task) => task.id !== taskId
        );
      }
      return updatedTasks;
    });
  };

  const toggleTaskCompletion = (taskId) => {
    setTasks((prevTasks) => {
      const updatedTasks = { ...prevTasks };
      for (const quadrant in updatedTasks) {
        updatedTasks[quadrant] = updatedTasks[quadrant].map((task) =>
          task.id === taskId ? { ...task, completed: !task.completed } : task
        );
      }
      return updatedTasks;
    });
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const { source, destination } = result;
    const sourceQuadrant = source.droppableId;
    const destQuadrant = destination.droppableId;

    if (sourceQuadrant === destQuadrant) {
      const quadrantTasks = Array.from(tasks[sourceQuadrant]);
      const [reorderedTask] = quadrantTasks.splice(source.index, 1);
      quadrantTasks.splice(destination.index, 0, reorderedTask);

      setTasks({
        ...tasks,
        [sourceQuadrant]: quadrantTasks,
      });
    } else {
      const sourceQuadrantTasks = Array.from(tasks[sourceQuadrant]);
      const destQuadrantTasks = Array.from(tasks[destQuadrant]);
      const [movedTask] = sourceQuadrantTasks.splice(source.index, 1);
      destQuadrantTasks.splice(destination.index, 0, movedTask);

      setTasks({
        ...tasks,
        [sourceQuadrant]: sourceQuadrantTasks,
        [destQuadrant]: destQuadrantTasks,
      });
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Eisenhower Matrix</h1>
      <div className="mb-4">
        <Input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Enter a new task"
          className="mr-2"
        />
        <div className="grid grid-cols-2 gap-2 mt-2">
          <Button onClick={() => addTask("urgent_important")}>
            Add Urgent & Important
          </Button>
          <Button onClick={() => addTask("not_urgent_important")}>
            Add Not Urgent & Important
          </Button>
          <Button onClick={() => addTask("urgent_not_important")}>
            Add Urgent & Not Important
          </Button>
          <Button onClick={() => addTask("not_urgent_not_important")}>
            Add Not Urgent & Not Important
          </Button>
        </div>
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <QuadrantCard
            title="Urgent & Important"
            tasks={tasks.urgent_important}
            removeTask={removeTask}
            toggleTaskCompletion={toggleTaskCompletion}
          />
          <QuadrantCard
            title="Not Urgent & Important"
            tasks={tasks.not_urgent_important}
            removeTask={removeTask}
            toggleTaskCompletion={toggleTaskCompletion}
          />
          <QuadrantCard
            title="Urgent & Not Important"
            tasks={tasks.urgent_not_important}
            removeTask={removeTask}
            toggleTaskCompletion={toggleTaskCompletion}
          />
          <QuadrantCard
            title="Not Urgent & Not Important"
            tasks={tasks.not_urgent_not_important}
            removeTask={removeTask}
            toggleTaskCompletion={toggleTaskCompletion}
          />
        </div>
      </DragDropContext>
    </div>
  );
}