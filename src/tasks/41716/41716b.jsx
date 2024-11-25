import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";

const ImageZoom = ({ src, zoomIntensity = 2, alt = "" }) => {
  const imgRef = useRef(null);
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      const { left, top, width, height } = imgRef.current.getBoundingClientRect();
      const x = (e.clientX - left) / width * 100;
      const y = (e.clientY - top) / height * 100;
      setPosition({ x, y });
    };

    const currentImg = imgRef.current;
    if (currentImg) {
      currentImg.addEventListener('mousemove', handleMouseMove);
      return () => currentImg.removeEventListener('mousemove', handleMouseMove);
    }
  }, []);

  return (
    <div 
      className="overflow-hidden relative w-full h-full"
      style={{
        transform: `scale(${zoom})`,
        transformOrigin: `${position.x}% ${position.y}%`
      }}
    >
      <img 
        ref={imgRef} 
        src={src} 
        alt={alt} 
        className="w-full h-auto transition-transform duration-300"
        onMouseEnter={() => setZoom(zoomIntensity)}
        onMouseLeave={() => setZoom(1)}
      />
    </div>
  );
};

export default function App() {
  const [zoomLevel, setZoomLevel] = useState(2);
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4 sm:p-8">
      <Card className="max-w-lg w-full">
        <CardHeader>
          <CardTitle>Interactive Image Zoom</CardTitle>
          <CardDescription>Adjust zoom and hover over the image to zoom in.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <ImageZoom src="/path/to/your/image.jpg" zoomIntensity={zoomLevel} alt="Zoomable Image" />
        </CardContent>
        <CardFooter className="flex flex-col">
          <Slider 
            value={[zoomLevel]} 
            onValueChange={([value]) => setZoomLevel(value)} 
            max={5}
            step={0.1}
            className="w-full mb-4"
          />
          <p className="text-sm text-center">Zoom Intensity: {zoomLevel.toFixed(1)}</p>
        </CardFooter>
      </Card>
    </div>
  );
}