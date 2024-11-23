import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

// Mocked math library functions (replace with actual math library in a real implementation)
const math = {
  parse: (expr) => ({ evaluate: (x) => Math.sin(x) }),
  derivative: (expr) => ({ evaluate: (x) => Math.cos(x) }),
  secondDerivative: (expr) => ({ evaluate: (x) => -Math.sin(x) }),
};

const Plot = ({ func, derivative, secondDerivative, tangentPoint }) => {
  return (
    <div className="w-full h-64 bg-gray-100 rounded-lg relative">
      {/* Placeholder for actual plot */}
      <div className="absolute inset-0 flex items-center justify-center text-gray-400">
        Graph Placeholder
      </div>
    </div>
  );
};

const FunctionInput = ({ onSubmit }) => {
  const [input, setInput] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(input);
  };

  return (
    <form onSubmit={handleSubmit} className="flex space-x-2">
      <Input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter function (e.g., sin(x))"
        className="flex-grow"
      />
      <Button type="submit">Plot</Button>
    </form>
  );
};

const AnalysisResults = ({ criticalPoints, inflectionPoints, extrema }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Analysis Results</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Critical Points: {criticalPoints.join(", ")}</p>
        <p>Inflection Points: {inflectionPoints.join(", ")}</p>
        <p>
          Extrema: {extrema.map((e) => `${e.type} at x=${e.x}`).join(", ")}
        </p>
      </CardContent>
    </Card>
  );
};

const TangentSlider = ({ onChange }) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="tangent-slider">Tangent Point</Label>
      <Slider
        id="tangent-slider"
        min={-10}
        max={10}
        step={0.1}
        onValueChange={([value]) => onChange(value)}
      />
    </div>
  );
};

export default function App() {
  const [func, setFunc] = useState(null);
  const [derivative, setDerivative] = useState(null);
  const [secondDerivative, setSecondDerivative] = useState(null);
  const [tangentPoint, setTangentPoint] = useState(0);
  const [criticalPoints, setCriticalPoints] = useState([]);
  const [inflectionPoints, setInflectionPoints] = useState([]);
  const [extrema, setExtrema] = useState([]);

  const analyzeFunction = useCallback(() => {
    if (!func) return;

    // Placeholder calculations (replace with actual calculations in a real implementation)
    setCriticalPoints([0, Math.PI]);
    setInflectionPoints([Math.PI / 2, (3 * Math.PI) / 2]);
    setExtrema([
      { type: "Maximum", x: 0 },
      { type: "Minimum", x: Math.PI },
    ]);
  }, [func]);

  useEffect(() => {
    analyzeFunction();
  }, [analyzeFunction]);

  const handleFunctionSubmit = (input) => {
    const parsedFunc = math.parse(input);
    setFunc(parsedFunc);
    setDerivative(math.derivative(parsedFunc));
    setSecondDerivative(math.secondDerivative(parsedFunc));
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold text-center">
        Calculus Exploration Tool
      </h1>
      <FunctionInput onSubmit={handleFunctionSubmit} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Function Plot</CardTitle>
          </CardHeader>
          <CardContent>
            <Plot
              func={func}
              derivative={derivative}
              secondDerivative={secondDerivative}
              tangentPoint={tangentPoint}
            />
            <TangentSlider onChange={setTangentPoint} />
          </CardContent>
        </Card>
        <AnalysisResults
          criticalPoints={criticalPoints}
          inflectionPoints={inflectionPoints}
          extrema={extrema}
        />
      </div>
    </div>
  );
}