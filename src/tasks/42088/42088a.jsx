import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const colors = ["red", "blue", "green", "purple", "orange"];

function evaluateExpression(expression, x) {
  try {
    return Function("x", `return ${expression}`)(x);
  } catch (error) {
    return NaN;
  }
}

function Graph({ equations, axisColor, backgroundColor }) {
  const canvasRef = useRef(null);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const { width, height } = canvas;

    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = axisColor;
    ctx.beginPath();
    ctx.moveTo(0, height / 2);
    ctx.lineTo(width, height / 2);
    ctx.moveTo(width / 2, 0);
    ctx.lineTo(width / 2, height);
    ctx.stroke();

    equations.forEach(({ expression, color, visible }) => {
      if (!visible) return;

      ctx.strokeStyle = color;
      ctx.beginPath();

      for (let px = 0; px < width; px++) {
        const x = ((px - width / 2) / zoom - pan.x) / 50;
        const y = evaluateExpression(expression, x);
        const py = height / 2 - y * 50 * zoom + pan.y * 50;

        if (px === 0) {
          ctx.moveTo(px, py);
        } else {
          ctx.lineTo(px, py);
        }
      }

      ctx.stroke();
    });
  }, [equations, axisColor, backgroundColor, pan, zoom]);

  const handlePan = (dx, dy) => setPan(p => ({ x: p.x + dx, y: p.y + dy }));
  const handleZoom = (factor) => setZoom(z => Math.max(0.1, z * factor));

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        width={600}
        height={400}
        className="border border-gray-300"
      />
      <div className="absolute bottom-2 right-2 space-x-2">
        <Button onClick={() => handlePan(-0.1, 0)}>←</Button>
        <Button onClick={() => handlePan(0.1, 0)}>→</Button>
        <Button onClick={() => handlePan(0, 0.1)}>↑</Button>
        <Button onClick={() => handlePan(0, -0.1)}>↓</Button>
        <Button onClick={() => handleZoom(1.1)}>+</Button>
        <Button onClick={() => handleZoom(0.9)}>-</Button>
      </div>
    </div>
  );
}

export default function App() {
  const [equations, setEquations] = useState([]);
  const [currentEquation, setCurrentEquation] = useState("");
  const [axisColor, setAxisColor] = useState("#000000");
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");

  const addEquation = () => {
    if (currentEquation) {
      setEquations([
        ...equations,
        {
          expression: currentEquation,
          color: colors[equations.length % colors.length],
          visible: true,
        },
      ]);
      setCurrentEquation("");
    }
  };

  const toggleEquation = (index) => {
    setEquations(
      equations.map((eq, i) =>
        i === index ? { ...eq, visible: !eq.visible } : eq
      )
    );
  };

  const resetGraph = () => {
    setEquations([]);
    setCurrentEquation("");
  };

  const exportGraph = () => {
    const canvas = document.querySelector("canvas");
    const dataURL = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.download = "graph.png";
    link.href = dataURL;
    link.click();
  };

  const exportJSON = () => {
    const data = JSON.stringify(equations);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = "graph_data.json";
    link.href = url;
    link.click();
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Graph Plotter</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Graph</CardTitle>
          </CardHeader>
          <CardContent>
            <Graph
              equations={equations}
              axisColor={axisColor}
              backgroundColor={backgroundColor}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Controls</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="equation">Equation (y=f(x))</Label>
                <div className="flex space-x-2">
                  <Input
                    id="equation"
                    value={currentEquation}
                    onChange={(e) => setCurrentEquation(e.target.value)}
                    placeholder="e.g., Math.sin(x)"
                  />
                  <Button onClick={addEquation}>Add</Button>
                </div>
              </div>
              <div>
                <Label htmlFor="axisColor">Axis Color</Label>
                <Input
                  id="axisColor"
                  type="color"
                  value={axisColor}
                  onChange={(e) => setAxisColor(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="backgroundColor">Background Color</Label>
                <Input
                  id="backgroundColor"
                  type="color"
                  value={backgroundColor}
                  onChange={(e) => setBackgroundColor(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                {equations.map((eq, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Switch
                      checked={eq.visible}
                      onCheckedChange={() => toggleEquation(index)}
                    />
                    <span style={{ color: eq.color }}>{eq.expression}</span>
                  </div>
                ))}
              </div>
              <div className="space-x-2">
                <Button onClick={resetGraph}>Reset</Button>
                <Button onClick={exportGraph}>Export PNG</Button>
                <Button onClick={exportJSON}>Export JSON</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}