import React, { useState, useEffect } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
} from "@hello-pangea/dnd";

const AgendaItem = ({ item, index, updateItem, deleteItem }) => {
  return (
    <Draggable draggableId={item.id} index={index}>
      {(provided) => (
        <div
          className="card mb-4"
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <div className="card-header">
            <div className="card-title flex justify-between items-center">
              <input
                type="text"
                value={item.title}
                onChange={(e) =>
                  updateItem(item.id, { title: e.target.value })
                }
                className="font-bold"
              />
              <button
                className="btn btn-destructive"
                onClick={() => deleteItem(item.id)}
              >
                Delete
              </button>
            </div>
          </div>
          <div className="card-content">
            <textarea
              value={item.description}
              onChange={(e) =>
                updateItem(item.id, { description: e.target.value })
              }
              className="mb-2"
            />
            <div className="flex items-center">
              <label htmlFor={`duration-${item.id}`} className="mr-2">
                Duration (minutes):
              </label>
              <input
                id={`duration-${item.id}`}
                type="number"
                value={item.duration}
                onChange={(e) =>
                  updateItem(item.id, {
                    duration: parseInt(e.target.value) || 0,
                  })
                }
                className="w-20"
              />
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
};

const TemplateDialog = ({ templates, saveTemplate, loadTemplate }) => {
  const [templateName, setTemplateName] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsDialogOpen(true)}>Manage Templates</button>
      {isDialogOpen && (
        <div className="dialog-overlay">
          <div className="dialog-content">
            <h2>Manage Templates</h2>
            <div className="space-y-4">
              <div className="flex space-x-2">
                <input
                  placeholder="Template name"
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                />
                <button
                  onClick={() => {
                    saveTemplate(templateName);
                    setIsDialogOpen(false);
                  }}
                >
                  Save
                </button>
              </div>
              <select
                onChange={(e) => {
                  loadTemplate(e.target.value);
                  setIsDialogOpen(false);
                }}
              >
                <option value="">Load template</option>
                {templates.map((template) => (
                  <option key={template.name} value={template.name}>
                    {template.name}
                  </option>
                ))}
              </select>
            </div>
            <button onClick={() => setIsDialogOpen(false)}>Close</button>
          </div>
        </div>
      )}
    </>
  );
};

export default function App() {
  const [items, setItems] = useState([]);
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("17:00");
  const [templates, setTemplates] = useState([]);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const storedTemplates = localStorage.getItem("agendaTemplates");
    if (storedTemplates) {
      setTemplates(JSON.parse(storedTemplates));
    }
  }, []);

  const addItem = () => {
    const newItem = {
      id: Date.now().toString(),
      title: "New Item",
      description: "",
      duration: 15,
    };
    setItems([...items, newItem]);
  };

  const updateItem = (id, updates) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, ...updates } : item
      )
    );
  };

  const deleteItem = (id) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const newItems = Array.from(items);
    const [reorderedItem] = newItems.splice(result.source.index, 1);
    newItems.splice(result.destination.index, 0, reorderedItem);
    setItems(newItems);
  };

  const saveTemplate = (name) => {
    if (!name) {
      setNotification({
        title: "Error",
        description: "Template name cannot be empty.",
      });
      return;
    }
    const newTemplate = { name, items };
    const updatedTemplates = [...templates.filter(t => t.name !== name), newTemplate];
    setTemplates(updatedTemplates);
    localStorage.setItem("agendaTemplates", JSON.stringify(updatedTemplates));
    setNotification({
      title: "Template Saved",
      description: `Template "${name}" has been saved.`,
    });
  };

  const loadTemplate = (name) => {
    const template = templates.find((t) => t.name === name);
    if (template) {
      setItems(template.items);
      setNotification({
        title: "Template Loaded",
        description: `Template "${name}" has been loaded.`,
      });
    }
  };

  const exportAgenda = () => {
    const agenda = {
      startTime,
      endTime,
      items,
    };
    const blob = new Blob([JSON.stringify(agenda, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "agenda.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const totalDuration = items.reduce((sum, item) => sum + item.duration, 0);
  const [startHours, startMinutes] = startTime.split(":").map(Number);
  const [endHours, endMinutes] = endTime.split(":").map(Number);
  const availableMinutes =
    endHours * 60 + endMinutes - (startHours * 60 + startMinutes);
  const remainingTime = availableMinutes - totalDuration;

  return (
    <>
      <div className="container mx-auto p-4 sm:p-6">
        <h1 className="text-3xl font-bold mb-6">Meeting Agenda Builder</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div>
            <label htmlFor="startTime">Start Time</label>
            <input
              id="startTime"
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="endTime">End Time</label>
            <input
              id="endTime"
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            />
          </div>
        </div>
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Summary</h2>
          <p>Total Duration: {totalDuration} minutes</p>
          <p>Available Time: {availableMinutes} minutes</p>
          <p>Remaining Time: {remainingTime} minutes</p>
        </div>
        <div className="flex justify-between mb-6">
          <button onClick={addItem}>Add Item</button>
          <TemplateDialog
            templates={templates}
            saveTemplate={saveTemplate}
            loadTemplate={loadTemplate}
          />
          <button onClick={exportAgenda}>Export Agenda</button>
        </div>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="agenda">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                {items.map((item, index) => (
                  <AgendaItem
                    key={item.id}
                    item={item}
                    index={index}
                    updateItem={updateItem}
                    deleteItem={deleteItem}
                  />
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
      {notification && (
        <div className="notification">
          <strong>{notification.title}</strong>
          <p>{notification.description}</p>
          <button onClick={() => setNotification(null)}>Close</button>
        </div>
      )}
    </>
  );
}
