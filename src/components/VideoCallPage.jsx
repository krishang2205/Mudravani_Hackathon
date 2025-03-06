import React, { useState, useEffect, useRef } from 'react';
import { Box, IconButton, Fab, Typography } from '@mui/material';
import { FaMicrophone, FaMicrophoneAltSlash, FaVideo, FaVideoSlash, FaPhoneAlt } from 'react-icons/fa';
import styled from '@emotion/styled';

const VideoContainer = styled(Box)(() => ({
  display: 'flex',
  justifyContent: 'center',
  gap: '20px',
  position: 'relative',
  width: '100%',
  maxWidth: '1200px',
  height: '500px',
}));

const Video = styled('video')(() => ({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  borderRadius: '8px',
}));

const ControlPanel = styled(Box)(() => ({
  position: 'fixed',
  bottom: '20px',
  left: '50%',
  transform: 'translateX(-50%)',
  display: 'flex',
  alignItems: 'center',
  gap: '25px',
  zIndex: 10,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  padding: '10px',
  borderRadius: '8px',
}));

const EndCallButton = styled(Fab)(() => ({
  backgroundColor: '#f44336',
  color: '#fff',
  padding: '15px',
  fontSize: '20px',
  '&:hover': {
    backgroundColor: '#d32f2f',
  },
}));

const VideoCallPage = ({ roomId }) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [recognizedText, setRecognizedText] = useState('');
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnection = useRef(null);
  const mediaStream = useRef(null);
  const socket = useRef(null);
  const speechSynthesisRef = useRef(window.speechSynthesis);

  useEffect(() => {
    socket.current = new WebSocket('ws://localhost:3000');

    socket.current.onopen = () => {
      console.log('WebSocket connected');
      startVideoCall(roomId);
    };

    socket.current.onmessage = (message) => {
      const data = JSON.parse(message.data);
      handleReceivedMessage(data);
    };

    socket.current.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    return () => {
      if (socket.current) socket.current.close();
    };
  }, [roomId]);

  useEffect(() => {
    const interval = setInterval(captureFrame, 2000);
    return () => clearInterval(interval);
  }, []);

  const startVideoCall = async (roomId) => {
    console.log('Starting video call for room:', roomId);
    try {
      mediaStream.current = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = mediaStream.current;
      }
    } catch (error) {
      console.error('Error accessing media devices:', error);
    }
  };

  const handleReceivedMessage = (data) => {
    console.log('Received message:', data);
    // Handle WebRTC signaling or other communication
  };

  const captureFrame = async () => {
    if (!localVideoRef.current || localVideoRef.current.videoWidth === 0) return;

    const canvas = document.createElement('canvas');
    canvas.width = localVideoRef.current.videoWidth;
    canvas.height = localVideoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(localVideoRef.current, 0, 0, canvas.width, canvas.height);
    const imageData = canvas.toDataURL('image/jpeg');

    sendToSignRecognitionAPI(imageData);
  };

  const sendToSignRecognitionAPI = async (imageData) => {
  
    try {
      const response = await fetch('http://127.0.0.1:3005/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: imageData }),
      });

      const data = await response.json();
      if (data.text) {
        setRecognizedText(data.text);
        speakText(data.text);
      }
    } catch (error) {
      console.error('Error sending frame:', error);
    }
  };

  const speakText = (text) => {
    if (!text) return;

    // Stop any ongoing speech synthesis before starting a new one
    speechSynthesisRef.current.cancel();

    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = 'en-US'; // Set language for better pronunciation
    speech.rate = 1; // Adjust speed if needed
    speech.pitch = 1;
    speech.volume = 1;
    speechSynthesisRef.current.speak(speech);
  };

  const toggleMute = () => {
    if (mediaStream.current) {
      mediaStream.current.getAudioTracks().forEach(track => (track.enabled = isMuted));
    }
    setIsMuted(!isMuted);
  };

  const toggleVideo = () => {
    if (mediaStream.current) {
      mediaStream.current.getVideoTracks().forEach(track => (track.enabled = !isVideoOn));
    }
    setIsVideoOn(!isVideoOn);
  };

  const stopVideoCall = () => {
    if (peerConnection.current) peerConnection.current.close();
    if (mediaStream.current) {
      mediaStream.current.getTracks().forEach(track => track.stop());
    }
    speechSynthesisRef.current.cancel(); // Stop speech synthesis
    window.location.href = '/';
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: '#f5f5f5', height: '100vh' }}>
      <VideoContainer>
        <Box className="video-wrapper">
          <Video ref={localVideoRef} autoPlay muted={!isMuted} />
        </Box>
        <Box className="video-wrapper">
          <Video ref={remoteVideoRef} autoPlay />
        </Box>
      </VideoContainer>

      <Typography variant="h6" sx={{ color: 'black', marginTop: '20px' }}>{recognizedText}</Typography>

      <ControlPanel>
        <IconButton onClick={toggleMute} sx={{ backgroundColor: isMuted ? '#b0bec5' : '#2196f3', borderRadius: '50%', padding: '10px' }}>
          {isMuted ? <FaMicrophoneAltSlash size={20} color="white" /> : <FaMicrophone size={20} color="white" />}
        </IconButton>

        <IconButton onClick={toggleVideo} sx={{ backgroundColor: isVideoOn ? '#4caf50' : '#f44336', borderRadius: '50%', padding: '10px' }}>
          {isVideoOn ? <FaVideo size={20} color="white" /> : <FaVideoSlash size={20} color="white" />}
        </IconButton>

        <EndCallButton onClick={stopVideoCall}>
          <FaPhoneAlt size={25} />
        </EndCallButton>
      </ControlPanel>
    </Box>
  );
};

export default VideoCallPage;
