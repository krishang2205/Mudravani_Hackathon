import React from "react";

function VideoGrid() {
  // Example of participants (you can replace this with real data)
  const participants = [1, 2, 3, 4];

  return (
    <div className="video-grid">
      {participants.map((participant, index) => (
        <div key={index} className="video-item">
          <video
            className="video"
            autoPlay
            playsInline
          />
        </div>
      ))}
    </div>
  );
}

export default VideoGrid;
