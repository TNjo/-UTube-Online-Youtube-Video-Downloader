import React, { useState } from "react";
import "./App.css";
import logo from "./Logo.png";

function App() {
  const [url, setUrl] = useState("");
  const [videoInfo, setVideoInfo] = useState(null);
  const [selectedResolution, setSelectedResolution] = useState(""); // Added state for selected resolution

  const handleInputChange = (e) => {
    setUrl(e.target.value);
  };

  const handleSendClick = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/video_info", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });

      if (response.ok) {
        const data = await response.json();
        setVideoInfo(data);
        setSelectedResolution(""); // Reset selected resolution when fetching new video info
        console.log("Success:", data);
      } else {
        console.error("Failed to fetch video information");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleResolutionChange = (e) => {
    setSelectedResolution(e.target.value);
  };

  const handleDownloadClick = async () => {
    if (selectedResolution) {
      try {
        const response = await fetch("http://127.0.0.1:5000/download", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ url, resolution: selectedResolution }),
        });
        if (response.ok) {
          const data = await response.json();
          console.log("Success:", data);
        }
      } catch (error) {
        console.error("Error:", error);
      }

      // Perform your download logic here
    } else {
      alert("Please select a resolution");
    }
  };

  return (
    <div className="App">
      <div className="div1">
        <div className="logo">
          <img className="limg" src={logo} alt="" />
          <h1>
            <span className="logoT">UTube</span>
          </h1>
        </div>
      </div>
      <div className="div2">
        <div className="download">
          <h1>You Tube Video Downloader</h1>
          <input
            type="text"
            placeholder="Enter YouTube URL"
            value={url}
            onChange={handleInputChange}
          />
          <button className="send" onClick={handleSendClick}>
            Send
          </button>
        </div>
      </div>

      {videoInfo && (
        <div className="div3">
          <h2>{videoInfo.title}</h2>
          <img
            style={{ width: "100%", maxWidth: "500px", height: "auto" }}
            src={videoInfo.thumbnail}
            alt={videoInfo.title}
          />
          <h3>Select Resolutions:</h3>
        </div>
      )}

      {videoInfo && videoInfo.resolutions && (
        <div className="div4">
          <select value={selectedResolution} onChange={handleResolutionChange}>
            <option value="">Select Resolution</option>
            {videoInfo.resolutions.map((resolution, index) => (
              <option key={index} value={resolution}>
                {resolution}
              </option>
            ))}
          </select>
          <button className="download1" onClick={handleDownloadClick}>
            Download
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
