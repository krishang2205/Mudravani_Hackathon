import React from "react";

function Controls() {
  return (
    <div className="controls">
      <button className="control-btn mute-btn">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="control-icon">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v4m0 0l-2-2m2 2l2-2M6.29 6.29A9 9 0 0112 3c2.507 0 4.804.99 6.618 2.618l-1.417 1.417A7.95 7.95 0 0012 5C9.79 5 8 6.79 8 9c0 1.516.9 2.834 2.185 3.485L6.29 6.29z" />
        </svg>
      </button>
      <button className="control-btn video-btn">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="control-icon">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12H9m6 0l-3-3m3 3l-3 3m-6-3h4m6 0h-4m-6-3l-3 3m3-3l-3-3" />
        </svg>
      </button>
      <button className="control-btn leave-btn">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="control-icon">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12H9m6 0l-3-3m3 3l-3 3m-6-3h4m6 0h-4m-6-3l-3 3m3-3l-3-3" />
        </svg>
      </button>
    </div>
  );
}

export default Controls;
