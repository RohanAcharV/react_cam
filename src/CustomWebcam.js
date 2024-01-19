import React, { useCallback, useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";

const CustomWebcam = () => {
  const webcamRef = useRef(null);
  const [imgSrc, setImgSrc] = useState(null);
  const [imagesArray, setImagesArray] = useState([]);
  const [cameraDevices, setCameraDevices] = useState([]);
  const [selectedCamera, setSelectedCamera] = useState(null);

  // Fetch available camera devices
  const getCameraDevices = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const cameras = devices.filter(device => device.kind === 'videoinput');
      setCameraDevices(cameras);
      setSelectedCamera(cameras[0]?.deviceId);
    } catch (error) {
      console.error("Error fetching camera devices:", error);
    }
  };

  useEffect(() => {
    getCameraDevices();
  }, []);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImgSrc(imageSrc);
    setImagesArray(prevImages => [...prevImages, imageSrc]);
  }, [webcamRef]);

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const uploadedImageSrc = reader.result;
        setImagesArray(prevImages => [...prevImages, uploadedImageSrc]);
      };
      reader.readAsDataURL(file);
    }
  };

  const retake = () => {
    setImgSrc(null);
  };

  const handleCameraChange = (event) => {
    setSelectedCamera(event.target.value);
  };

  return (
    <div className="container">
      <div className="camera-selector">
        <label htmlFor="camera">Select Camera:</label>
        <select id="camera" onChange={handleCameraChange} value={selectedCamera || ''}>
          {cameraDevices.map((camera) => (
            <option key={camera.deviceId} value={camera.deviceId}>
              {camera.label || `Camera ${cameraDevices.indexOf(camera) + 1}`}
            </option>
          ))}
        </select>
      </div>
      {imgSrc ? (
        <img src={imgSrc} alt="webcam" />
      ) : (
        <Webcam height={600} width={600} ref={webcamRef} videoConstraints={{ deviceId: selectedCamera }} />
      )}
      <div className="btn-container">
        <button onClick={capture}>Capture photo</button>
        <input type="file" accept="image/*" onChange={handleUpload} />
        {imgSrc && <button onClick={retake}>Retake photo</button>}
      </div>
      <div className="uploaded-images">
        <h2>Uploaded Images</h2>
        {imagesArray.map((image, index) => (
          <img key={index} src={image} alt={`uploaded-${index}`} />
        ))}
      </div>
    </div>
  );
};

export default CustomWebcam;
