import React, { useState, useRef, useEffect } from "react";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ImageZoom = ({ src, alt }) => {
  const [zoomLevel, setZoomLevel] = useState(2);
  const [isZooming, setIsZooming] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const imgRef = useRef(null);

  const handleMouseEnter = () => setIsZooming(true);
  const handleMouseLeave = () => setIsZooming(false);

  const handleMouseMove = (e) => {
    if (imgRef.current) {
      const rect = imgRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      setPosition({ x, y });
    }
  };

  return (
    <div className="relative overflow-hidden">
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        className="w-full h-auto"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
      />
      {isZooming && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `url(${src})`,
            backgroundPosition: `${position.x * 100}% ${position.y * 100}%`,
            backgroundSize: `${zoomLevel * 100}%`,
          }}
        />
      )}
    </div>
  );
};

const ZoomControls = ({ zoomLevel, setZoomLevel }) => {
  return (
    <div className="mt-4">
      <label htmlFor="zoom-slider" className="block mb-2 text-sm font-medium">
        Zoom Level: {zoomLevel.toFixed(1)}x
      </label>
      <Slider
        id="zoom-slider"
        min={1}
        max={5}
        step={0.1}
        value={[zoomLevel]}
        onValueChange={(value) => setZoomLevel(value[0])}
      />
    </div>
  );
};

const ImageResizer = () => {
  const [zoomLevel, setZoomLevel] = useState(2);
  const [imageSize, setImageSize] = useState({ width: 400, height: 300 });

  const handleResize = (dimension, value) => {
    setImageSize((prev) => ({ ...prev, [dimension]: value }));
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Image Resizer with Zoom</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex space-x-4">
            <div>
              <label htmlFor="width" className="block text-sm font-medium">
                Width: {imageSize.width}px
              </label>
              <Slider
                id="width"
                min={100}
                max={800}
                value={[imageSize.width]}
                onValueChange={(value) => handleResize("width", value[0])}
              />
            </div>
            <div>
              <label htmlFor="height" className="block text-sm font-medium">
                Height: {imageSize.height}px
              </label>
              <Slider
                id="height"
                min={100}
                max={600}
                value={[imageSize.height]}
                onValueChange={(value) => handleResize("height", value[0])}
              />
            </div>
          </div>
          <div
            style={{
              width: `${imageSize.width}px`,
              height: `${imageSize.height}px`,
            }}
            className="mx-auto overflow-hidden"
          >
            <ImageZoom
              src="https://picsum.photos/800/600"
              alt="Random image"
            />
          </div>
          <ZoomControls zoomLevel={zoomLevel} setZoomLevel={setZoomLevel} />
        </div>
      </CardContent>
    </Card>
  );
};

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <ImageResizer />
    </div>
  );
}