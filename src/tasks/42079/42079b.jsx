import React, { useState, useRef } from "react";
import {  Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { DownloadIcon, ResetIcon } from "@radix-ui/react-icons";

// Sample avatar options
const avatarOptions = {
  hairstyles: ["short", "long", "bun", "afro"],
  facialFeatures: ["eyes1", "eyes2", "nose1", "mouth1"],
  outfits: ["shirt", "dress", "jacket"],
  accessories: ["glasses", "hat", "earrings"],
};

// Avatar Component
const Avatar = ({ style }) => (
  <div className="w-48 h-48 bg-gray-100 flex items-center justify-center">
    <div className="avatar" style={style}></div>
  </div>
);

// Customization Panel
const CustomizationPanel = ({ category, options, current, setCurrent }) => (
  <div className="p-4">
    <h3 className="text-lg mb-2">{category}</h3>
    {options.map((option) => (
      <Button 
        key={option} 
        variant={option === current ? 'default' : 'outline'}
        onClick={() => setCurrent(option)}
        className="m-1"
      >
        {option}
      </Button>
    ))}
  </div>
);

// Main App Component
export default function App() {
  const [avatarState, setAvatarState] = useState({
    hairstyles: avatarOptions.hairstyles[0],
    facialFeatures: avatarOptions.facialFeatures[0],
    outfits: avatarOptions.outfits[0],
    accessories: avatarOptions.accessories[0],
  });
  const avatarRef = useRef(null);

  const handleChange = (category, value) => {
    setAvatarState(prevState => ({ ...prevState, [category]: value }));
  };

  const handleDownload = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = avatarRef.current.querySelector('.avatar');
    canvas.width = img.offsetWidth;
    canvas.height = img.offsetHeight;
    ctx.drawImage(img, 0, 0);
    const dataURL = canvas.toDataURL("image/png");
    const link = document.createElement('a');
    link.download = 'avatar.png';
    link.href = dataURL;
    link.click();
  };

  const handleReset = () => {
    setAvatarState({
      hairstyles: avatarOptions.hairstyles[0],
      facialFeatures: avatarOptions.facialFeatures[0],
      outfits: avatarOptions.outfits[0],
      accessories: avatarOptions.accessories[0],
    });
  };

  const avatarStyle = {
    backgroundImage: `url(/img/${avatarState.hairstyles}.png), 
                      url(/img/${avatarState.facialFeatures}.png),
                      url(/img/${avatarState.outfits}.png),
                      url(/img/${avatarState.accessories}.png)`,
    backgroundSize: 'cover',
  };

  return (
    <div className="container mx-auto p-4 sm:p-8">
      <Card>
        <CardHeader>
          <CardTitle>Custom Avatar Maker</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Avatar style={avatarStyle} ref={avatarRef} />
          <Tabs defaultValue="hairstyles" className="w-full">
            <TabsList>
              {Object.keys(avatarOptions).map(category => (
                <TabsTrigger key={category} value={category}>{category}</TabsTrigger>
              ))}
            </TabsList>
            {Object.keys(avatarOptions).map(category => (
              <TabsContent key={category} value={category}>
                <CustomizationPanel 
                  category={category} 
                  options={avatarOptions[category]} 
                  current={avatarState[category]} 
                  setCurrent={(value) => handleChange(category, value)} 
                />
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button onClick={handleDownload}>
            <DownloadIcon className="mr-2" /> Download
          </Button>
          <Button variant="secondary" onClick={handleReset}>
            <ResetIcon className="mr-2" /> Reset
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}