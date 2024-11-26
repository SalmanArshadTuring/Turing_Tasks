import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

function App() {
  const [items, setItems] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const dragItem = useRef();
  const dragNode = useRef();

  const handleDragStart = (e, item) => {
    dragItem.current = item;
    dragNode.current = e.target;
    dragNode.current.addEventListener('dragend', handleDragEnd);
    setTimeout(() => setIsDragging(true), 0);
  };

  const handleDragEnter = (e, targetItem) => {
    if (dragNode.current !== e.target) {
      setItems(oldItems => {
        let newItems = JSON.parse(JSON.stringify(oldItems));
        newItems[targetItem.index].position = newItems[dragItem.current.index].position;
        newItems[dragItem.current.index].position = targetItem.position;
        return newItems.sort((a, b) => a.position - b.position);
      });
    }
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    dragNode.current.removeEventListener('dragend', handleDragEnd);
    dragItem.current = null;
    dragNode.current = null;
  };

  const addItem = () => {
    setItems([...items, { id: Date.now(), image: null, goal: '', reminder: '', position: items.length }]);
  };

  const removeItem = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  const Item = ({ item, index }) => {
    const [image, setImage] = useState(item.image);
    const [goal, setGoal] = useState(item.goal);
    const [reminder, setReminder] = useState(item.reminder);

    const handleFileChange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => setImage(reader.result);
        reader.readAsDataURL(file);
      }
    };

    return (
      <div 
        draggable 
        onDragStart={(e) => handleDragStart(e, { index, position: item.position })} 
        onDragEnter={isDragging ? (e) => handleDragEnter(e, { index, position: item.position }) : null}
        className="w-full sm:w-1/2 md:w-1/3 p-2"
      >
        <Card>
          <CardHeader>
            <CardTitle>{goal || 'New Goal'}</CardTitle>
          </CardHeader>
          <CardContent>
            {image && <img src={image} alt="Goal" className="mb-2 w-full h-48 object-cover" />}
            <Input type="file" onChange={handleFileChange} className="mb-2" />
            <Textarea 
              placeholder="Describe your goal..." 
              value={goal}
              onChange={(e) => setGoal(e.target.value)} 
            />
            <Input 
              type="datetime-local" 
              value={reminder} 
              onChange={(e) => setReminder(e.target.value)} 
              className="mt-2"
            />
          </CardContent>
          <Button onClick={() => removeItem(item.id)} variant="destructive">Remove</Button>
        </Card>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold mb-4 text-center">Digital Vision Board</h1>
        <Button onClick={addItem} className="mb-4">Add New Goal</Button>
        <div className="flex flex-wrap -m-2">
          {items.map((item, idx) => <Item key={item.id} item={item} index={idx} />)}
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">Set Global Reminder</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Set Reminder</DialogTitle>
              <Input type="datetime-local" className="mt-2" />
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

export default App;