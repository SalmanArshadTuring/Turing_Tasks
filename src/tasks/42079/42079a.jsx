import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const avatarOptions = {
  hairstyles: ["Short", "Long", "Curly", "Bald"],
  facialFeatures: ["Beard", "Mustache", "Clean Shaven"],
  outfits: ["Casual", "Formal", "Sporty"],
  accessories: ["Glasses", "Hat", "Earrings", "None"]
};

const AvatarCustomizer = ({ onCustomize }) => {
  return (
    <Card className="w-full mb-4">
      <CardHeader>
        <CardTitle>Customize Avatar</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="hairstyles">
          <TabsList className="grid w-full grid-cols-4">
            {Object.keys(avatarOptions).map((category) => (
              <TabsTrigger key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </TabsTrigger>
            ))}
          </TabsList>
          {Object.entries(avatarOptions).map(([category, options]) => (
            <TabsContent key={category} value={category}>
              <Select onValueChange={(value) => onCustomize(category, value)}>
                <SelectTrigger>
                  <SelectValue placeholder={`Select ${category}`} />
                </SelectTrigger>
                <SelectContent>
                  {options.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};

const AvatarPreview = ({ customizations }) => {
  return (
    <Card className="w-full mb-4">
      <CardHeader>
        <CardTitle>Avatar Preview</CardTitle>
      </CardHeader>
      <CardContent className="flex justify-center items-center h-64 bg-gray-100">
        <div className="text-center">
          <div className="text-4xl mb-2">👤</div>
          <div>
            {Object.entries(customizations).map(([category, value]) => (
              <p key={category}>
                {category}: {value || "Not selected"}
              </p>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const AvatarGallery = ({ savedAvatars, onSelect }) => {
  return (
    <Card className="w-full mb-4">
      <CardHeader>
        <CardTitle>Avatar Gallery</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-2">
          {savedAvatars.map((avatar, index) => (
            <Button key={index} onClick={() => onSelect(avatar)} variant="outline">
              Avatar {index + 1}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default function App() {
  const [customizations, setCustomizations] = useState({
    hairstyles: "",
    facialFeatures: "",
    outfits: "",
    accessories: ""
  });
  const [savedAvatars, setSavedAvatars] = useState([]);

  const handleCustomize = (category, value) => {
    setCustomizations((prev) => ({ ...prev, [category]: value }));
  };

  const handleSave = () => {
    setSavedAvatars((prev) => [...prev, customizations]);
  };

  const handleReset = () => {
    setCustomizations({
      hairstyles: "",
      facialFeatures: "",
      outfits: "",
      accessories: ""
    });
  };

  const handleDownload = () => {
    const avatarData = JSON.stringify(customizations);
    const blob = new Blob([avatarData], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "avatar.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSelectSaved = (avatar) => {
    setCustomizations(avatar);
  };

  useEffect(() => {
    const handleResize = () => {
      // Add any specific mobile responsiveness logic here if needed
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Custom Avatar Maker</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <AvatarCustomizer onCustomize={handleCustomize} />
          <div className="flex flex-wrap gap-2">
            <Button onClick={handleSave}>Save Avatar</Button>
            <Button onClick={handleReset} variant="outline">Reset</Button>
            <Button onClick={handleDownload} variant="outline">Download</Button>
          </div>
        </div>
        <div>
          <AvatarPreview customizations={customizations} />
          <AvatarGallery savedAvatars={savedAvatars} onSelect={handleSelectSaved} />
        </div>
      </div>
    </div>
  );
}