import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

// Periodic table data (abbreviated for brevity)
const elements = [
  { number: 1, symbol: "H", name: "Hydrogen", group: "Nonmetal" },
  { number: 2, symbol: "He", name: "Helium", group: "Noble Gas" },
  { number: 3, symbol: "Li", name: "Lithium", group: "Alkali Metal" },
  { number: 4, symbol: "Be", name: "Beryllium", group: "Alkaline Earth Metal" },
  { number: 5, symbol: "B", name: "Boron", group: "Metalloid" },
  { number: 6, symbol: "C", name: "Carbon", group: "Nonmetal" },
  { number: 7, symbol: "N", name: "Nitrogen", group: "Nonmetal" },
  { number: 8, symbol: "O", name: "Oxygen", group: "Nonmetal" },
  // Add more elements as needed
];

const groupColors = {
  "Nonmetal": "bg-green-200",
  "Noble Gas": "bg-purple-200",
  "Alkali Metal": "bg-red-200",
  "Alkaline Earth Metal": "bg-orange-200",
  "Metalloid": "bg-yellow-200",
  // Add more group colors as needed
};

const ElementCard = ({ element, onClick }) => (
  <Button
    className={`w-16 h-16 m-1 flex flex-col items-center justify-center text-xs ${groupColors[element.group]} hover:opacity-80`}
    onClick={() => onClick(element)}
  >
    <div>{element.symbol}</div>
    <div>{element.number}</div>
  </Button>
);

const ElementDialog = ({ element, isOpen, onClose }) => (
  <Dialog open={isOpen} onOpenChange={onClose}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{element?.name}</DialogTitle>
        <DialogDescription>
          Atomic Number: {element?.number}<br />
          Symbol: {element?.symbol}<br />
          Group: {element?.group}
        </DialogDescription>
      </DialogHeader>
    </DialogContent>
  </Dialog>
);

export default function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedElement, setSelectedElement] = useState(null);
  const [filteredElements, setFilteredElements] = useState(elements);

  useEffect(() => {
    setFilteredElements(
      elements.filter((element) =>
        element.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        element.symbol.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm]);

  const handleElementClick = (element) => {
    setSelectedElement(element);
  };

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Interactive Periodic Table</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            type="text"
            placeholder="Search elements..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-4"
          />
          <div className="flex flex-wrap justify-center">
            {filteredElements.map((element) => (
              <ElementCard key={element.number} element={element} onClick={handleElementClick} />
            ))}
          </div>
        </CardContent>
      </Card>
      <ElementDialog
        element={selectedElement}
        isOpen={!!selectedElement}
        onClose={() => setSelectedElement(null)}
      />
    </div>
  );
}