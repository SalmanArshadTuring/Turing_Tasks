import React, { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function Member({ member, onEdit, onDelete, onMove }) {
  const dragRef = useRef(null);

  const handleDragStart = (e) => {
    e.dataTransfer.setData("text/plain", JSON.stringify(member));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const data = JSON.parse(e.dataTransfer.getData("text"));
    if (data.id !== member.id) {
      onMove(data, member);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <Card className="mb-4 sm:mx-2 w-full sm:w-64" draggable onDragStart={handleDragStart} ref={dragRef}>
      <CardHeader>
        <CardTitle>{member.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>DOB: {member.dob}</p>
        <p>Relationship: {member.relationship}</p>
      </CardContent>
      <Button onClick={() => onEdit(member)} className="mt-2">
        Edit
      </Button>
      <Button onClick={() => onDelete(member.id)} variant="destructive" className="mt-2">
        Delete
      </Button>
      <div onDrop={handleDrop} onDragOver={handleDragOver} className="mt-2 h-4"></div>
    </Card>
  );
}

function showToast({ title, description, duration = 3000 }) {
  const container = document.getElementById("toast-container");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = "bg-gray-800 text-white p-4 rounded shadow mb-4";
  toast.innerHTML = `
    <strong class="block text-sm font-bold">${title}</strong>
    <span class="block text-sm">${description}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    container.removeChild(toast);
  }, duration);
}

export default function App() {
  const [members, setMembers] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [currentMember, setCurrentMember] = useState({ name: "", dob: "", relationship: "" });

  const openModal = (member = null) => {
    setCurrentMember(member || { name: "", dob: "", relationship: "" });
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setCurrentMember({ name: "", dob: "", relationship: "" });
  };

  const handleSubmit = () => {
    if (currentMember.id) {
      setMembers(members.map((m) => (m.id === currentMember.id ? currentMember : m)));
    } else {
      setMembers([...members, { ...currentMember, id: Date.now() }]);
    }
    closeModal();
  };

  const handleDelete = (id) => {
    setMembers(members.filter((m) => m.id !== id));
  };

  const handleMove = (fromMember, toMember) => {
    setMembers((prevMembers) => {
      const fromIndex = prevMembers.findIndex((m) => m.id === fromMember.id);
      const toIndex = prevMembers.findIndex((m) => m.id === toMember.id);
      if (fromIndex !== -1 && toIndex !== -1) {
        const newMembers = [...prevMembers];
        newMembers[fromIndex] = { ...newMembers[fromIndex], relationship: `Child of ${toMember.name}` };
        return newMembers;
      }
      return prevMembers;
    });
  };

  const handleShare = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(members));
    const downloadAnchorNode = document.createElement("a");
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "family_tree.json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();

    showToast({
      title: "Family tree exported!",
      description: "Check your downloads for the JSON file.",
    });
  };

  return (
    <div className="p-4 space-y-4">
      <Button onClick={() => openModal()}>Add Family Member</Button>
      <Button onClick={handleShare} className="ml-2">
        Share Family Tree
      </Button>
      <div className="flex flex-wrap">
        {members.map((member) => (
          <Member key={member.id} member={member} onEdit={openModal} onDelete={handleDelete} onMove={handleMove} />
        ))}
      </div>

      {/* Toast Container */}
      <div id="toast-container" className="fixed top-4 right-4 z-50"></div>

      {/* Modal */}
      {isOpen && (
        <dialog id="memberModal" open>
          <form method="dialog" className="p-4 bg-white rounded-md shadow-md">
            <h3 className="text-lg font-bold">{currentMember.id ? "Edit" : "Add"} Family Member</h3>
            <Input
              value={currentMember.name}
              onChange={(e) => setCurrentMember({ ...currentMember, name: e.target.value })}
              placeholder="Name"
            />
            <Input
              type="date"
              value={currentMember.dob}
              onChange={(e) => setCurrentMember({ ...currentMember, dob: e.target.value })}
              placeholder="Date of Birth"
            />
            <Input
              value={currentMember.relationship}
              onChange={(e) => setCurrentMember({ ...currentMember, relationship: e.target.value })}
              placeholder="Relationship"
            />
            <div className="flex justify-end space-x-2 mt-4">
              <Button onClick={handleSubmit}>Save</Button>
              <Button variant="secondary" onClick={closeModal}>
                Cancel
              </Button>
            </div>
          </form>
        </dialog>
      )}
    </div>
  );
}
