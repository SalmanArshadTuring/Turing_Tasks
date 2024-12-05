import React, { useState, useRef, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import Plot from "react-plotly.js";

const colors = [
  "#636EFA",
  "#EF553B",
  "#00CC96",
  "#AB63FA",
  "#FFA15A",
  "#19D3F3",
  "#FF6692",
];

function GraphEquation({ equation, color, onToggle, onRemove, index }) {
  return (
    <div className="flex items-center justify-between mb-2">
      <Switch
        id={`toggle-${index}`}
        checked={equation.visible}
        onChange={() => onToggle(index)}
      />
      <Label htmlFor={`toggle-${index}`} className="ml-2">
        {equation.expr}
      </Label>
      <Button
        variant="ghost"
        onClick={() => onRemove(index)}
        className="text-red-500 hover:text-red-700"
      >
        Remove
      </Button>
    </div>
  );
}

export default function App() {
  const [equations, setEquations] = useState([{ expr: "x**2", visible: true }]);
  const [currentEquation, setCurrentEquation] = useState("");
  const [graphConfig, setGraphConfig] = useState({
    lineColor: "#636EFA",
    axesColor: "#000000",
    bgColor: "#FFFFFF",
    zoom: 1,
  });
  const plotRef = useRef(null);

  const handleEquationSubmit = (e) => {
    e.preventDefault();
    if (currentEquation) {
      setEquations([
        ...equations,
        {
          expr: currentEquation,
          visible: true,
          color: colors[equations.length % colors.length],
        },
      ]);
      setCurrentEquation("");
    }
  };

  const generateData = () => {
    return equations
      .map((eq, idx) => {
        if (!eq.visible) return null;
        const x = Array.from({ length: 100 }, (_, i) => i / 10 - 5);
        const y = x.map((x) => {
          try {
            return Function("x", `return ${eq.expr}`)(x);
          } catch (e) {
            return NaN;
          }
        });
        return {
          x,
          y,
          type: "scatter",
          mode: "lines",
          name: eq.expr,
          line: { color: eq.color || colors[idx % colors.length] },
        };
      })
      .filter(Boolean);
  };

  const handleExport = () => {
    const data = {
      equations: equations,
      config: graphConfig,
    };
    const blob = new Blob([JSON.stringify(data)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "graph_data.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    setEquations([{ expr: "x**2", visible: true }]);
    setGraphConfig({
      lineColor: "#636EFA",
      axesColor: "#000000",
      bgColor: "#FFFFFF",
      zoom: 1,
    });
  };

  useEffect(() => {
    if (plotRef.current) {
      plotRef.current.resizeHandler();
    }
  }, [equations]);

  return (
    <div className="container mx-auto p-4 sm:p-8">
      <Card>
        <CardHeader>
          <CardTitle>Graph Plotter</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleEquationSubmit} className="mb-4">
            <div className="flex flex-col sm:flex-row gap-2">
              <Input
                value={currentEquation}
                onChange={(e) => setCurrentEquation(e.target.value)}
                placeholder="Enter equation, e.g., sin(x)"
                className="flex-grow"
              />
              <Button type="submit">Add Equation</Button>
            </div>
          </form>

          <div className="mb-4">
            {equations.map((eq, idx) => (
              <GraphEquation
                key={idx}
                index={idx}
                equation={eq}
                color={eq.color}
                onToggle={(index) =>
                  setEquations(
                    equations.map((e, i) =>
                      i === index ? { ...e, visible: !e.visible } : e
                    )
                  )
                }
                onRemove={(index) =>
                  setEquations(equations.filter((_, i) => i !== index))
                }
              />
            ))}
          </div>

          <div className="mb-4">
            <Label>Graph Settings</Label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              <Select
                onValueChange={(value) =>
                  setGraphConfig({ ...graphConfig, lineColor: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Line Color" />
                </SelectTrigger>
                <SelectContent>
                  {colors.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                onValueChange={(value) =>
                  setGraphConfig({ ...graphConfig, axesColor: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Axes Color" />
                </SelectTrigger>
                <SelectContent>
                  {colors.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                onValueChange={(value) =>
                  setGraphConfig({ ...graphConfig, bgColor: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Background Color" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="#FFFFFF">White</SelectItem>
                  <SelectItem value="#000000">Black</SelectItem>
                </SelectContent>
              </Select>
              <Slider
                defaultValue={[1]}
                min={0.5}
                max={2}
                step={0.1}
                onValueChange={(v) =>
                  setGraphConfig({ ...graphConfig, zoom: v[0] })
                }
              />
            </div>
          </div>

          <Plot
            data={generateData()}
            layout={{
              width: "100%",
              height: 400,
              plot_bgcolor: graphConfig.bgColor,
              paper_bgcolor: graphConfig.bgColor,
              xaxis: { color: graphConfig.axesColor },
              yaxis: { color: graphConfig.axesColor },
              legend: { font: { color: graphConfig.axesColor } },
              autosize: true,
            }}
            config={{ responsive: true, displayModeBar: false }}
            style={{ width: "100%" }}
            useResizeHandler={true}
            ref={plotRef}
          />
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button onClick={handleExport}>Export</Button>
          <Button onClick={handleReset}>Reset</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
