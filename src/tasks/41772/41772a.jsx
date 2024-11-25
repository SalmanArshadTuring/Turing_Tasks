import React, { useState, useCallback } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { jsPDF } from "jspdf";

const ResumeSection = ({ id, type, content, index, moveSection, updateSection }) => {
  const [{ isDragging }, drag] = useDrag({
    type: "section",
    item: { id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: "section",
    hover: (item, monitor) => {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) {
        return;
      }
      moveSection(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  const ref = useCallback((node) => {
    drag(drop(node));
  }, []);

  const opacity = isDragging ? 0.5 : 1;

  return (
    <div ref={ref} style={{ opacity }} className="mb-4 p-4 border rounded shadow cursor-move bg-white">
      <h2 className="font-bold text-lg">{type}</h2>
      <div>
        {type === "Education" && (
          <>
            <input
              type="text"
              placeholder="Institution"
              value={content.institution}
              onChange={(e) => updateSection(id, { ...content, institution: e.target.value })}
              className="block w-full mb-2 p-2 border rounded"
            />
            <input
              type="text"
              placeholder="Degree"
              value={content.degree}
              onChange={(e) => updateSection(id, { ...content, degree: e.target.value })}
              className="block w-full mb-2 p-2 border rounded"
            />
            <input
              type="text"
              placeholder="Year"
              value={content.year}
              onChange={(e) => updateSection(id, { ...content, year: e.target.value })}
              className="block w-full mb-2 p-2 border rounded"
            />
          </>
        )}
        {type === "Work Experience" && (
          <>
            <input
              type="text"
              placeholder="Company"
              value={content.company}
              onChange={(e) => updateSection(id, { ...content, company: e.target.value })}
              className="block w-full mb-2 p-2 border rounded"
            />
            <input
              type="text"
              placeholder="Position"
              value={content.position}
              onChange={(e) => updateSection(id, { ...content, position: e.target.value })}
              className="block w-full mb-2 p-2 border rounded"
            />
            <input
              type="text"
              placeholder="Duration"
              value={content.duration}
              onChange={(e) => updateSection(id, { ...content, duration: e.target.value })}
              className="block w-full mb-2 p-2 border rounded"
            />
            <textarea
              placeholder="Description"
              value={content.description}
              onChange={(e) => updateSection(id, { ...content, description: e.target.value })}
              className="block w-full mb-2 p-2 border rounded"
            />
          </>
        )}
        {type === "Skills" && (
          <textarea
            placeholder="List your skills"
            value={content.skills}
            onChange={(e) => updateSection(id, { ...content, skills: e.target.value })}
            className="block w-full p-2 border rounded"
          />
        )}
      </div>
    </div>
  );
};

const ResumeBuilder = () => {
  const [sections, setSections] = useState([]);

  const addSection = (type) => {
    const newSection = {
      id: Date.now(),
      type,
      content: type === "Education" ? { institution: "", degree: "", year: "" } :
               type === "Work Experience" ? { company: "", position: "", duration: "", description: "" } :
               { skills: "" },
    };
    setSections([...sections, newSection]);
  };

  const moveSection = useCallback((dragIndex, hoverIndex) => {
    setSections((prevSections) => {
      const newSections = [...prevSections];
      const [removed] = newSections.splice(dragIndex, 1);
      newSections.splice(hoverIndex, 0, removed);
      return newSections;
    });
  }, []);

  const updateSection = (id, newContent) => {
    setSections(sections.map(section => 
      section.id === id ? { ...section, content: newContent } : section
    ));
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    let yOffset = 10;

    sections.forEach((section) => {
      doc.setFontSize(16);
      doc.text(section.type, 10, yOffset);
      yOffset += 10;

      doc.setFontSize(12);
      if (section.type === "Education") {
        doc.text(`${section.content.institution} - ${section.content.degree} (${section.content.year})`, 10, yOffset);
      } else if (section.type === "Work Experience") {
        doc.text(`${section.content.company} - ${section.content.position}`, 10, yOffset);
        yOffset += 5;
        doc.text(`Duration: ${section.content.duration}`, 10, yOffset);
        yOffset += 5;
        doc.text(section.content.description, 10, yOffset, { maxWidth: 180 });
      } else if (section.type === "Skills") {
        doc.text(section.content.skills, 10, yOffset, { maxWidth: 180 });
      }
      yOffset += 20;
    });

    doc.save("resume.pdf");
  };

  return (
    <div className="container mx-auto p-4 sm:p-6">
      <h1 className="text-3xl font-bold mb-4">Resume Builder</h1>
      <div className="mb-4 space-x-2">
        <button onClick={() => addSection("Education")} className="px-4 py-2 bg-blue-500 text-white rounded">
          Add Education
        </button>
        <button onClick={() => addSection("Work Experience")} className="px-4 py-2 bg-blue-500 text-white rounded">
          Add Work Experience
        </button>
        <button onClick={() => addSection("Skills")} className="px-4 py-2 bg-blue-500 text-white rounded">
          Add Skills
        </button>
      </div>
      <DndProvider backend={HTML5Backend}>
        {sections.map((section, index) => (
          <ResumeSection
            key={section.id}
            id={section.id}
            type={section.type}
            content={section.content}
            index={index}
            moveSection={moveSection}
            updateSection={updateSection}
          />
        ))}
      </DndProvider>
      <button onClick={exportToPDF} className="mt-4 px-4 py-2 bg-green-500 text-white rounded">
        Export to PDF
      </button>
    </div>
  );
};

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <ResumeBuilder />
    </div>
  );
}
