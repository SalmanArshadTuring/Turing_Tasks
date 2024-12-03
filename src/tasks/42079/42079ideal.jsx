import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const OPTIONS = {
  hairstyles: ["Short", "Curly", "Bald", "Ponytail"],
  facialFeatures: ["None", "Mustache", "Beard", "Freckles"],
  outfits: ["Casual", "Formal", "Sporty", "Traditional"],
  accessories: ["None", "Glasses", "Hat", "Necklace"],
};

const DEFAULT_AVATAR = {
  hairstyle: "Short",
  facialFeature: "None",
  outfit: "Casual",
  accessory: "None",
};

export default function App() {
  const [avatar, setAvatar] = useState(DEFAULT_AVATAR);

  const handleCustomizationChange = (key, value) => {
    setAvatar((prev) => ({ ...prev, [key]: value }));
  };

  const downloadAvatar = () => {
    const svg = document.querySelector("#avatar-svg");
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    canvas.width = 400;
    canvas.height = 400;

    img.onload = () => {
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      const link = document.createElement("a");
      link.download = "avatar.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    };

    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  return (
    <div className="p-4 sm:p-8 bg-gray-100 min-h-screen flex flex-col items-center">
      <Card className="w-full sm:w-1/2 bg-white">
        <CardHeader>
          <CardTitle>Custom Avatar Maker</CardTitle>
          <CardDescription>Customize your avatar and save it as an image.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {Object.keys(OPTIONS).map((key) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700 capitalize">{key}</label>
                <select
                  value={avatar[key]}
                  onChange={(e) => handleCustomizationChange(key, e.target.value)}
                 
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                >
                  {OPTIONS[key].map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
          <div className="mt-6 flex flex-col items-center">
            <svg
              id="avatar-svg"
              width="200"
              height="200"
              viewBox="0 0 400 400"
              xmlns="http://www.w3.org/2000/svg"
              className="bg-gray-200 rounded-lg"
            >
              {/* Head */}
              <circle cx="200" cy="150" r="70" fill="#ffe0bd" />
              {/* Hairstyle */}
              {avatar.hairstyle === "Short" && (
                <rect x="150" y="60" width="100" height="50" fill="#4a4a4a" />
              )}
              {avatar.hairstyle === "Curly" && (
                <circle cx="200" cy="80" r="50" fill="#4a4a4a" />
              )}
              {avatar.hairstyle === "Ponytail" && (
                <>
                  <rect x="150" y="60" width="100" height="50" fill="#4a4a4a" />
                  <rect x="185" y="20" width="30" height="40" fill="#4a4a4a" />
                </>
              )}
              {/* Facial Features */}
              {avatar.facialFeature === "Mustache" && (
                <rect x="160" y="180" width="80" height="10" fill="#4a4a4a" rx="5" />
              )}
              {avatar.facialFeature === "Beard" && (
                <path
                  d="M140,200 Q200,260 260,200"
                  fill="#4a4a4a"
                  stroke="#4a4a4a"
                  strokeWidth="1"
                />
              )}
              {avatar.facialFeature === "Freckles" && (
                <>
                  <circle cx="180" cy="170" r="3" fill="#d88c6a" />
                  <circle cx="220" cy="170" r="3" fill="#d88c6a" />
                  <circle cx="200" cy="180" r="3" fill="#d88c6a" />
                </>
              )}
              {/* Outfit */}
              <rect
                x="120"
                y="220"
                width="160"
                height="120"
                fill={avatar.outfit === "Formal" ? "#2d89ef" : "#6fa8dc"}
              />
              {/* Accessories */}
              {avatar.accessory === "Glasses" && (
                <>
                  <circle cx="170" cy="150" r="20" stroke="#000" strokeWidth="2" fill="none" />
                  <circle cx="230" cy="150" r="20" stroke="#000" strokeWidth="2" fill="none" />
                  <line x1="190" y1="150" x2="210" y2="150" stroke="#000" strokeWidth="2" />
                </>
              )}
              {avatar.accessory === "Hat" && (
                <rect x="150" y="30" width="100" height="30" fill="#000" />
              )}
            </svg>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center gap-4">
          <button
            onClick={downloadAvatar}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Download Avatar
          </button>
        </CardFooter>
      </Card>
    </div>
  );
}
