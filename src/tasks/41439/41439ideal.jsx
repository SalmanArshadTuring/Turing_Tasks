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
    { number: 9, symbol: "F", name: "Fluorine", group: "Halogen" },
    { number: 10, symbol: "Ne", name: "Neon", group: "Noble Gas" },
    { number: 11, symbol: "Na", name: "Sodium", group: "Alkali Metal" },
    { number: 12, symbol: "Mg", name: "Magnesium", group: "Alkaline Earth Metal" },
    { number: 13, symbol: "Al", name: "Aluminium", group: "Post-Transition Metal" },
    { number: 14, symbol: "Si", name: "Silicon", group: "Metalloid" },
    { number: 15, symbol: "P", name: "Phosphorus", group: "Nonmetal" },
    { number: 16, symbol: "S", name: "Sulfur", group: "Nonmetal" },
    { number: 17, symbol: "Cl", name: "Chlorine", group: "Halogen" },
    { number: 18, symbol: "Ar", name: "Argon", group: "Noble Gas" },
    { number: 19, symbol: "K", name: "Potassium", group: "Alkali Metal" },
    { number: 20, symbol: "Ca", name: "Calcium", group: "Alkaline Earth Metal" },
    { number: 21, symbol: "Sc", name: "Scandium", group: "Transition Metal" },
    { number: 22, symbol: "Ti", name: "Titanium", group: "Transition Metal" },
    { number: 23, symbol: "V", name: "Vanadium", group: "Transition Metal" },
    { number: 24, symbol: "Cr", name: "Chromium", group: "Transition Metal" },
    { number: 25, symbol: "Mn", name: "Manganese", group: "Transition Metal" },
    { number: 26, symbol: "Fe", name: "Iron", group: "Transition Metal" },
    { number: 27, symbol: "Co", name: "Cobalt", group: "Transition Metal" },
    { number: 28, symbol: "Ni", name: "Nickel", group: "Transition Metal" },
    { number: 29, symbol: "Cu", name: "Copper", group: "Transition Metal" },
    { number: 30, symbol: "Zn", name: "Zinc", group: "Transition Metal" },
    { number: 31, symbol: "Ga", name: "Gallium", group: "Post-Transition Metal" },
    { number: 32, symbol: "Ge", name: "Germanium", group: "Metalloid" },
    { number: 33, symbol: "As", name: "Arsenic", group: "Metalloid" },
    { number: 34, symbol: "Se", name: "Selenium", group: "Nonmetal" },
    { number: 35, symbol: "Br", name: "Bromine", group: "Halogen" },
    { number: 36, symbol: "Kr", name: "Krypton", group: "Noble Gas" },
    { number: 37, symbol: "Rb", name: "Rubidium", group: "Alkali Metal" },
    { number: 38, symbol: "Sr", name: "Strontium", group: "Alkaline Earth Metal" },
    { number: 39, symbol: "Y", name: "Yttrium", group: "Transition Metal" },
    { number: 40, symbol: "Zr", name: "Zirconium", group: "Transition Metal" },
    { number: 41, symbol: "Nb", name: "Niobium", group: "Transition Metal" },
    { number: 42, symbol: "Mo", name: "Molybdenum", group: "Transition Metal" },
    { number: 43, symbol: "Tc", name: "Technetium", group: "Transition Metal" },
    { number: 44, symbol: "Ru", name: "Ruthenium", group: "Transition Metal" },
    { number: 45, symbol: "Rh", name: "Rhodium", group: "Transition Metal" },
    { number: 46, symbol: "Pd", name: "Palladium", group: "Transition Metal" },
    { number: 47, symbol: "Ag", name: "Silver", group: "Transition Metal" },
    { number: 48, symbol: "Cd", name: "Cadmium", group: "Transition Metal" },
    { number: 49, symbol: "In", name: "Indium", group: "Post-Transition Metal" },
    { number: 50, symbol: "Sn", name: "Tin", group: "Post-Transition Metal" },
    { number: 51, symbol: "Sb", name: "Antimony", group: "Metalloid" },
    { number: 52, symbol: "Te", name: "Tellurium", group: "Metalloid" },
    { number: 53, symbol: "I", name: "Iodine", group: "Halogen" },
    { number: 54, symbol: "Xe", name: "Xenon", group: "Noble Gas" },
    { number: 55, symbol: "Cs", name: "Cesium", group: "Alkali Metal" },
    { number: 56, symbol: "Ba", name: "Barium", group: "Alkaline Earth Metal" },
    { number: 57, symbol: "La", name: "Lanthanum", group: "Lanthanide" },
    { number: 58, symbol: "Ce", name: "Cerium", group: "Lanthanide" },
    { number: 59, symbol: "Pr", name: "Praseodymium", group: "Lanthanide" },
    { number: 60, symbol: "Nd", name: "Neodymium", group: "Lanthanide" },
    { number: 61, symbol: "Pm", name: "Promethium", group: "Lanthanide" },
    { number: 62, symbol: "Sm", name: "Samarium", group: "Lanthanide" },
    { number: 63, symbol: "Eu", name: "Europium", group: "Lanthanide" },
    { number: 64, symbol: "Gd", name: "Gadolinium", group: "Lanthanide" },
    { number: 65, symbol: "Tb", name: "Terbium", group: "Lanthanide" },
    { number: 66, symbol: "Dy", name: "Dysprosium", group: "Lanthanide" },
    { number: 67, symbol: "Ho", name: "Holmium", group: "Lanthanide" },
    { number: 68, symbol: "Er", name: "Erbium", group: "Lanthanide" },
    { number: 69, symbol: "Tm", name: "Thulium", group: "Lanthanide" },
    { number: 70, symbol: "Yb", name: "Ytterbium", group: "Lanthanide" },
    { number: 71, symbol: "Lu", name: "Lutetium", group: "Lanthanide" },
    { number: 72, symbol: "Hf", name: "Hafnium", group: "Transition Metal" },
    { number: 73, symbol: "Ta", name: "Tantalum", group: "Transition Metal" },
    { number: 74, symbol: "W", name: "Tungsten", group: "Transition Metal" },
    { number: 75, symbol: "Re", name: "Rhenium", group: "Transition Metal" },
    { number: 76, symbol: "Os", name: "Osmium", group: "Transition Metal" },
    { number: 77, symbol: "Ir", name: "Iridium", group: "Transition Metal" },
    { number: 78, symbol: "Pt", name: "Platinum", group: "Transition Metal" },
    { number: 79, symbol: "Au", name: "Gold", group: "Transition Metal" },
    { number: 80, symbol: "Hg", name: "Mercury", group: "Transition Metal" },
    { number: 81, symbol: "Tl", name: "Thallium", group: "Post-Transition Metal" },
    { number: 82, symbol: "Pb", name: "Lead", group: "Post-Transition Metal" },
    { number: 83, symbol: "Bi", name: "Bismuth", group: "Post-Transition Metal" },
    { number: 84, symbol: "Po", name: "Polonium", group: "Metalloid" },
    { number: 85, symbol: "At", name: "Astatine", group: "Metalloid" },
    { number: 86, symbol: "Rn", name: "Radon", group: "Noble Gas" },
    { number: 87, symbol: "Fr", name: "Francium", group: "Alkali Metal" },
    { number: 88, symbol: "Ra", name: "Radium", group: "Alkaline Earth Metal" },
    { number: 89, symbol: "Ac", name: "Actinium", group: "Actinide" },
    { number: 90, symbol: "Th", name: "Thorium", group: "Actinide" },
    { number: 91, symbol: "Pa", name: "Protactinium", group: "Actinide" },
    { number: 92, symbol: "U", name: "Uranium", group: "Actinide" },
    { number: 93, symbol: "Np", name: "Neptunium", group: "Actinide" },
    { number: 94, symbol: "Pu", name: "Plutonium", group: "Actinide" },
    { number: 95, symbol: "Am", name: "Americium", group: "Actinide" },
    { number: 96, symbol: "Cm", name: "Curium", group: "Actinide" },
    { number: 97, symbol: "Bk", name: "Berkelium", group: "Actinide" },
    { number: 98, symbol: "Cf", name: "Californium", group: "Actinide" },
    { number: 99, symbol: "Es", name: "Einsteinium", group: "Actinide" },
    { number: 100, symbol: "Fm", name: "Fermium", group: "Actinide" },
    { number: 101, symbol: "Md", name: "Mendelevium", group: "Actinide" },
    { number: 102, symbol: "No", name: "Nobelium", group: "Actinide" },
    { number: 103, symbol: "Lr", name: "Lawrencium", group: "Actinide" },
    { number: 104, symbol: "Rf", name: "Rutherfordium", group: "Transition Metal" },
    { number: 105, symbol: "Db", name: "Dubnium", group: "Transition Metal" },
    { number: 106, symbol: "Sg", name: "Seaborgium", group: "Transition Metal" },
    { number: 107, symbol: "Bh", name: "Bohrium", group: "Transition Metal" },
    { number: 108, symbol: "Hs", name: "Hassium", group: "Transition Metal" },
    { number: 109, symbol: "Mt", name: "Meitnerium", group: "Unknown" },
    { number: 110, symbol: "Ds", name: "Darmstadtium", group: "Unknown" },
    { number: 111, symbol: "Rg", name: "Roentgenium", group: "Unknown" },
    { number: 112, symbol: "Cn", name: "Copernicium", group: "Transition Metal" },
    { number: 113, symbol: "Nh", name: "Nihonium", group: "Unknown" },
    { number: 114, symbol: "Fl", name: "Flerovium", group: "Unknown" },
    { number: 115, symbol: "Mc", name: "Moscovium", group: "Unknown" },
    { number: 116, symbol: "Lv", name: "Livermorium", group: "Unknown" },
    { number: 117, symbol: "Ts", name: "Tennessine", group: "Unknown" },
    { number: 118, symbol: "Og", name: "Oganesson", group: "Unknown" },
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
