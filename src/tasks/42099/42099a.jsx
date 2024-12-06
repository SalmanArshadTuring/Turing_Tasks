
import React, { useState, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Mock quantum operations for simplicity
const gates = {
  H: 'Hadamard',
  X: 'Pauli-X',
  Y: 'Pauli-Y',
  Z: 'Pauli-Z',
  CNOT: 'CNOT'
};

function QuantumGate({ type, onRemove, qubitIndex, gateIndex }) {
  return (
    <div className="bg-secondary p-2 rounded-md mb-2">
      <span>{gates[type]}</span>
      <Button className="ml-2" variant="destructive" size="icon" onClick={() => onRemove(qubitIndex, gateIndex)}>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </Button>
    </div>
  );
}

function Qubit({ index, gates, onAddGate, onRemoveGate }) {
  return (
    <div className="border-b border-gray-300 pb-4 mb-4">
      <h3 className="text-lg font-semibold">Qubit {index + 1}</h3>
      {gates.map((gate, gIdx) => (
        <QuantumGate key={gIdx} type={gate} qubitIndex={index} gateIndex={gIdx} onRemove={onRemoveGate} />
      ))}
      <select onChange={(e) => onAddGate(index, e.target.value)} className="mt-2">
        <option value="">Add Gate</option>
        {Object.entries(gates).map(([key, value]) => (
          <option key={key} value={key}>{value}</option>
        ))}
      </select>
    </div>
  );
}

function App() {
  const [qubits, setQubits] = useState([[]]);
  const [circuitName, setCircuitName] = useState('');

  const addQubit = () => {
    if (qubits.length < 5) {
      setQubits(prev => [...prev, []]);
    }
  };

  const removeQubit = () => {
    if (qubits.length > 1) {
      setQubits(prev => prev.slice(0, -1));
    }
  };

  const addGate = (qubitIndex, gate) => {
    if (gate) {
      setQubits(prev => prev.map((q, idx) => idx === qubitIndex ? [...q, gate] : q));
    }
  };

  const removeGate = (qubitIndex, gateIndex) => {
    setQubits(prev => prev.map((q, idx) => 
      idx === qubitIndex ? q.filter((_, i) => i !== gateIndex) : q
    ));
  };

  const simulateCircuit = () => {
    // Here would be the logic to simulate the circuit
    alert('Simulation would run here with current circuit configuration.');
  };

  const saveCircuit = () => {
    const circuit = { name: circuitName, qubits: qubits };
    // In a real app, you'd save this to local storage or a backend
    console.log('Saved Circuit:', circuit);
  };

  const resetCircuit = () => {
    setQubits([[]]);
    setCircuitName('');
  };

  return (
    <div className="container mx-auto p-4 sm:p-6">
      <Card>
        <CardHeader>
          <CardTitle>Quantum Circuit Designer</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Label htmlFor="circuitName">Circuit Name</Label>
            <Input id="circuitName" value={circuitName} onChange={e => setCircuitName(e.target.value)} placeholder="My Quantum Circuit" />
          </div>
          {qubits.map((gates, idx) => (
            <Qubit key={idx} index={idx} gates={gates} onAddGate={addGate} onRemoveGate={removeGate} />
          ))}
          <div className="flex justify-between mt-4">
            <Button onClick={addQubit} disabled={qubits.length >= 5}>Add Qubit</Button>
            <Button onClick={removeQubit} disabled={qubits.length <= 1}>Remove Qubit</Button>
          </div>
          <div className="mt-6 space-x-4">
            <Button onClick={simulateCircuit}>Execute</Button>
            <Button onClick={saveCircuit}>Save</Button>
            <Button onClick={resetCircuit}>Reset</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;