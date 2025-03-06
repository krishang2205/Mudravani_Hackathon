import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaBlogger, FaComments, FaUsers, FaPhoneAlt, FaInfoCircle } from "react-icons/fa";
import { auth, logout } from "../firebase";
import "../components/HomePage.css";
import heroImage2 from "../components/images/Flux_Dev_A_warm_and_inviting_scene_featuring_a_diverse_group_o_3 1.png";
import heroImage from "../components/images/WhatsApp_Image_2025-02-21_at_18.09.08_fdcede51-removebg-preview.png";

const features = [
  { icon: <FaComments size={30} />, title: "Chat" },
  { icon: <FaBlogger size={30} />, title: "Blog" },
  { icon: <FaUsers size={30} />, title: "Join" },
  { icon: <FaPhoneAlt size={30} />, title: "Call" },
  { icon: <FaInfoCircle size={30} />, title: "Info" },
];

const testimonials = [
  {
    name: "Alice Smith",
    role: "Software Developer",
    testimonial: "MuteCall has revolutionized the way I communicate with my team. The real-time sign language detection is amazing!",
  },
  {
    name: "John Doe",
    role: "Product Manager",
    testimonial: "A lifesaver for people who rely on sign language for communication. It makes work and personal calls so much easier.",
  },
  {
    name: "Emma Johnson",
    role: "Community Leader",
    testimonial: "MuteCall is a game changer. It's empowering and helping bridge gaps in communication across different communities.",
  },
];

const LandingPage = () => {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(false);  
  const navigate = useNavigate();

  // Refs for sections to scroll to
  const heroRef = useRef(null);
  const aboutRef = useRef(null);
  const featuresRef = useRef(null);
  const testimonialsRef = useRef(null);

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    });

    return () => unsubscribe(); 
  }, []);

  const handleTestimonialChange = (index) => {
    setActiveTestimonial(index);
  };

  const handleJoinCall = () => {
    if (!isAuthenticated) {
      navigate("/loginpage"); 
      return;
    }

    const meetingCode = document.getElementById("meeting-code-input").value;
    if (meetingCode) {
      navigate("/VideoCallPage"); 
    }
  };

  const handleStartCall = () => {
    if (!isAuthenticated) {
      navigate("/loginpage"); 
      return;
    }
    navigate("/VideoCallPage"); 
  };

  const scrollToSection = (sectionRef) => {
    sectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleHomeClick = () => {
    scrollToSection(heroRef); 
  };

  // Logout Handler
  const handleLogout = async () => {
    try {
      await logout(); 
      setIsAuthenticated(false); 
      navigate("/"); 
    } catch (error) {
      console.error("Error during logout:", error.message);
    }
  };

  // Scroll to hero section on page load
  useEffect(() => {
    scrollToSection(heroRef);
  }, []);

  return (
    <div className="landing-container">
      {/* Navbar */}
      <nav className="navbar">
        <div className="logo">MudraConnect</div>
        <div className="nav-links">
          <button onClick={handleHomeClick}>Home</button>
          <button onClick={() => scrollToSection(aboutRef)}>About</button>
          <button onClick={() => scrollToSection(featuresRef)}>Feature</button>
          <button onClick={() => scrollToSection(testimonialsRef)}>Blog</button>
          {isAuthenticated && (
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          )}
        </div>
        {!isAuthenticated && (
          <Link to="/loginpage" className="signup-log-btn">Sign Up / Login</Link>
        )}
      </nav>

      {/* Hero Section */}
      <section ref={heroRef} className="hero">
        <div className="hero-text">
          <h1 className="hero-title">
            Bridging Communication Gaps with AI-Powered Sign Language Detection!
          </h1>
          <p className="hero-subtitle">Making conversations effortless with smart sign language detection.</p>
          <div className="hero-buttons">
            <button className="primary-btn" onClick={handleStartCall}>Start Call</button>
            <input
              type="text"
              id="meeting-code-input"
              placeholder="Enter Meeting Code or Link"
              className="meeting-code-input"
            />
            <button className="secondary-btn" onClick={handleJoinCall}>Join Call</button>
          </div>
        </div>
        <div className="hero-image-zoom">
          <img src={heroImage2} alt="AI-Powered Communication" />
        </div>
      </section>

      {/* Image and Text Section */}
      <div ref={aboutRef} className="image-container">
        <img src={heroImage} alt="Image" className="zoom-image" />
        <div className="text-container">
          <h1 className="image-title">INTRODUCTION</h1>
          <h2 className="image-subtitle">Smarter Conversations</h2>
          <p className="image-info">Our AI-powered system recognizes and translates sign language gestures in real-time, making interactions more inclusive and meaningful.</p>
        </div>
      </div>

      {/* Features Section */}
      <section ref={featuresRef} className="features">
        <h2 className="section-title">Features Designed for the Deaf Community</h2>
        <div className="feature-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-item">
              {feature.icon}
              <span>{feature.title}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section ref={testimonialsRef} className="testimonials">
        <h2 className="section-title">What Our Users Say</h2>
        <div className="testimonial-slider">
          <div className="testimonial-text">
            <p>"{testimonials[activeTestimonial].testimonial}"</p>
            <h3>{testimonials[activeTestimonial].name}</h3>
            <span>{testimonials[activeTestimonial].role}</span>
          </div>
          <div className="testimonial-navigation">
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>© 2025 MuteCall. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
