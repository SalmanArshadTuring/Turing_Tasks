import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function ImageProcessor() {
  const canvasRef = useRef(null);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [filter, setFilter] = useState({ grayscale: 0, sepia: 0, blur: 0 });
  const [dimensions, setDimensions] = useState({ width: 300, height: 300 });
  const [gallery, setGallery] = useState([]);

  const applyFilters = (img, ctx) => {
    ctx.filter = `grayscale(${filter.grayscale}%) sepia(${filter.sepia}%) blur(${filter.blur}px)`;
    ctx.drawImage(img, 0, 0, dimensions.width, dimensions.height);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          setImage(img);
          setPreview(e.target.result);
          setDimensions({ width: img.width, height: img.height });
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const updatePreview = () => {
    if (!image) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = dimensions.width;
    canvas.height = dimensions.height;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    applyFilters(image, ctx);
  };

  useEffect(updatePreview, [image, filter, dimensions]);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.download = 'edited_image.png';
    link.href = canvasRef.current.toDataURL();
    link.click();
  };

  const handleReset = () => {
    setFilter({ grayscale: 0, sepia: 0, blur: 0 });
    setDimensions({ width: image.width, height: image.height });
  };

  const addToGallery = () => {
    if (image) {
      setGallery(prev => [...prev, canvasRef.current.toDataURL()]);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Image Editor</CardTitle>
        </CardHeader>
        <CardContent>
          <input type="file" onChange={handleImageUpload} accept="image/*" className="mb-4"/>
          <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
            <div>
              <Label htmlFor="width">Width</Label>
              <Input 
                id="width" 
                type="number" 
                value={dimensions.width} 
                onChange={e => setDimensions({...dimensions, width: parseInt(e.target.value)})} 
                className="mb-2 sm:mb-0 sm:mr-2"
              />
            </div>
            <div>
              <Label htmlFor="height">Height</Label>
              <Input 
                id="height" 
                type="number" 
                value={dimensions.height} 
                onChange={e => setDimensions({...dimensions, height: parseInt(e.target.value)})} 
              />
            </div>
          </div>
          <Slider 
            value={[filter.grayscale]} 
            onValueChange={(v) => setFilter({...filter, grayscale: v[0]})} 
            max={100} 
            className="mb-2"
          />
          <Slider 
            value={[filter.sepia]} 
            onValueChange={(v) => setFilter({...filter, sepia: v[0]})} 
            max={100} 
            className="mb-2"
          />
          <Slider 
            value={[filter.blur]} 
            onValueChange={(v) => setFilter({...filter, blur: v[0]})} 
            max={10} 
          />
          <div className="flex justify-between mt-4">
            <Button onClick={addToGallery}>Add to Gallery</Button>
            <Button onClick={handleReset}>Reset</Button>
            <Button onClick={handleDownload}>Download</Button>
          </div>
        </CardContent>
      </Card>
      
      <div className="flex flex-col sm:flex-row">
        <canvas ref={canvasRef} style={{ display: 'none' }} />
        <img src={preview} alt="Preview" className="border p-2 max-w-full h-auto sm:max-w-sm mb-4 sm:mb-0" />
        <div className="sm:ml-4">
          <h3 className="font-bold mb-2">Gallery</h3>
          <div className="flex flex-wrap">
            {gallery.map((img, idx) => (
              <img key={idx} src={img} alt={`Gallery ${idx}`} className="w-24 h-24 object-cover m-1 border" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return <ImageProcessor />;
}