import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function Node({ node, onUpdate, onDelete, onConnect }) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(node.title);
  const [description, setDescription] = useState(node.description || '');

  const handleSave = () => {
    onUpdate({ ...node, title, description });
    setIsEditing(false);
  };

  return (
    <Card className="absolute border p-2 shadow-lg bg-white" style={{ left: node.x, top: node.y }}>
      <CardHeader>
        {isEditing ? (
          <>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} className="mb-2" />
            <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" />
            <Button onClick={handleSave} size="sm">Save</Button>
          </>
        ) : (
          <>
            <CardTitle onClick={() => setIsEditing(true)}>{title}</CardTitle>
            <p>{description}</p>
            <Button onClick={() => onDelete(node.id)} size="sm">Delete</Button>
            <Button onClick={() => onConnect(node.id)} size="sm">Connect</Button>
          </>
        )}
      </CardHeader>
    </Card>
  );
}

function App() {
  const [nodes, setNodes] = useState([]);
  const [links, setLinks] = useState([]);
  const [selectedNodeForLink, setSelectedNodeForLink] = useState(null);
  const canvasRef = useRef(null);

  const addNode = (e) => {
    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setNodes([...nodes, { id: Date.now(), x, y, title: 'New Idea' }]);
  };

  const updateNode = (id, data) => {
    setNodes(nodes.map(n => n.id === id ? { ...n, ...data } : n));
  };

  const deleteNode = (id) => {
    setNodes(nodes.filter(n => n.id !== id));
    setLinks(links.filter(l => l.from !== id && l.to !== id));
  };

  const startLink = (id) => {
    setSelectedNodeForLink(id);
  };

  const endLink = (id) => {
    if (selectedNodeForLink && selectedNodeForLink !== id) {
      setLinks([...links, { from: selectedNodeForLink, to: id, label: '' }]);
    }
    setSelectedNodeForLink(null);
  };

  const saveMap = () => {
    const data = JSON.stringify({ nodes, links });
    localStorage.setItem('mindMap', data);
  };

  const loadMap = () => {
    const data = localStorage.getItem('mindMap');
    if (data) {
      const { nodes: loadedNodes, links: loadedLinks } = JSON.parse(data);
      setNodes(loadedNodes || []);
      setLinks(loadedLinks || []);
    }
  };

  const exportToJson = () => {
    const data = JSON.stringify({ nodes, links }, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mindmap.json';
    a.click();
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <header className="p-4 bg-blue-500 text-white">
        <h1 className="text-2xl">Mind Map Generator</h1>
        <div className="mt-2 space-x-2">
          <Button onClick={saveMap}>Save</Button>
          <Button onClick={loadMap}>Load</Button>
          <Button onClick={exportToJson}>Export to JSON</Button>
          <Button onClick={() => setNodes([])}>Reset</Button>
        </div>
      </header>
      <div 
        ref={canvasRef} 
        className="flex-grow relative bg-gray-50" 
        onClick={addNode}
        style={{ touchAction: 'none' }}
      >
        {nodes.map(node => (
          <Node 
            key={node.id} 
            node={node} 
            onUpdate={(data) => updateNode(node.id, data)} 
            onDelete={deleteNode}
            onConnect={startLink}
          />
        ))}
        {links.map((link, index) => (
          <div 
            key={index} 
            className="absolute border-t-2 border-blue-500" 
            style={{
              width: Math.hypot(nodes[link.to].x - nodes[link.from].x, nodes[link.to].y - nodes[link.from].y),
              transform: `rotate(${Math.atan2(nodes[link.to].y - nodes[link.from].y, nodes[link.to].x - nodes[link.from].x)}rad)`,
              left: nodes[link.from].x,
              top: nodes[link.from].y,
            }}
          ></div>
        ))}
      </div>
    </div>
  );
}

export default App;