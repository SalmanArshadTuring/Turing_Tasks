import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

const MAX_QUBITS = 5;
const GATES = ["H", "X", "Y", "Z", "CNOT"];

function QuantumGate({ gate, onClick, isDragging }) {
  return (
    <div
      className={`w-10 h-10 bg-blue-500 text-white flex items-center justify-center rounded cursor-move ${
        isDragging ? "opacity-50" : ""
      }`}
      onClick={onClick}
      draggable
      onDragStart={(e) => e.dataTransfer.setData("text/plain", gate)}
    >
      {gate}
    </div>
  );
}

function Qubit({ index, gates, onDrop, onRemoveGate }) {
  return (
    <div className="flex items-center space-x-2 mb-2">
      <span className="w-8">Q{index}</span>
      <div
        className="flex-1 h-12 bg-gray-200 rounded flex items-center"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const gate = e.dataTransfer.getData("text");
          onDrop(index, gate);
        }}
      >
        {gates.map((gate, gateIndex) => (
          <div
            key={gateIndex}
            className="w-10 h-10 bg-blue-500 text-white flex items-center justify-center rounded mr-1 relative"
            onClick={() => onRemoveGate(index, gateIndex)}
          >
            {gate}
            <span className="absolute top-0 right-0 text-xs">{gateIndex + 1}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function StateVisualization({ state }) {
  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Qubit State</CardTitle>
      </CardHeader>
      <CardContent>
        <pre className="text-sm">{JSON.stringify(state, null, 2)}</pre>
      </CardContent>
    </Card>
  );
}

export default function App() {
  const [qubits, setQubits] = useState(2);
  const [circuit, setCircuit] = useState(Array(MAX_QUBITS).fill([]));
  const [state, setState] = useState({ "00": 1 });
  const [comments, setComments] = useState({});
  const [savedCircuits, setSavedCircuits] = useState({});
  const [currentCircuitName, setCurrentCircuitName] = useState("");

  useEffect(() => {
    updateState();
  }, [circuit]);

  const updateState = () => {
    // Simplified state update logic (not a real quantum simulation)
    const newState = {};
    const stateKeys = Object.keys(state);
    stateKeys.forEach((key) => {
      let newKey = key;
      circuit.forEach((qubitGates, qubitIndex) => {
        qubitGates.forEach((gate) => {
          if (gate === "X") {
            newKey = newKey.slice(0, qubitIndex) + (newKey[qubitIndex] === "0" ? "1" : "0") + newKey.slice(qubitIndex + 1);
          }
        });
      });
      newState[newKey] = (newState[newKey] || 0) + state[key];
    });
    setState(newState);
  };

  const addQubit = () => {
    if (qubits < MAX_QUBITS) {
      setQubits(qubits + 1);
      updateState();
    }
  };

  const removeQubit = () => {
    if (qubits > 1) {
      setQubits(qubits - 1);
      setCircuit((prev) => {
        const newCircuit = [...prev];
        newCircuit[qubits - 1] = [];
        return newCircuit;
      });
      updateState();
    }
  };

  const addGate = (qubitIndex, gate) => {
    setCircuit((prev) => {
      const newCircuit = [...prev];
      newCircuit[qubitIndex] = [...newCircuit[qubitIndex], gate];
      return newCircuit;
    });
  };

  const removeGate = (qubitIndex, gateIndex) => {
    setCircuit((prev) => {
      const newCircuit = [...prev];
      newCircuit[qubitIndex] = newCircuit[qubitIndex].filter((_, i) => i !== gateIndex);
      return newCircuit;
    });
  };

  const resetCircuit = () => {
    setCircuit(Array(MAX_QUBITS).fill([]));
    setComments({});
    setCurrentCircuitName("");
  };

  const saveCircuit = () => {
    if (currentCircuitName) {
      setSavedCircuits((prev) => ({
        ...prev,
        [currentCircuitName]: { circuit, comments }
      }));
    }
  };

  const loadCircuit = (name) => {
    if (savedCircuits[name]) {
      setCircuit(savedCircuits[name].circuit);
      setComments(savedCircuits[name].comments);
      setCurrentCircuitName(name);
    }
  };

  const addComment = (qubitIndex, gateIndex, comment) => {
    setComments((prev) => ({
      ...prev,
      [`${qubitIndex}-${gateIndex}`]: comment
    }));
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Quantum Circuit Designer</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Circuit Design</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-2 mb-4">
              {GATES.map((gate) => (
                <QuantumGate key={gate} gate={gate} />
              ))}
            </div>
            {Array.from({ length: qubits }).map((_, i) => (
              <Qubit
                key={i}
                index={i}
                gates={circuit[i]}
                onDrop={addGate}
                onRemoveGate={removeGate}
              />
            ))}
            <div className="mt-4">
              <Button onClick={addQubit} disabled={qubits >= MAX_QUBITS}>
                Add Qubit
              </Button>
              <Button onClick={removeQubit} disabled={qubits <= 1} className="ml-2">
                Remove Qubit
              </Button>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Controls</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Input
                placeholder="Circuit Name"
                value={currentCircuitName}
                onChange={(e) => setCurrentCircuitName(e.target.value)}
              />
              <Button onClick={saveCircuit}>Save Circuit</Button>
              <Button onClick={resetCircuit}>Reset Circuit</Button>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>Load Circuit</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Load Circuit</DialogTitle>
                    <DialogDescription>Select a circuit to load</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-2">
                    {Object.keys(savedCircuits).map((name) => (
                      <Button key={name} onClick={() => loadCircuit(name)}>
                        {name}
                      </Button>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>
      </div>
      <StateVisualization state={state} />
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Comments</CardTitle>
        </CardHeader>
        <CardContent>
          {Object.entries(comments).map(([key, comment]) => (
            <div key={key} className="mb-2">
              <Label>{`Qubit ${key.split("-")[0]}, Gate ${parseInt(key.split("-")[1]) + 1}`}</Label>
              <Textarea value={comment} onChange={(e) => addComment(...key.split("-"), e.target.value)} />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}