const localVideo = document.getElementById('localVideo');
const remoteVideo = document.getElementById('remoteVideo');
const startButton = document.getElementById('startButton');
const muteButton = document.getElementById('muteButton');
const endCallButton = document.getElementById('endCallButton');

const socket = io();
let localStream;
let peerConnection;
let isMuted = false;

const configuration = {
    iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
};

// OpenAI API setup (for sign language detection and TTS)
const openai = new OpenAI({
    apiKey: 'YOUR_OPENAI_API_KEY',  // Replace with your OpenAI API key
});

// Start the call when the button is clicked
startButton.onclick = async () => {
    try {
        // Get user media
        console.log('Attempting to get user media...');
        localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        localVideo.srcObject = localStream;
        console.log('User media obtained');

        // Disable start button once the call is started
        startButton.disabled = true;
        muteButton.disabled = false;
        endCallButton.disabled = false;

        // Create peer connection
        peerConnection = new RTCPeerConnection(configuration);
        console.log('Peer connection created');

        // Set up ICE candidate handling
        peerConnection.onicecandidate = (event) => {
            if (event.candidate) {
                console.log('ICE candidate:', event.candidate);
                socket.emit("ice-candidate", event.candidate);
            }
        };

        // Add local stream to peer connection
        localStream.getTracks().forEach(track => peerConnection.addTrack(track, localStream));

        // Handle remote stream
        peerConnection.ontrack = (event) => {
            console.log('Remote stream received');
            remoteVideo.srcObject = event.streams[0];
        };

        // Create offer
        console.log('Creating offer...');
        const offer = await peerConnection.createOffer();
        console.log('Offer created:', offer);
        await peerConnection.setLocalDescription(offer);

        // Join a room (you can use a unique room ID)
        const roomId = "room1"; // Change this to a dynamic room ID if needed
        socket.emit("join-room", roomId, socket.id);
        console.log('Joining room:', roomId);

        // Send the offer to the other user
        socket.emit("offer", offer, roomId);
    } catch (error) {
        console.error("Error starting video call:", error);
        alert("Error starting video call: " + error.message);
    }
};

// Handle incoming offer
socket.on("offer", async (offer) => {
    try {
        console.log('Received offer:', offer);
        await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await peerConnection.createAnswer();
        console.log('Answer created:', answer);
        await peerConnection.setLocalDescription(answer);
        socket.emit("answer", answer);
    } catch (error) {
        console.error("Error handling incoming offer:", error);
    }
});

// Handle incoming answer
socket.on("answer", (answer) => {
    try {
        console.log('Received answer:', answer);
        peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
    } catch (error) {
        console.error("Error handling incoming answer:", error);
    }
});

// Handle user connection
socket.on("user-connected", (userId) => {
    console.log("User connected:", userId);
});

// Handle user disconnection
socket.on("user-disconnected", (userId) => {
    console.log("User disconnected:", userId);
    // Close the connection and clean up on user disconnect
    if (peerConnection) {
        peerConnection.close();
        peerConnection = null;
    }
    remoteVideo.srcObject = null;
});

// Listen for ICE candidates from other users
socket.on("ice-candidate", (candidate) => {
    try {
        console.log('Received ICE candidate:', candidate);
        peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
    } catch (error) {
        console.error("Error adding ICE candidate:", error);
    }
});

// Mute/Unmute functionality
muteButton.onclick = () => {
    try {
        isMuted = !isMuted;
        localStream.getAudioTracks()[0].enabled = !isMuted;
        muteButton.textContent = isMuted ? "Unmute" : "Mute";
    } catch (error) {
        console.error("Error toggling mute:", error);
    }
};

// End call functionality
endCallButton.onclick = () => {
    try {
        // Stop all tracks and close peer connection
        localStream.getTracks().forEach(track => track.stop());
        if (peerConnection) {
            peerConnection.close();
            peerConnection = null;
        }
        localVideo.srcObject = null;
        remoteVideo.srcObject = null;

        // Re-enable the start button and disable other buttons
        startButton.disabled = false;
        muteButton.disabled = true;
        endCallButton.disabled = true;
    } catch (error) {
        console.error("Error ending call:", error);
    }
};

// Capture frame from video feed and send to OpenAI for sign language detection
async function captureFrame(videoElement) {
    const canvas = document.createElement("canvas");
    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;
    const ctx = canvas.getContext("2d");

    // Draw the current frame on the canvas
    ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
   
    // Convert the canvas to base64 image data
    return canvas.toDataURL("image/png");
}

// Detect sign language and send to OpenAI API
async function detectSignLanguage(videoElement) {
    const imageData = await captureFrame(videoElement);  // Capture frame from the video

    try {
        // Send image to OpenAI for sign language detection
        const response = await openai.images.generate({
            model: "gpt-4-vision-preview",  // Use GPT-4 Vision model
            prompt: "Analyze this image and detect the sign language being shown. Return only the translated text.",
            image: imageData,
        });

        const translatedText = response.data.choices[0].text.trim();  // Extract translated text
        displayText(translatedText); // Display the translated text
        speakText(translatedText);  // Convert text to speech
    } catch (error) {
        console.error("Error detecting sign language:", error);
    }
}

// Display detected text on the screen (optional)
function displayText(text) {
    const textElement = document.getElementById('detectedText');
    textElement.textContent = text;
}

// Convert detected text to speech
async function speakText(text) {
    try {
        const response = await openai.audio.speech.create({
            model: "tts-1",  // Text-to-Speech model
            input: text,
            voice: "alloy"  // Voice selection (you can customize this)
        });

        // Play the audio response (speech)
        const audio = new Audio(response.url);
        audio.play();
    } catch (error) {
        console.error("Error converting text to speech:", error);
    }
}

// Set an interval to check for sign language every 2 seconds
async function detectHandSigns(videoElement) {
    setInterval(async () => {
        await detectSignLanguage(videoElement);
    }, 2000);  // Check every 2 seconds
}

// Start detecting sign language when video call starts
const videoElement = document.getElementById("localVideo");
detectHandSigns(videoElement);
