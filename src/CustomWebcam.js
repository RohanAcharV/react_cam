import Webcam from "react-webcam";
import { useCallback, useRef, useState, useEffect } from "react";

const CustomWebcam = () => {
  const webcamRef = useRef(null);
  const [imgSrc, setImgSrc] = useState(null);
  const [cameraDevices, setCameraDevices] = useState([]);
  const [selectedCamera, setSelectedCamera] = useState(null);

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
  }, [webcamRef]);

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
        {imgSrc ? (
          <button onClick={retake}>Retake photo</button>
        ) : (
          <button onClick={capture}>Capture photo</button>
        )}
      </div>
    </div>
  );
};

export default CustomWebcam;
