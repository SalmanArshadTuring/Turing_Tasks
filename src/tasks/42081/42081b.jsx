import React, { useState, useRef, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Node = ({ node, onDragStart, onClick, onContextMenu }) => (
  <Card
    className="absolute cursor-move"
    style={{ left: node.x, top: node.y }}
    draggable
    onDragStart={(e) => onDragStart(e, node.id)}
    onClick={() => onClick(node.id)}
    onContextMenu={(e) => onContextMenu(e, node.id)}
  >
    <CardHeader className="p-3">
      <CardTitle className="text-sm">{node.title}</CardTitle>
    </CardHeader>
    {node.description && (
      <CardContent className="p-3 pt-0">
        <CardDescription>{node.description}</CardDescription>
      </CardContent>
    )}
  </Card>
);

const Link = ({ link, nodes }) => {
  const startNode = nodes.find((n) => n.id === link.start);
  const endNode = nodes.find((n) => n.id === link.end);

  if (!startNode || !endNode) return null;

  const x1 = startNode.x + 100;
  const y1 = startNode.y + 50;
  const x2 = endNode.x + 100;
  const y2 = endNode.y + 50;

  return (
    <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={link.color}
        strokeWidth={link.thickness}
      />
      {link.label && (
        <text x={(x1 + x2) / 2} y={(y1 + y2) / 2} textAnchor="middle" fill={link.color}>
          {link.label}
        </text>
      )}
    </svg>
  );
};

export default function App() {
  const [nodes, setNodes] = useState([]);
  const [links, setLinks] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [linkStart, setLinkStart] = useState(null);
  const canvasRef = useRef(null);

  const addNode = (title, description = "") => {
    const newNode = {
      id: Date.now(),
      title,
      description,
      x: Math.random() * 500,
      y: Math.random() * 500,
    };
    setNodes([...nodes, newNode]);
  };

  const updateNode = (id, title, description) => {
    setNodes(nodes.map((node) => (node.id === id ? { ...node, title, description } : node)));
  };

  const deleteNode = (id) => {
    setNodes(nodes.filter((node) => node.id !== id));
    setLinks(links.filter((link) => link.start !== id && link.end !== id));
  };

  const addLink = (start, end, color = "#000000", thickness = 2, label = "") => {
    const newLink = { id: Date.now(), start, end, color, thickness, label };
    setLinks([...links, newLink]);
  };

  const handleDragStart = (e, id) => {
    e.dataTransfer.setData("text/plain", id);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    const id = parseInt(e.dataTransfer.getData("text/plain"), 10);
    const { offsetX, offsetY } = e.nativeEvent;
    setNodes(
      nodes.map((node) => (node.id === id ? { ...node, x: offsetX - 50, y: offsetY - 25 } : node))
    );
  };

  const handleNodeClick = (id) => {
    if (linkStart) {
      addLink(linkStart, id);
      setLinkStart(null);
    } else {
      setSelectedNode(nodes.find((node) => node.id === id));
    }
  };

  const handleContextMenu = (e, id) => {
    e.preventDefault();
    setLinkStart(id);
  };

  const saveMindMap = () => {
    const data = JSON.stringify({ nodes, links });
    localStorage.setItem("mindMap", data);
  };

  const loadMindMap = () => {
    const data = localStorage.getItem("mindMap");
    if (data) {
      const { nodes: savedNodes, links: savedLinks } = JSON.parse(data);
      setNodes(savedNodes);
      setLinks(savedLinks);
    }
  };

  const exportAsImage = () => {
    const canvas = canvasRef.current;
    const dataUrl = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.download = "mind-map.png";
    link.href = dataUrl;
    link.click();
  };

  const resetMindMap = () => {
    setNodes([]);
    setLinks([]);
    setSelectedNode(null);
    setLinkStart(null);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    links.forEach((link) => {
      const startNode = nodes.find((n) => n.id === link.start);
      const endNode = nodes.find((n) => n.id === link.end);
      if (startNode && endNode) {
        ctx.beginPath();
        ctx.moveTo(startNode.x + 100, startNode.y + 50);
        ctx.lineTo(endNode.x + 100, endNode.y + 50);
        ctx.strokeStyle = link.color;
        ctx.lineWidth = link.thickness;
        ctx.stroke();

        if (link.label) {
          ctx.fillStyle = link.color;
          ctx.textAlign = "center";
          ctx.fillText(
            link.label,
            (startNode.x + endNode.x) / 2 + 100,
            (startNode.y + endNode.y) / 2 + 50
          );
        }
      }
    });
  }, [nodes, links]);

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-4">Mind Map Generator</h1>
      <div className="flex flex-wrap gap-4 mb-4">
        <Dialog>
          <DialogTrigger asChild>
            <Button>Add Node</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Node</DialogTitle>
            </DialogHeader>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const title = e.target.title.value;
                const description = e.target.description.value;
                addNode(title, description);
                e.target.reset();
              }}
            >
              <Label htmlFor="title">Title</Label>
              <Input id="title" required />
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" />
              <Button type="submit" className="mt-4">
                Add Node
              </Button>
            </form>
          </DialogContent>
        </Dialog>
        <Button onClick={saveMindMap}>Save</Button>
        <Button onClick={loadMindMap}>Load</Button>
        <Button onClick={exportAsImage}>Export as Image</Button>
        <Button onClick={resetMindMap} variant="destructive">
          Reset
        </Button>
      </div>
      <div
        className="relative bg-white border rounded-lg"
        style={{ width: "100%", height: "70vh" }}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <canvas
          ref={canvasRef}
          width={1000}
          height={1000}
          className="absolute top-0 left-0 w-full h-full"
        />
        {nodes.map((node) => (
          <Node
            key={node.id}
            node={node}
            onDragStart={handleDragStart}
            onClick={handleNodeClick}
            onContextMenu={handleContextMenu}
          />
        ))}
        {links.map((link) => (
          <Link key={link.id} link={link} nodes={nodes} />
        ))}
      </div>
      {selectedNode && (
        <Dialog open={!!selectedNode} onOpenChange={() => setSelectedNode(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Node</DialogTitle>
            </DialogHeader>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const title = e.target.title.value;
                const description = e.target.description.value;
                updateNode(selectedNode.id, title, description);
                setSelectedNode(null);
              }}
            >
              <Label htmlFor="edit-title">Title</Label>
              <Input id="edit-title" defaultValue={selectedNode.title} required />
              <Label htmlFor="edit-description">Description</Label>
              <Textarea id="edit-description" defaultValue={selectedNode.description} />
              <div className="flex justify-between mt-4">
                <Button type="submit">Update Node</Button>
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => {
                    deleteNode(selectedNode.id);
                    setSelectedNode(null);
                  }}
                >
                  Delete Node
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}