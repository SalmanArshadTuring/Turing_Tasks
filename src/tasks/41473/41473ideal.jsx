import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function App() {
  const [functionStr, setFunctionStr] = useState('sin(x)');
  const [parsedFunction, setParsedFunction] = useState((x) => Math.sin(x));
  const [dataPoints, setDataPoints] = useState([]);
  const [firstDerivativePoints, setFirstDerivativePoints] = useState([]);
  const [secondDerivativePoints, setSecondDerivativePoints] = useState([]);
  const [criticalPoints, setCriticalPoints] = useState([]);
  const [inflectionPoints, setInflectionPoints] = useState([]);
  const [tangentX, setTangentX] = useState(0);

  function parseFunction(functionStr) {
    let parsedStr = functionStr;

    // Replace '^' with '**' for exponentiation
    parsedStr = parsedStr.replace(/\^/g, '**');

    // Replace mathematical functions with Math equivalents
    const functions = ['sin', 'cos', 'tan', 'asin', 'acos', 'atan', 'sqrt', 'abs', 'log', 'ln', 'exp'];
    functions.forEach((func) => {
      const regex = new RegExp(`\\b${func}\\b`, 'g');
      const replacement = func === 'ln' ? 'Math.log' : `Math.${func}`;
      parsedStr = parsedStr.replace(regex, replacement);
    });

    return parsedStr;
  }

  useEffect(() => {
    try {
      const processedFunctionStr = parseFunction(functionStr);
      const func = new Function('x', `return ${processedFunctionStr}`);
      // Test the function with a sample input
      func(0);
      setParsedFunction(() => func);
    } catch (error) {
      console.error('Invalid function');
      setParsedFunction(null);
    }
  }, [functionStr]);

  useEffect(() => {
    if (!parsedFunction) {
      setDataPoints([]);
      setFirstDerivativePoints([]);
      setSecondDerivativePoints([]);
      setCriticalPoints([]);
      setInflectionPoints([]);
      return;
    }

    const xValues = [];
    const yValues = [];
    const dyValues = [];
    const ddyValues = [];
    const delta = 0.1;
    const xMin = -10;
    const xMax = 10;

    for (let x = xMin; x <= xMax; x += delta) {
      xValues.push(x);
      try {
        const y = parsedFunction(x);
        yValues.push(y);

        const h = 0.0001;
        const dy = (parsedFunction(x + h) - parsedFunction(x - h)) / (2 * h);
        dyValues.push(dy);

        const ddy =
          (parsedFunction(x + h) - 2 * parsedFunction(x) + parsedFunction(x - h)) /
          (h * h);
        ddyValues.push(ddy);
      } catch (error) {
        yValues.push(null);
        dyValues.push(null);
        ddyValues.push(null);
      }
    }

    setDataPoints(
      xValues.map((x, i) => ({ x, y: yValues[i] })).filter((p) => p.y !== null && isFinite(p.y))
    );
    setFirstDerivativePoints(
      xValues.map((x, i) => ({ x, y: dyValues[i] })).filter((p) => p.y !== null && isFinite(p.y))
    );
    setSecondDerivativePoints(
      xValues.map((x, i) => ({ x, y: ddyValues[i] })).filter((p) => p.y !== null && isFinite(p.y))
    );

    const criticals = [];
    const inflections = [];

    for (let i = 1; i < dyValues.length; i++) {
      if (
        dyValues[i - 1] * dyValues[i] <= 0 &&
        dyValues[i - 1] !== null &&
        dyValues[i] !== null
      ) {
        const xCritical = xValues[i];
        const yCritical = yValues[i];
        criticals.push({ x: xCritical, y: yCritical });
      }
      if (
        ddyValues[i - 1] * ddyValues[i] <= 0 &&
        ddyValues[i - 1] !== null &&
        ddyValues[i] !== null
      ) {
        const xInflection = xValues[i];
        const yInflection = yValues[i];
        inflections.push({ x: xInflection, y: yInflection });
      }
    }

    setCriticalPoints(criticals);
    setInflectionPoints(inflections);
  }, [parsedFunction]);

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Calculus Explorer</CardTitle>
        </CardHeader>
        <CardContent>
          <FunctionInput functionStr={functionStr} setFunctionStr={setFunctionStr} />
          <Graph
            dataPoints={dataPoints}
            firstDerivativePoints={firstDerivativePoints}
            secondDerivativePoints={secondDerivativePoints}
            criticalPoints={criticalPoints}
            inflectionPoints={inflectionPoints}
            tangentX={tangentX}
            parsedFunction={parsedFunction}
          />
          <TangentSlider tangentX={tangentX} setTangentX={setTangentX} xMin={-10} xMax={10} />
          <Calculations criticalPoints={criticalPoints} inflectionPoints={inflectionPoints} />
          <DefiniteIntegral parsedFunction={parsedFunction} />
          <StepByStep functionStr={functionStr} />
        </CardContent>
      </Card>
    </div>
  );
}

function FunctionInput({ functionStr, setFunctionStr }) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium mb-2">Enter Function f(x):</label>
      <input
        type="text"
        value={functionStr}
        onChange={(e) => setFunctionStr(e.target.value)}
        className="w-full p-2 border rounded"
        placeholder="e.g., sin(x), x^2, ln(x)"
      />
    </div>
  );
}

function Graph({
  dataPoints,
  firstDerivativePoints,
  secondDerivativePoints,
  criticalPoints,
  inflectionPoints,
  tangentX,
  parsedFunction,
}) {
  if (!dataPoints || dataPoints.length === 0) {
    return <div className="my-4">No data to display.</div>;
  }

  const width = 600;
  const height = 400;
  const margin = 40;

  const allYValues = dataPoints
    .map((p) => p.y)
    .concat(
      firstDerivativePoints.map((p) => p.y),
      secondDerivativePoints.map((p) => p.y)
    );
  const yMin = Math.min(...allYValues);
  const yMax = Math.max(...allYValues);

  const xMin = dataPoints[0].x;
  const xMax = dataPoints[dataPoints.length - 1].x;

  const xScale = (x) =>
    ((x - xMin) / (xMax - xMin)) * (width - 2 * margin) + margin;
  const yScale = (y) =>
    height - margin - ((y - yMin) / (yMax - yMin)) * (height - 2 * margin);

  const generatePath = (points) => {
    let path = '';
    points.forEach((p, i) => {
      if (p.y !== null && !isNaN(p.y) && isFinite(p.y)) {
        const x = xScale(p.x);
        const y = yScale(p.y);
        if (i === 0) {
          path += `M ${x} ${y} `;
        } else {
          path += `L ${x} ${y} `;
        }
      }
    });
    return path;
  };

  const functionPath = generatePath(dataPoints);
  const firstDerivativePath = generatePath(firstDerivativePoints);
  const secondDerivativePath = generatePath(secondDerivativePoints);

  let tangentPath = '';
  if (parsedFunction) {
    const tangentY = parsedFunction(tangentX);
    const tangentSlope =
      (parsedFunction(tangentX + 0.0001) - parsedFunction(tangentX - 0.0001)) /
      0.0002;
    const tangentLinePoints = [
      { x: xMin, y: tangentY + tangentSlope * (xMin - tangentX) },
      { x: xMax, y: tangentY + tangentSlope * (xMax - tangentX) },
    ];
    tangentPath = generatePath(tangentLinePoints);
  }

  return (
    <div className="my-4 overflow-x-auto">
      <svg width={width} height={height} className="border">
        <line
          x1={xScale(xMin)}
          y1={yScale(0)}
          x2={xScale(xMax)}
          y2={yScale(0)}
          stroke="black"
        />
        <line
          x1={xScale(0)}
          y1={yScale(yMin)}
          x2={xScale(0)}
          y2={yScale(yMax)}
          stroke="black"
        />
        <path d={functionPath} stroke="blue" fill="none" />
        <path d={firstDerivativePath} stroke="red" fill="none" />
        <path d={secondDerivativePath} stroke="green" fill="none" />
        {tangentPath && <path d={tangentPath} stroke="purple" fill="none" />}
        {criticalPoints.map((p, i) => (
          <circle
            key={i}
            cx={xScale(p.x)}
            cy={yScale(p.y)}
            r={3}
            fill="orange"
          />
        ))}
        {inflectionPoints.map((p, i) => (
          <rect
            key={i}
            x={xScale(p.x) - 3}
            y={yScale(p.y) - 3}
            width={6}
            height={6}
            fill="cyan"
          />
        ))}
      </svg>
      <div className="flex flex-wrap justify-between mt-2 text-sm">
        <div>
          <span className="text-blue-500">Blue</span>: f(x)
        </div>
        <div>
          <span className="text-red-500">Red</span>: f'(x)
        </div>
        <div>
          <span className="text-green-500">Green</span>: f''(x)
        </div>
        <div>
          <span className="text-purple-500">Purple</span>: Tangent at x = {tangentX}
        </div>
      </div>
    </div>
  );
}

function TangentSlider({ tangentX, setTangentX, xMin, xMax }) {
  return (
    <div className="my-4">
      <label className="block text-sm font-medium mb-2">
        Adjust Tangent Point (x):
      </label>
      <input
        type="range"
        min={xMin}
        max={xMax}
        step="0.1"
        value={tangentX}
        onChange={(e) => setTangentX(parseFloat(e.target.value))}
        className="w-full"
      />
      <div className="text-sm mt-1">x = {tangentX}</div>
    </div>
  );
}

function Calculations({ criticalPoints, inflectionPoints }) {
  return (
    <div className="my-4">
      <h2 className="text-lg font-medium mb-2">Key Points</h2>
      <div>
        <h3 className="font-medium">Critical Points (Maxima and Minima):</h3>
        {criticalPoints.length > 0 ? (
          <ul className="list-disc ml-5">
            {criticalPoints.map((p, i) => (
              <li key={i}>
                x = {p.x.toFixed(4)}, y = {p.y.toFixed(4)}
              </li>
            ))}
          </ul>
        ) : (
          <p>None found.</p>
        )}
      </div>
      <div className="mt-2">
        <h3 className="font-medium">Inflection Points:</h3>
        {inflectionPoints.length > 0 ? (
          <ul className="list-disc ml-5">
            {inflectionPoints.map((p, i) => (
              <li key={i}>
                x = {p.x.toFixed(4)}, y = {p.y.toFixed(4)}
              </li>
            ))}
          </ul>
        ) : (
          <p>None found.</p>
        )}
      </div>
    </div>
  );
}

function DefiniteIntegral({ parsedFunction }) {
  const [range, setRange] = useState({ a: 0, b: 1 });
  const [integralValue, setIntegralValue] = useState(0);

  useEffect(() => {
    if (!parsedFunction) {
      setIntegralValue(0);
      return;
    }

    const n = 1000;
    const h = (range.b - range.a) / n;
    let sum = 0;
    for (let i = 0; i <= n; i++) {
      const x = range.a + i * h;
      try {
        const y = parsedFunction(x);
        if (!isFinite(y)) continue;
        if (i === 0 || i === n) {
          sum += y / 2;
        } else {
          sum += y;
        }
      } catch (error) {}
    }
    const integral = sum * h;
    setIntegralValue(integral);
  }, [parsedFunction, range]);

  return (
    <div className="my-4">
      <label className="block text-sm font-medium mb-2">
        Calculate Definite Integral:
      </label>
      <div className="flex items-center space-x-2">
        <input
          type="number"
          value={range.a}
          onChange={(e) => setRange({ ...range, a: parseFloat(e.target.value) })}
          className="w-20 p-2 border rounded"
          placeholder="a"
        />
        <span>to</span>
        <input
          type="number"
          value={range.b}
          onChange={(e) => setRange({ ...range, b: parseFloat(e.target.value) })}
          className="w-20 p-2 border rounded"
          placeholder="b"
        />
      </div>
      <div className="mt-2 text-sm">
        ∫ f(x) dx from {range.a} to {range.b} = {integralValue.toFixed(4)}
      </div>
    </div>
  );
}

function StepByStep({ functionStr }) {
  const [steps, setSteps] = useState([]);

  useEffect(() => {
    const isPolynomial = /^[\d\s\+\-\*x\^\(\)]+$/.test(functionStr);
    if (!isPolynomial) {
      setSteps([
        'Step-by-step derivative calculations are only available for polynomials.',
      ]);
      return;
    }

    const terms = functionStr
      .replace(/\s+/g, '')
      .replace(/-/g, '+-')
      .split('+')
      .filter((t) => t);

    const derivativeTerms = terms
      .map((term) => {
        const match = term.match(/([+-]?[\d\.]*)\*?x(?:\^([\d\.]+))?/);
        if (match) {
          const coef = parseFloat(match[1] || '1');
          const exp = parseFloat(match[2] || '1');
          const newCoef = coef * exp;
          const newExp = exp - 1;
          if (newExp === 0) {
            return `${newCoef}`;
          } else if (newExp === 1) {
            return `${newCoef}x`;
          } else {
            return `${newCoef}x^${newExp}`;
          }
        } else if (/^[+-]?[\d\.]+$/.test(term)) {
          return null;
        } else {
          return null;
        }
      })
      .filter((t) => t !== null);

    const derivativeStr = derivativeTerms.join(' + ');

    setSteps([
      'Given function: f(x) = ' + functionStr,
      'Derivative steps:',
      "f'(x) = " + derivativeStr,
    ]);
  }, [functionStr]);

  return (
    <div className="my-4">
      <h2 className="text-lg font-medium mb-2">Step-by-Step Derivative Calculation</h2>
      {steps.map((step, i) => (
        <p key={i}>{step}</p>
      ))}
    </div>
  );
}
