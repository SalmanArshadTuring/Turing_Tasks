import React, { useState, useEffect } from 'react';
import * as math from 'mathjs'; // Import Math.js
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Plot from 'react-plotly.js';

function FunctionPlot({ functionString, range, derivative = 0 }) {
  const [x, setX] = useState([]);
  const [y, setY] = useState([]);

  useEffect(() => {
    const newX = Array.from({ length: 100 }, (_, i) => range[0] + (i * (range[1] - range[0]) / 100));
    setX(newX);

    const f = math.compile(functionString); // Compile the function
    const yValues = newX.map((x) => {
      try {
        return derivative === 0
          ? f.evaluate({ x: x })
          : derivative === 1
          ? math.derivative(functionString, 'x').evaluate({ x: x })
          : math.derivative(math.derivative(functionString, 'x'), 'x').evaluate({ x: x });
      } catch (e) {
        return NaN; // Handle any evaluation errors
      }
    });
    setY(yValues);
  }, [functionString, range, derivative]);

  return (
    <Plot
      data={[
        { x, y, type: 'scatter', mode: 'lines', name: `f${derivative > 0 ? `'`.repeat(derivative) : ''}(x)` },
      ]}
      layout={{ width: 320, height: 240, title: `Function Plot${derivative > 0 ? `'`.repeat(derivative) : ''}` }}
    />
  );
}

function App() {
  const [functionString, setFunctionString] = useState('x^2'); // Default function
  const [range, setRange] = useState([-10, 10]); // Default range
  const [tangentX, setTangentX] = useState(0); // Default tangent point

  const calculateCriticalPoints = () => {
    try {
      const derivative = math.derivative(functionString, 'x'); // Compute the first derivative
      const criticalPoints = [];
      for (let x = range[0]; x <= range[1]; x += 0.1) {
        if (Math.abs(derivative.evaluate({ x })) < 1e-6) {
          criticalPoints.push(x.toFixed(2)); // Store critical points where derivative is near zero
        }
      }
      return `Critical points at: x = ${criticalPoints.join(', ')}`;
    } catch (e) {
      console.error("Error calculating critical points:", e);
      return "Error calculating critical points.";
    }
  };

  return (
    <div className="flex flex-col items-center p-4 space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
      <Card className="w-full sm:max-w-sm">
        <CardHeader>
          <CardTitle>Function Input</CardTitle>
        </CardHeader>
        <CardContent>
          <Label htmlFor="function">Enter Function:</Label>
          <Input
            id="function"
            value={functionString}
            onChange={(e) => setFunctionString(e.target.value)}
          />
          <Label htmlFor="range">Range:</Label>
          <Slider
            defaultValue={[-10, 10]}
            max={20}
            min={-20}
            step={1}
            onValueChange={setRange}
          />
        </CardContent>
      </Card>

      <div className="flex-1 space-y-4">
        {/* Plots */}
        <FunctionPlot functionString={functionString} range={range} />
        <FunctionPlot functionString={functionString} range={range} derivative={1} />
        <FunctionPlot functionString={functionString} range={range} derivative={2} />

        {/* Tangent and Critical Points */}
        <Card>
          <CardContent>
            <Label>Tangent at x:</Label>
            <Slider
              defaultValue={[0]}
              max={range[1]}
              min={range[0]}
              step={0.1}
              onValueChange={setTangentX}
            />
            <Button onClick={calculateCriticalPoints}>Find Critical Points</Button>
            <p>{calculateCriticalPoints()}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default App;
