import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const AgendaItem = ({ item, index, onChange, onDelete }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="mb-2">
      <Card>
        <CardHeader>
          <CardTitle>
            <Input 
              value={item.title} 
              onChange={(e) => onChange(index, 'title', e.target.value)} 
              placeholder="Agenda Item Title"
            />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <textarea 
            value={item.description} 
            onChange={(e) => onChange(index, 'description', e.target.value)} 
            placeholder="Description" 
            className="w-full h-24 mb-2 p-2 border rounded"
          />
          <Input 
            type="number" 
            value={item.duration} 
            onChange={(e) => onChange(index, 'duration', e.target.value)} 
            placeholder="Duration (mins)"
          />
        </CardContent>
        <CardFooter>
          <Button variant="destructive" onClick={() => onDelete(index)}>Delete</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

function App() {
  const [agendaItems, setAgendaItems] = useState([]);
  const [meetingStart, setMeetingStart] = useState('09:00');
  const [meetingEnd, setMeetingEnd] = useState('10:00');
  const [templates, setTemplates] = useState(() => JSON.parse(localStorage.getItem('agendaTemplates')) || []);
  const [templateName, setTemplateName] = useState('');

  useEffect(() => {
    localStorage.setItem('agendaTemplates', JSON.stringify(templates));
  }, [templates]);

  const addItem = () => setAgendaItems([...agendaItems, { id: Date.now(), title: '', description: '', duration: 0 }]);

  const updateItem = (index, field, value) => {
    const updatedItems = [...agendaItems];
    updatedItems[index][field] = value;
    setAgendaItems(updatedItems);
  };

  const deleteItem = (index) => {
    setAgendaItems(agendaItems.filter((_, i) => i !== index));
  };

  const totalDuration = agendaItems.reduce((acc, item) => acc + parseInt(item.duration || 0, 10), 0);
  const meetingDuration = (new Date(`1970-01-01T${meetingEnd}`) - new Date(`1970-01-01T${meetingStart}`)) / 60000;
  const remainingTime = meetingDuration - totalDuration;

  const saveTemplate = () => {
    if (templateName) {
      setTemplates([...templates, { name: templateName, items: agendaItems }]);
      setTemplateName('');
    }
  };

  const loadTemplate = (template) => {
    setAgendaItems(template.items);
  };

  const exportAgenda = () => {
    const element = document.createElement('a');
    const file = new Blob([JSON.stringify({ start: meetingStart, end: meetingEnd, items: agendaItems }, null, 2)], {type: 'text/json'});
    element.href = URL.createObjectURL(file);
    element.download = "meeting_agenda.json";
    document.body.appendChild(element); 
    element.click();
  };

  return (
    <div className="container mx-auto p-4 sm:p-8">
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Meeting Agenda Builder</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row mb-4">
            <Input type="time" value={meetingStart} onChange={(e) => setMeetingStart(e.target.value)} className="mb-2 sm:mr-2 sm:mb-0"/>
            <Input type="time" value={meetingEnd} onChange={(e) => setMeetingEnd(e.target.value)}/>
          </div>
          {agendaItems.map((item, index) => (
            <AgendaItem 
              key={item.id} 
              item={item} 
              index={index} 
              onChange={updateItem} 
              onDelete={deleteItem} 
            />
          ))}
          <Button onClick={addItem} className="mt-2">Add Item</Button>
        </CardContent>
      </Card>

      <Card className="mt-4">
        <CardContent>
          <div className="mb-4">
            <Input 
              value={templateName} 
              onChange={(e) => setTemplateName(e.target.value)} 
              placeholder="Template Name" 
            />
            <Button onClick={saveTemplate} className="mt-2">Save Template</Button>
          </div>
          {templates.map((template, idx) => (
            <div key={idx} className="flex items-center justify-between mb-2">
              <span>{template.name}</span>
              <Button onClick={() => loadTemplate(template)}>Load</Button>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="mt-4">
        <CardContent>
          <h3 className="font-bold mb-2">Summary</h3>
          <p>Total Duration: {totalDuration} mins</p>
          <p>Remaining Time: {remainingTime >= 0 ? `${remainingTime} mins` : <span className="text-red-500">{`${Math.abs(remainingTime)} mins over`}</span>}</p>
          <Button onClick={exportAgenda} className="mt-2">Export Agenda</Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;