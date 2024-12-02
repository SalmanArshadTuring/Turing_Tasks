import React, { useState, useCallback } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";

const FamilyMember = ({ member, onEdit, index, moveMember }) => {
  const [{ isDragging }, drag] = useDrag({
    type: "familyMember",
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: "familyMember",
    hover: (draggedItem) => {
      if (draggedItem.index !== index) {
        moveMember(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  return (
    <div
      ref={(node) => drag(drop(node))}
      className={`p-4 mb-4 rounded-lg shadow-md ${
        isDragging ? "opacity-50" : ""
      }`}
    >
      <Card>
        <CardContent className="p-4">
          <h3 className="text-lg font-semibold">{member.name}</h3>
          <p className="text-sm text-gray-600">
            Born: {member.dateOfBirth}
            <br />
            Relationship: {member.relationship}
          </p>
          <Button onClick={() => onEdit(member)} className="mt-2">
            Edit
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

const FamilyMemberForm = ({ member, onSave, onClose }) => {
  const [formData, setFormData] = useState(member || {});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{member ? "Edit" : "Add"} Family Member</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name || ""}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="dateOfBirth">Date of Birth</Label>
            <Input
              id="dateOfBirth"
              name="dateOfBirth"
              type="date"
              value={formData.dateOfBirth || ""}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="relationship">Relationship</Label>
            <Input
              id="relationship"
              name="relationship"
              value={formData.relationship || ""}
              onChange={handleChange}
              required
            />
          </div>
          <DialogFooter>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default function App() {
  const [familyMembers, setFamilyMembers] = useState([]);
  const [editingMember, setEditingMember] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddMember = () => {
    setEditingMember(null);
    setIsModalOpen(true);
  };

  const handleEditMember = (member) => {
    setEditingMember(member);
    setIsModalOpen(true);
  };

  const handleSaveMember = (member) => {
    if (editingMember) {
      setFamilyMembers(
        familyMembers.map((m) => (m.id === member.id ? member : m))
      );
    } else {
      setFamilyMembers([...familyMembers, { ...member, id: Date.now() }]);
    }
    setIsModalOpen(false);
  };

  const moveMember = useCallback(
    (dragIndex, hoverIndex) => {
      const draggedMember = familyMembers[dragIndex];
      const newMembers = [...familyMembers];
      newMembers.splice(dragIndex, 1);
      newMembers.splice(hoverIndex, 0, draggedMember);
      setFamilyMembers(newMembers);
    },
    [familyMembers]
  );

  const handleShare = () => {
    const jsonData = JSON.stringify(familyMembers, null, 2);
    const blob = new Blob([jsonData], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "family_tree.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="container mx-auto p-4 sm:p-6">
        <h1 className="text-3xl font-bold mb-6">Family Tree</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {familyMembers.map((member, index) => (
            <FamilyMember
              key={member.id}
              member={member}
              onEdit={handleEditMember}
              index={index}
              moveMember={moveMember}
            />
          ))}
        </div>
        <div className="mt-6 space-x-4">
          <Button onClick={handleAddMember}>Add Family Member</Button>
          <Button onClick={handleShare}>Share</Button>
        </div>
        {isModalOpen && (
          <FamilyMemberForm
            member={editingMember}
            onSave={handleSaveMember}
            onClose={() => setIsModalOpen(false)}
          />
        )}
      </div>
    </DndProvider>
  );
}