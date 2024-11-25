import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const filters = {
  grayscale: (ctx, canvas) => {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
      data[i] = data[i + 1] = data[i + 2] = avg;
    }
    ctx.putImageData(imageData, 0, 0);
  },
  sepia: (ctx, canvas) => {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i], g = data[i + 1], b = data[i + 2];
      data[i] = Math.min(255, (r * 0.393) + (g * 0.769) + (b * 0.189));
      data[i + 1] = Math.min(255, (r * 0.349) + (g * 0.686) + (b * 0.168));
      data[i + 2] = Math.min(255, (r * 0.272) + (g * 0.534) + (b * 0.131));
    }
    ctx.putImageData(imageData, 0, 0);
  },
  blur: (ctx, canvas) => {
    ctx.filter = "blur(5px)";
    ctx.drawImage(canvas, 0, 0);
    ctx.filter = "none";
  },
};

const ImageEditor = ({ image, onSave }) => {
  const canvasRef = useRef(null);
  const [filter, setFilter] = useState("none");
  const [crop, setCrop] = useState({ x: 0, y: 0, width: 100, height: 100 });

  useEffect(() => {
    if (image) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      const img = new Image();
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        applyFilter(filter);
      };
      img.src = URL.createObjectURL(image);
    }
  }, [image, filter]);

  const applyFilter = (filterName) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(new Image(image), 0, 0);
    if (filterName !== "none") {
      filters[filterName](ctx, canvas);
    }
  };

  const handleCrop = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const croppedCanvas = document.createElement("canvas");
    croppedCanvas.width = crop.width;
    croppedCanvas.height = crop.height;
    croppedCanvas.getContext("2d").drawImage(
      canvas,
      crop.x,
      crop.y,
      crop.width,
      crop.height,
      0,
      0,
      crop.width,
      crop.height
    );
    canvas.width = crop.width;
    canvas.height = crop.height;
    ctx.drawImage(croppedCanvas, 0, 0);
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    const dataUrl = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.download = "edited-image.png";
    link.href = dataUrl;
    link.click();
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="p-4">
        <canvas ref={canvasRef} className="w-full h-auto mb-4" />
        <div className="space-y-4">
          <div>
            <label className="block mb-2">Filter:</label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="none">None</option>
              <option value="grayscale">Grayscale</option>
              <option value="sepia">Sepia</option>
              <option value="blur">Blur</option>
            </select>
          </div>
          <div>
            <label className="block mb-2">Crop:</label>
            <div className="grid grid-cols-2 gap-2">
              <Input
                type="number"
                placeholder="X"
                value={crop.x}
                onChange={(e) => setCrop({ ...crop, x: Number(e.target.value) })}
              />
              <Input
                type="number"
                placeholder="Y"
                value={crop.y}
                onChange={(e) => setCrop({ ...crop, y: Number(e.target.value) })}
              />
              <Input
                type="number"
                placeholder="Width"
                value={crop.width}
                onChange={(e) => setCrop({ ...crop, width: Number(e.target.value) })}
              />
              <Input
                type="number"
                placeholder="Height"
                value={crop.height}
                onChange={(e) => setCrop({ ...crop, height: Number(e.target.value) })}
              />
            </div>
            <Button onClick={handleCrop} className="mt-2 w-full">Apply Crop</Button>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button onClick={() => onSave(canvasRef.current.toDataURL())}>Save</Button>
        <Button onClick={handleDownload}>Download</Button>
      </CardFooter>
    </Card>
  );
};

const ImageGallery = ({ images }) => (
  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-8">
    {images.map((img, index) => (
      <img key={index} src={img} alt={`Edited ${index}`} className="w-full h-auto rounded" />
    ))}
  </div>
);

export default function App() {
  const [image, setImage] = useState(null);
  const [editedImages, setEditedImages] = useState([]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.substr(0, 5) === "image") {
      setImage(file);
    } else {
      alert("Please select an image file");
    }
  };

  const handleSave = (editedImageData) => {
    setEditedImages([...editedImages, editedImageData]);
  };

  const handleReset = () => {
    setImage(null);
    setEditedImages([]);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Image Editor</h1>
      <div className="mb-8">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
          id="image-upload"
        />
        <label htmlFor="image-upload" className="btn btn-primary mr-4">
          Upload Image
        </label>
        <Button onClick={handleReset}>Reset</Button>
      </div>
      {image && <ImageEditor image={image} onSave={handleSave} />}
      <ImageGallery images={editedImages} />
    </div>
  );
}