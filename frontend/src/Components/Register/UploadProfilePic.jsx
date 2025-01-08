import React, { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import Slider from "@mui/material/Slider";
import Button from "@mui/material/Button";
import getCroppedImg from "./GetCroppingImg.jsx"; // Utility function to crop image

function UploadProfilePic() {
  const [image, setImage] = useState(null);
  const [croppedArea, setCroppedArea] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedImage, setCroppedImage] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedArea(croppedAreaPixels);
  }, []);

  const handleCrop = async () => {
    try {
      const croppedImg = await getCroppedImg(image, croppedArea);
      setCroppedImage(croppedImg);
    } catch (error) {
      console.error("Error cropping the image:", error);
    }
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      {image && (
        <div style={{ position: "relative", width: "400px", height: "400px" }}>
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={1}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
          <Slider
            value={zoom}
            min={1}
            max={3}
            step={0.1}
            onChange={(e, zoom) => setZoom(zoom)}
            style={{ marginTop: "10px" }}
          />
          <Button
            variant="contained"
            onClick={handleCrop}
            style={{ marginTop: "10px" }}
          >
            Crop Image
          </Button>
        </div>
      )}
      {croppedImage && (
        <div>
          <h4>Cropped Image Preview:</h4>
          <img
            src={croppedImage}
            alt="Cropped"
            style={{ width: "200px", height: "auto" }}
          />
        </div>
      )}
    </div>
  );
}

export default UploadProfilePic;
