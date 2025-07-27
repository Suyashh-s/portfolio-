import React, { useState, useEffect, useRef } from "react";
import { Send, User, FolderOpen, BookOpen, Palette, Phone, Award, FileText, Github, ExternalLink, Mail, MapPin, Code, Briefcase, MessageCircle, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

// Types
interface Project {
  title: string;
  description: string;
  tech: string[];
  github: string;
  live: string;
  video: string;
}

// Typing effect hook
function useTypingEffect(text, speed = 80, delay = 0) {
  const [displayed, setDisplayed] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  // Grapheme splitter
  function getGraphemes(str: string): string[] {
    if (typeof (Intl as any).Segmenter === "function") {
      const segmenter = new (Intl as any).Segmenter(undefined, { granularity: "grapheme" });
      return Array.from(segmenter.segment(str), (s: any) => s.segment);
    }
    return Array.from(str);
  }

  useEffect(() => {
    let interval = null;
    let timeout = null;
    const graphemes = getGraphemes(text);

    setDisplayed("");
    setIsTyping(false);

    timeout = setTimeout(() => {
      setIsTyping(true);
      let i = 0;
      interval = setInterval(() => {
        setDisplayed((prev) => {
          if (i < graphemes.length) {
            const next = prev + graphemes[i];
            i++;
            return next;
          } else {
            if (interval) clearInterval(interval);
            return prev;
          }
        });
      }, speed);
    }, delay);

    return () => {
      if (interval) clearInterval(interval);
      if (timeout) clearTimeout(timeout);
    };
  }, [text, speed, delay]);

  const graphemeCount = getGraphemes(text).length;
  const displayedCount = getGraphemes(displayed).length;

  return { displayed, isTyping, graphemeCount, displayedCount };
}

const greetings = [
  "Hello", // English
  "नमस्ते", // Hindi
  "নমস্কার", // Bengali
  "నమస్తే", // Telugu
  "வணக்கம்", // Tamil
  "ગુજરાતી", // Gujarati
  "ನಮಸ್ಕಾರ", // Kannada
  "ଓଡ଼ିଆ", // Odia
  "ਪੰਜਾਬੀ", // Punjabi
  "മലയാളം", // Malayalam
  "اردو", // Urdu
  "অসমীয়া", // Assamese
  "संस्कृतम्", // Sanskrit
  "मणिपुरी", // Manipuri
  "नमस्कार", // Marathi
];

function Preloader({ onFinish }: { onFinish: () => void }) {
  const [index, setIndex] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (index === 0) {
      timer = setTimeout(() => setIndex(i => i + 1), 500); // 200ms for "Hello"
    } else if (index < greetings.length - 2) {
      timer = setTimeout(() => setIndex(i => i + 1), 100); // 100ms for others
    } else if (index === greetings.length - 2) {
      timer = setTimeout(() => setIndex(i => i + 1), 190); // 190ms for second last
    } else {
      timer = setTimeout(() => setDone(true), 300); // Hold last greeting longer
    }
    return () => clearTimeout(timer);
  }, [index]);

  useEffect(() => {
    if (done) {
      const timer = setTimeout(onFinish, 800);
      return () => clearTimeout(timer);
    }
  }, [done, onFinish]);

  return (
    <motion.div
      initial={{ top: 0, opacity: 1 }}
      animate={done ? { top: "-100vh", opacity: 0 } : { top: 0, opacity: 1 }}
      transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black text-white text-5xl font-bold select-none"
      style={{ pointerEvents: "none" }}
    >
      <span
        style={{ display: "inline-block", minWidth: 200, width: "100vw", textAlign: "center" }}
        className="text-center"
      >
        {greetings[index]}
      </span>
    </motion.div>
  );
}

export const RESUME_URL = "https://pub-c31ada0ae90b4637b66c95c2e1fef0f6.r2.dev/resume.pdf";

// Projects Data
const projects = [
  {
    title: "Lokyatri",
    description: "Lok Yatri is an AI-powered travel companion app designed to help travelers explore destinations like a local. It connects tourists with authentic local experiences, hidden gems, and culturally immersive activities while ensuring seamless, stress-free navigation.",
    tech: ["Web Socket", "Flutter", "Python", "AWS Bedrock", "Qdrant", "+3 more"],
    github: "#",
    live: "#",
    video: "https://pub-c31ada0ae90b4637b66c95c2e1fef0f6.r2.dev/lokyatri.mp4"
  },
  {
    title: "Raksha",
    description: "Cross-platform mobile safety application with AI-driven threat detection, facial recognition, and community support features. Enhanced user alert responsiveness by 35%.",
    tech: ["Flutter", "Dart", "MERN Stack", "AI/ML", "+1 more"],
    github: "#",
    live: "#",
    video: "https://pub-c31ada0ae90b4637b66c95c2e1fef0f6.r2.dev/raksha.mp4"
  },
  {
    title: "VyomAssist",
    description: "Banking assistance application with AI-powered chatbot functionality and facial recognition authentication. Reduced customer support response time by 50%.",
    tech: ["Flutter", "Dart", "MERN Stack", "AI/ML", "+1 more"],
    github: "#",
    live: "#",
    video: "https://pub-c31ada0ae90b4637b66c95c2e1fef0f6.r2.dev/vyom.mp4"
  },
  {
    title: "InfluencerHub",
    description: "Centralized social media management platform with real-time analytics and AI-powered content generation. Amplified campaign effectiveness by 35%.",
    tech: ["React", "JavaScript", "CSS", "Bootstrap", "+2 more"],
    github: "#",
    live: "#",
    video: "https://pub-c31ada0ae90b4637b66c95c2e1fef0f6.r2.dev/infhub.mp4"
  }
];

const visionVaultProjects = [
  {
    title: "FitDetect: Intelligent Apparel Classifier",
    description: "AI system that detects and classifies worn clothes (saree, shirt, pant, skirt, etc.) for fashion analytics and retail insights",
    tech: ["Python", "TensorFlow", "OpenCV","+1 more"],
    github: "#",
    live: "#",
    video: "https://pub-c31ada0ae90b4637b66c95c2e1fef0f6.r2.dev/1.mp4"
  },
  {
    title: "SafeCity: Violence & Chain Snatching Detector",
    description: "Real-time vision system to detect chain snatching and violent activities for public safety and surveillance alerts",
    tech: ["Python", "PyTorch", "Roboflow","+1 more"],
    github: "#",
    live: "#",
    video: "https://pub-c31ada0ae90b4637b66c95c2e1fef0f6.r2.dev/2.mp4"
  },
  {
    title: "FaceSecure: Face & Identity Verification",
    description: "Facial verification linked with phone number or Aadhaar for secure access control and digital KYC solutions",
    tech: ["Python", "FaceNet", "OpenCV","+2 more"],
    github: "#",
    live: "#",
    video: "https://pub-c31ada0ae90b4637b66c95c2e1fef0f6.r2.dev/3.mp4"
  },
  {
    title: "AutoPlate: Vehicle & Number Plate Recognition",
    description: "Vehicle detection with OCR-based number plate reading for automated tolls, parking, and law enforcement",
    tech: ["Python", "YOLO", "Tesseract OCR", "+1 more"] ,
    github: "#",
    live: "#",
    video: "https://pub-c31ada0ae90b4637b66c95c2e1fef0f6.r2.dev/4.mp4"
  }
];

const skills = {
  "Frontend": ["React", "TypeScript", "Next.js", "Tailwind CSS", "Redux", "HTML", "CSS", "Bootstrap"],
  "Backend": ["Node.js", "Express.js", "MongoDB", "MySQL", "REST APIs", "Java", "AWS", "MongoDB Atlas", "Solidity"],
  "Tools & AI/ML": ["Python", "TensorFlow", "PyTorch", "computer vision", "Git", "GitHub", "Docker", "Postman", "AWS", "Figma", "Canva", "Adobe Photoshop", "Blender"],
  "Mobile Development": ["React Native", "Flutter"]
};

const achievements = [
  {
    title: "Smart India Hackathon 2024 – Winner (National Level)",
    issuer: "Smart India Hackathon",
    date: "2024",
    description: "Led a team to develop an AI-powered platform for a government-issued problem. The solution was recognized for its innovation, scalability, and real-world applicability."
  },
  {
    title: "InspirioBiz 5.0 – Finalist (National Level)",
    issuer: " VESIT (Vivekanand Education Society's Institute of Technology)",
    date: "2025",
    description: "As part of Team Shiledar, we were one of the first undergraduate engineering teams to break into this MBA-level business strategy competition, delivering a standout tech-enabled solution."
  },
  {
    title: "LenDenClub's AI Hackathon — Finalist",
    issuer: "LenDenClub AI Hackathon",
    date: "2025",
    description: "Built an AI-driven risk assessment system for the P2P lending sector, combining machine learning models and real-time data to enable smarter credit decisions."
  },
  {
    title: "Airavat 2.0 — Grand Finalist (National Level)",
    issuer: "Sardar Patel Institute of Technology",
    date: "2025",
    description: "Designed an end-to-end intelligent system in a competitive AI hackathon. Reached the final stage among 1000+ participants for technical depth and execution."
  },
  {
    title: "IDE Bootcamp – Grand Finalist (Edition 2, Phase 2)",
    issuer: "Ministry of Education & Wadhwani Foundation",
    date: "2025",
    description: "Selected by the Ministry of Education & Wadhwani Foundation as a top finalist nationwide for a startup-centric innovation bootcamp, beating out thousands of entries."
  },
  {
    title: "MujHacks 2.0 – Top 30 (University Level)",
    issuer: "Manipal University Jaipur",
    date: "2024",
    description: "Ranked among the top 30 teams at Manipal University Jaipur's flagship hackathon, recognized for crafting smart tech-based solutions under pressure."
  }
];

// Utility to detect mobile devices
function isMobileDevice() {
  if (typeof navigator === 'undefined') return false;
  return /Mobi|Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(navigator.userAgent);
}

function ResumeModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  // Only run mobile detection on the client
  const [isMobile, setIsMobile] = React.useState(false);
  React.useEffect(() => {
    setIsMobile(isMobileDevice());
  }, []);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full relative">
        {/* Close Button */}
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-xl font-bold"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
        <h2 className="text-lg font-semibold mb-4 text-gray-900">Resume PDF</h2>
        {/* Mobile: Show message and open button. Desktop: Show PDF preview. */}
        {isMobile ? (
          <div className="mb-4 text-sm text-gray-700 text-center">
            PDF preview is not supported on mobile devices.<br />Please use the button below to open the PDF in a new tab.
          </div>
        ) : (
          <div className="mb-4 w-full flex justify-center">
            <iframe
              src={RESUME_URL}
              title="Resume Preview"
              className="w-full h-96 rounded-lg border border-gray-200 shadow"
              style={{ minHeight: 400, height: 500 }}
            />
          </div>
        )}
        {/* Action Button */}
        {isMobile ? (
          <a
            href={RESUME_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white px-6 py-2 rounded-lg font-medium shadow-md transition-all duration-200"
          >
            Open PDF
          </a>
        ) : (
          <a
            href={RESUME_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white px-6 py-2 rounded-lg font-medium shadow-md transition-all duration-200"
          >
            View Resume
          </a>
        )}
      </div>
    </div>
  );
}

// Mini Chatbot Component
function MiniChatbot({ navigate }: { navigate: (path: string) => void }) {
  const [messages, setMessages] = useState<Array<{id: number, text: string, isBot: boolean, timestamp: string}>>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      setTimeout(() => {
        messagesContainerRef.current.scrollTo({
          top: messagesContainerRef.current.scrollHeight,
          behavior: 'smooth'
        });
      }, 100);
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const addMessage = (text: string, isBot: boolean) => {
    const newMessage = {
      id: Date.now(),
      text,
      isBot,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const sendMessageToAPI = async (message: string) => {
    try {
      const response = await fetch('http://localhost:8000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      return data.response;
    } catch (error) {
      console.error('Error sending message:', error);
      return "Sorry, I'm having trouble connecting right now. Please try clicking to open the full chat.";
    }
  };

  useEffect(() => {
    if (!hasStarted) {
      setHasStarted(true);
      // Add initial greeting immediately
      addMessage("👋 Hi! I'm Suyash's AI assistant. Let me tell you about his achievements...", true);
      
      // Add comprehensive achievements response with images
      setTimeout(() => {
        addMessage(`Here are some of my key achievements and hackathon milestones:

🏆 **Winner** — Smart India Hackathon 2024 (National Level), Government of India.

🥈 **Finalist** — InspirioBiz 5.0 Case Study Competition 2025 (National Level), VESIT. My team 'Shiledar' secured a finalist position as one of the first undergraduate engineering teams to break into this business-focused competition.

🌟 **Grand Finalist** — IDE Bootcamp (Edition 2, Phase 2), 2025 (National Level), Ministry of Education & Wadhwani Foundation.

🎯 **Top 30** — MujHacks 2.0, 2024 (University Level), Manipal University Jaipur.

🤖 **Finalist** — LenDenClub's AI Hackathon — The Matrix Protocol, 2025.

🚀 **Grand Finalist** — Airavat 2.0 - An AI Hackathon, 2025 (National Level), IEEE CS, Sardar Patel Institute of Technology, Mumbai.

I continue to actively participate in national and international hackathons, constantly pushing my skills, learning from amazing teams, and building solutions that make an impact.

[IMAGES:/images/photo1.jpg,/images/photo2.jpg,/images/photo3.jpg,/images/photo4.jpg]`, true);
      }, 1000);
    }
  }, [hasStarted]);

  const handleClick = () => {
    sessionStorage.setItem("autoQuestion", "Tell me about your achievements in detail");
    navigate("/chat");
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
      className="w-80 cursor-pointer"
      onClick={handleClick}
    >
      <style jsx>{`
        .chat-messages::-webkit-scrollbar {
          width: 6px;
        }
        .chat-messages::-webkit-scrollbar-track {
          background: #F3F4F6;
          border-radius: 10px;
        }
        .chat-messages::-webkit-scrollbar-thumb {
          background: #D1D5DB;
          border-radius: 10px;
        }
        .chat-messages::-webkit-scrollbar-thumb:hover {
          background: #9CA3AF;
        }
      `}</style>
      <Card className="bg-white/95 backdrop-blur-xl border-gray-200/50 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-[1.02] h-[36rem] flex flex-col">
        {/* Chat Header */}
        <div className="flex items-center gap-3 p-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-purple-50 rounded-t-lg">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 text-sm">AI Assistant</h3>
            <p className="text-xs text-green-600 flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              Online • Ready to help
            </p>
          </div>
          <div className="flex gap-1">
            <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
            <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
            <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
          </div>
          {/* Scroll indicator */}
          <div className="text-xs text-gray-400 flex items-center gap-1">
            <div className="w-1 h-4 bg-gray-300 rounded-full"></div>
            <span>Scroll</span>
          </div>
        </div>

        {/* Chat Messages */}
        <div 
          ref={messagesContainerRef} 
          className="flex-1 p-4 space-y-3 overflow-y-auto max-h-96 chat-messages"
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: '#D1D5DB #F3F4F6',
          }}
        >
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}>
              <div className={`max-w-[90%] ${message.isBot ? 'bg-gray-100' : 'bg-blue-500 text-white'} rounded-lg px-3 py-2`}>
                <div className="text-sm leading-relaxed whitespace-pre-line">
                  {(() => {
                    // Check if message contains images
                    const hasImages = message.text.includes('[IMAGES:');
                    let textContent = message.text;
                    let images: string[] = [];
                    
                    if (hasImages) {
                      const imageMatch = message.text.match(/\[IMAGES:(.*?)\]/);
                      if (imageMatch) {
                        images = imageMatch[1].split(',');
                        textContent = message.text.replace(/\[IMAGES:.*?\]/, '');
                      }
                    }
                    
                    return (
                      <>
                        {textContent.split('\n').map((line, index) => {
                          // Handle bold formatting **text**
                          if (line.includes('**')) {
                            const parts = line.split('**');
                            return (
                              <p key={index} className={index > 0 ? 'mt-2' : ''}>
                                {parts.map((part, partIndex) => 
                                  partIndex % 2 === 1 ? <strong key={partIndex}>{part}</strong> : part
                                )}
                              </p>
                            );
                          }
                          return line ? <p key={index} className={index > 0 ? 'mt-2' : ''}>{line}</p> : <br key={index} />;
                        })}
                        
                        {/* Render images if present */}
                        {images.length > 0 && (
                          <div className="mt-3 grid grid-cols-2 gap-2">
                            {images.map((imagePath, index) => (
                              <img
                                key={index}
                                src={imagePath.trim()}
                                alt={`Achievement ${index + 1}`}
                                className="w-full h-20 object-cover rounded-lg border border-gray-200"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                }}
                              />
                            ))}
                          </div>
                        )}
                      </>
                    );
                  })()}
                </div>
                <p className={`text-xs mt-2 ${message.isBot ? 'text-gray-500' : 'text-blue-100'}`}>
                  {message.timestamp}
                </p>
              </div>
            </div>
          ))}
          
          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-lg px-3 py-2 max-w-[80%]">
                <div className="flex items-center gap-1">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                  <span className="text-xs text-gray-500 ml-2">typing...</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Chat Input */}
        <div className="p-4 border-t border-gray-100 bg-gray-50/50 rounded-b-lg">
          <div className="flex items-center gap-2 bg-white rounded-full border border-gray-200 px-3 py-2">
            <MessageCircle className="w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Click anywhere to start chatting..."
              className="flex-1 text-sm bg-transparent border-none outline-none text-gray-600 cursor-pointer"
              readOnly
            />
            <Send className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-xs text-center text-gray-500 mt-2">💬 Click to open full chat experience</p>
        </div>
      </Card>
    </motion.div>
  );
}

const Index = () => {
  const [chatMessage, setChatMessage] = useState("");
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const navigate = useNavigate();
  const [showPreloader, setShowPreloader] = useState(true);
  const [startTyping, setStartTyping] = useState(false);
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalProject, setModalProject] = useState<Project | null>(null);
  const [projectsRepeat, setProjectsRepeat] = useState(2);
  const [visionRepeat, setVisionRepeat] = useState(2);
  const [projectsAnimDuration, setProjectsAnimDuration] = useState(30);
  const [visionAnimDuration, setVisionAnimDuration] = useState(30);
  const [showMiniChatbot, setShowMiniChatbot] = useState(false);
  const projectsContainerRef = useRef<HTMLDivElement>(null);
  const projectsContentRef = useRef<HTMLDivElement>(null);
  const visionContainerRef = useRef<HTMLDivElement>(null);
  const visionContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!showPreloader) {
      setStartTyping(true);
      // Show mini chatbot immediately when preloader finishes
      setShowMiniChatbot(true);
    }
  }, [showPreloader]);

  useEffect(() => {
    function updateRepeats() {
      // Projects
      if (projectsContainerRef.current && projectsContentRef.current) {
        const containerWidth = projectsContainerRef.current.offsetWidth;
        const cardWidth = projectsContentRef.current.children[0]?.clientWidth || 0;
        const cardsCount = projects.length;
        const minContentWidth = containerWidth * 2;
        const singleSetWidth = cardWidth * cardsCount;
        let repeat = 2;
        if (singleSetWidth > 0) {
          repeat = Math.ceil(minContentWidth / singleSetWidth);
        }
        setProjectsRepeat(repeat < 2 ? 2 : repeat);
        setProjectsAnimDuration(20 + repeat * 5);
      }
      // Vision Vault
      if (visionContainerRef.current && visionContentRef.current) {
        const containerWidth = visionContainerRef.current.offsetWidth;
        const cardWidth = visionContentRef.current.children[0]?.clientWidth || 0;
        const cardsCount = visionVaultProjects.length;
        const minContentWidth = containerWidth * 2;
        const singleSetWidth = cardWidth * cardsCount;
        let repeat = 2;
        if (singleSetWidth > 0) {
          repeat = Math.ceil(minContentWidth / singleSetWidth);
        }
        setVisionRepeat(repeat < 2 ? 2 : repeat);
        setVisionAnimDuration(20 + repeat * 5);
      }
    }
    updateRepeats();
    window.addEventListener("resize", updateRepeats);
    return () => window.removeEventListener("resize", updateRepeats);
  }, []);

  const { displayed: typedText, isTyping, graphemeCount, displayedCount } = useTypingEffect(
    "Hey there,",
    200,
    startTyping ? 0 : 999999
  );

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const navSections = [
    { name: "Me", icon: User, color: "bg-emerald-400/30", action: () => { sessionStorage.setItem("autoQuestion", "Tell me about yourself"); navigate("/chat"); } },
    { name: "Projects", icon: FolderOpen, color: "bg-purple-400/30", action: () => { sessionStorage.setItem("autoQuestion", "What projects have you worked on?"); navigate("/chat"); } },
    { name: "Skills", icon: BookOpen, color: "bg-blue-400/30", action: () => { sessionStorage.setItem("autoQuestion", "What are your technical skills?"); navigate("/chat"); } },
    { name: "Achievements", icon: Award, color: "bg-pink-400/30", action: () => { sessionStorage.setItem("autoQuestion", "What are your achievements?"); navigate("/chat"); } },
    { name: "Contact", icon: Phone, color: "bg-yellow-400/30", action: () => { sessionStorage.setItem("autoQuestion", "How can I contact you?"); navigate("/chat"); } }
  ];
  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/chat");
  };

  const handleInputClick = () => {
    navigate("/chat");
  };

  return (
    <>
      {showPreloader && (
        <Preloader onFinish={() => setShowPreloader(false)} />
      )}
      <ResumeModal open={showResumeModal} onClose={() => setShowResumeModal(false)} />
      <AnimatePresence>
        {!showPreloader && (
          <motion.div
            key="main-content"
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
          >
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 relative overflow-hidden">
              {/* Animated color blobs */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div 
                  className="absolute w-96 h-96 rounded-full bg-gradient-to-r from-pink-300/40 via-purple-300/40 to-blue-300/40 blur-3xl transition-all duration-1000 ease-out"
                  style={{
                    left: mousePosition.x - 200,
                    top: mousePosition.y - 200,
                  }}
                />
                <div 
                  className="absolute w-80 h-80 rounded-full bg-gradient-to-r from-green-300/30 via-yellow-300/30 to-orange-300/30 blur-3xl transition-all duration-1500 ease-out"
                  style={{
                    left: mousePosition.x - 100,
                    top: mousePosition.y - 150,
                  }}
                />
                <div 
                  className="absolute w-64 h-64 rounded-full bg-gradient-to-r from-cyan-300/25 via-teal-300/25 to-green-300/25 blur-3xl transition-all duration-2000 ease-out"
                  style={{
                    left: mousePosition.x - 300,
                    top: mousePosition.y - 100,
                  }}
                />
              </div>

              {/* Main Content Container */}
              <div className="relative z-10 space-y-12">
                {/* About Me Section */}
                <section id="about" className="px-6 pt-12">
                  <div className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto">
                    {/* Main About Content */}
                    <div className="flex-1">
                      <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-6 md:p-8 shadow-lg border border-gray-200/50">
                        <div className="flex flex-col md:flex-row items-start gap-4 md:gap-8">
                          {/* Profile Image */}
                          <div className="flex-shrink-0 flex justify-center items-center w-20 h-20 md:w-48 md:h-60 lg:w-56 lg:h-70">
                            <div className="w-20 h-20 md:w-48 md:h-60 lg:w-56 lg:h-70 rounded-2xl bg-gradient-to-br from-orange-200 via-pink-200 to-purple-200 flex items-center justify-center shadow-2xl overflow-hidden">
                              <img
                                src="https://pub-c31ada0ae90b4637b66c95c2e1fef0f6.r2.dev/about.jpg"
                                alt="Suyash Sawant"
                                className="w-full h-full object-cover"
                              />
                            </div>
                          </div>
                          {/* Mobile: Greeting and Name beside image; Desktop: all text stacked */}
                          <div className="flex-1">
                            {/* Mobile only: greeting and name beside image */}
                            <div className="flex flex-col md:hidden justify-center">
                              <p className="text-base text-gray-600 mb-1">
                                {typedText}
                                {isTyping && displayedCount < graphemeCount && (
                                  <span className="border-r-2 border-gray-600 animate-pulse ml-1" />
                                )}
                              </p>
                              <h1 className="text-xl font-bold text-gray-900 mb-2">
                                I'm Suyash Sawant
                              </h1>
                            </div>
                            {/* Desktop only: greeting, name, and about stacked */}
                            <div className="hidden md:block">
                              <p className="text-lg text-gray-600 mb-3">
                                {typedText}
                                {isTyping && displayedCount < graphemeCount && (
                                  <span className="border-r-2 border-gray-600 animate-pulse ml-1" />
                                )}
                              </p>
                              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
                                I'm Suyash Sawant
                              </h1>
                              <div className="space-y-3 md:space-y-4 text-base text-gray-700 leading-relaxed">
                                <p>
                                  Software Engineer and Full Stack Developer experienced in JavaScript, TypeScript, React, Next.js, Node.js (Express), Python, Flutter, and AI/ML technologies like TensorFlow and PyTorch. Currently pursuing a B.E. in Information Technology at Datta Meghe College of Engineering.
                                </p>
                                <p>
                                  Winner of <span className="font-bold">Smart India Hackathon 2024</span> and a finalist in multiple national hackathons, including InspirioBiz 5.0 and Airavat 2.0. I specialize in building scalable web applications, cross-platform mobile apps, and intelligent AI-powered solutions that address real-world challenges.
                                </p>
                                <p>
                                  Skilled in designing modern UI/UX with Figma, developing robust RESTful APIs, optimizing databases, and deploying cloud infrastructure on AWS and Cloudflare. Passionate about creating impactful, user-focused products that drive innovation and growth.
                                </p>
                                <p className="font-medium text-gray-800">
                                  I'm driven to create technology that feels personal, purposeful, and truly meaningful.
                                </p>
                              </div>
                              <div className="mt-6">
                                <Button
                                  className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white px-8 py-3 rounded-xl flex items-center gap-3 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 border-0 font-medium"
                                  onClick={() => setShowResumeModal(true)}
                                >
                                  <FileText className="w-5 h-5" />
                                  View Resume
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* Mobile only: rest of the about text and button below */}
                      <div className="block md:hidden space-y-3 text-sm text-gray-700 leading-relaxed mt-4 px-6">
                        <p>
                          Software Engineer and Full Stack Developer experienced in JavaScript, TypeScript, React, Next.js, Node.js (Express), Python, Flutter, and AI/ML technologies like TensorFlow and PyTorch. Currently pursuing a B.E. in Information Technology at Datta Meghe College of Engineering.
                        </p>
                        <p>
                          Winner of <span className="font-bold">Smart India Hackathon 2024</span> and a finalist in multiple national hackathons, including InspirioBiz 5.0 and Airavat 2.0. I specialize in building scalable web applications, cross-platform mobile apps, and intelligent AI-powered solutions that address real-world challenges.
                        </p>
                        <p className="font-medium text-gray-800">
                          I'm driven to create technology that feels personal, purposeful, and truly meaningful.
                        </p>
                        <div className="mt-4">
                          <Button
                            className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white px-8 py-3 rounded-xl flex items-center gap-3 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 border-0 font-medium"
                            onClick={() => setShowResumeModal(true)}
                          >
                            <FileText className="w-5 h-5" />
                            View Resume
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Mini Chatbot */}
                    <div className="hidden lg:block">
                      {showMiniChatbot && !showPreloader && (
                        <MiniChatbot navigate={navigate} />
                      )}
                    </div>
                  </div>
                </section>

                {/* Projects Section */}
                <section id="projects" className="px-6">
                  <div className="flex items-center gap-3 mb-8">
                    <Briefcase className="w-6 h-6 text-blue-600" />
                    <h2 className="text-3xl font-bold text-gray-900">Projects</h2>
                  </div>
                  {/* Regular Projects - Dynamic Seamless Marquee */}
                  <div className="overflow-hidden w-full mb-12" ref={projectsContainerRef}>
                    <div
                      className="flex w-max"
                      ref={projectsContentRef}
                      style={{
                        animation: `scroll-left-dyn ${projectsAnimDuration}s linear infinite`,
                      }}
                    >
                      {Array.from({ length: projectsRepeat }).flatMap((_, r) =>
                        projects.map((project, index) => (
                          <Card
                            key={r + '-' + index}
                            className="relative overflow-hidden bg-transparent backdrop-blur-xl border-gray-200/50 hover:shadow-lg transition-all duration-300 hover:scale-105 flex-shrink-0 w-80 inline-block cursor-pointer mx-1"
                            onClick={() => { setModalProject(project); setModalOpen(true); }}
                          >
                            {/* Video Background */}
                            <video
                              className="absolute inset-0 w-full h-full object-cover z-0"
                              src={project.video}
                              autoPlay
                              loop
                              muted
                              playsInline
                              style={{ opacity: 0.5 }}
                            />
                            {/* Overlay for extra clarity */}
                            <div className="absolute inset-0 bg-white/30 z-10" />
                            {/* Card Content */}
                            <div className="relative z-20 h-full flex flex-col">
                              <CardHeader>
                                <CardTitle className="text-lg">{project.title}</CardTitle>
                                <CardDescription>{project.description}</CardDescription>
                              </CardHeader>
                              <CardContent className="flex flex-col flex-1">
                                <div className="flex flex-wrap gap-2 mb-4">
                                  {project.tech.map((tech) => (
                                    <Badge key={tech} variant="secondary" className="text-xs">
                                      {tech}
                                    </Badge>
                                  ))}
                                </div>
                                <div className="flex-1" />
                                <div className="flex gap-2 mt-2">
                                  <a href="https://github.com/Suyashh-s" target="_blank" rel="noopener noreferrer">
                                    <Button size="sm" variant="outline" className="flex-1">
                                      <Github className="w-4 h-4 mr-2" />
                                      Code
                                    </Button>
                                  </a>
                                  <Button size="sm" className="flex-1">
                                    <ExternalLink className="w-4 h-4 mr-2" />
                                    View
                                  </Button>
                                </div>
                              </CardContent>
                            </div>
                          </Card>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Vision Vault Subsection */}
                  <div className="mb-8">
                    <h3 className="text-2xl font-semibold text-gray-800 mb-6 pl-2 border-l-4 border-purple-500">Vision Vault</h3>
                    <div className="overflow-hidden w-full" ref={visionContainerRef}>
                      <div
                        className="flex w-max"
                        ref={visionContentRef}
                        style={{
                          animation: `scroll-right-dyn ${visionAnimDuration}s linear infinite`,
                        }}
                      >
                        {Array.from({ length: visionRepeat }).flatMap((_, r) =>
                          visionVaultProjects.map((project, index) => (
                            <Card
                              key={r + '-' + index}
                              className="relative overflow-hidden bg-transparent backdrop-blur-xl border-purple-200/50 hover:shadow-lg transition-all duration-300 hover:scale-105 flex-shrink-0 w-80 inline-block cursor-pointer mx-1"
                              onClick={() => { setModalProject(project); setModalOpen(true); }}
                            >
                              {/* Video Background */}
                              <video
                                className="absolute inset-0 w-full h-full object-cover z-0"
                                src={project.video}
                                autoPlay
                                loop
                                muted
                                playsInline
                                style={{ opacity: 0.5 }}
                              />
                              {/* Overlay for extra clarity */}
                              <div className="absolute inset-0 bg-white/30 z-10" />
                              {/* Card Content */}
                              <div className="relative z-20 h-full flex flex-col">
                                <CardHeader>
                                  <CardTitle className="text-lg">{project.title}</CardTitle>
                                  <CardDescription>{project.description}</CardDescription>
                                </CardHeader>
                                <CardContent className="flex flex-col flex-1">
                                  <div className="flex flex-wrap gap-2 mb-4">
                                    {project.tech.map((tech) => (
                                      <Badge key={tech} variant="outline" className="text-xs bg-purple-100/50">
                                        {tech}
                                      </Badge>
                                    ))}
                                  </div>
                                  <div className="flex-1" />
                                  <div className="flex gap-2 mt-2">
                                    <a href="https://github.com/Suyashh-s" target="_blank" rel="noopener noreferrer">
                                      <Button size="sm" variant="outline" className="flex-1">
                                        <Github className="w-4 h-4 mr-2" />
                                        Code
                                      </Button>
                                    </a>
                                    <Button size="sm" className="flex-1 bg-purple-500 text-white hover:bg-purple-600">
                                      <ExternalLink className="w-4 h-4 mr-2" />
                                      View
                                    </Button>
                                  </div>
                                </CardContent>
                              </div>
                            </Card>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                </section>

                {/* Skills Section */}
                <section id="skills" className="px-6">
                  <div className="flex items-center gap-3 mb-8">
                    <Code className="w-6 h-6 text-green-600" />
                    <h2 className="text-3xl font-bold text-gray-900">Skills</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                    {Object.entries(skills).map(([category, skillList]) => (
                      <Card key={category} className="bg-white/60 backdrop-blur-xl border-gray-200/50 shadow-xl hover:shadow-2xl transition-shadow">
                        <CardHeader>
                          <CardTitle className="text-xl">{category}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex flex-wrap gap-2">
                            {skillList.map((skill) => (
                              <Badge key={skill} variant="outline" className="bg-white/50">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </section>

                {/* Achievements Section */}
                <section id="achievements" className="px-6">
                  <div className="flex items-center gap-3 mb-8">
                    <Award className="w-6 h-6 text-yellow-600" />
                    <h2 className="text-3xl font-bold text-gray-900">Achievements</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                    {achievements.map((achievement, index) => (
                      <Card key={index} className="bg-white/60 backdrop-blur-xl border-gray-200/50 shadow-xl hover:shadow-2xl transition-shadow">
                        <CardHeader>
                          <CardTitle className="text-lg">{achievement.title}</CardTitle>
                          <CardDescription>
                            {achievement.issuer} • {achievement.date}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-gray-600">{achievement.description}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </section>

                {/* Contact Section */}
                <section id="contact" className="px-6 pb-32">
                  <div className="flex items-center gap-3 mb-8">
                    <Mail className="w-6 h-6 text-purple-600" />
                    <h2 className="text-3xl font-bold text-gray-900">Contact</h2>
                  </div>
                  <Card className="bg-white/60 backdrop-blur-xl border-gray-200/50 max-w-2xl mx-auto shadow-xl hover:shadow-2xl transition-shadow">
                    <CardContent className="p-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div className="flex items-center gap-3">
                            <Mail className="w-5 h-5 text-gray-600" />
                            <span className="text-gray-800">suyashsawant9114@gmail.com</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <Phone className="w-5 h-5 text-gray-600" />
                            <span className="text-gray-800">+91 9321503773</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <MapPin className="w-5 h-5 text-gray-600" />
                            <span className="text-gray-800">Mumbai, India</span>
                          </div>
                        </div>
                        <div className="space-y-3 flex flex-col">
                          <a href="https://mail.google.com/mail/?view=cm&fs=1&to=suyashsawant9114@gmail.com" target="_blank" rel="noopener noreferrer" className="w-full">
                            <Button className="w-full flex items-center justify-center gap-2 border-purple-600 text-purple-700 hover:bg-purple-600 hover:text-white transition-colors" variant="outline">
                              <Mail className="w-4 h-4" />
                              Send Email
                            </Button>
                          </a>
                          <a href="https://github.com/Suyashh-s" target="_blank" rel="noopener noreferrer" className="w-full">
                            <Button className="w-full flex items-center justify-center gap-2 border-gray-800 text-gray-800 hover:bg-gray-800 hover:text-white transition-colors" variant="outline">
                              <Github className="w-4 h-4" />
                              GitHub Profile
                            </Button>
                          </a>
                          <a href="https://www.linkedin.com/in/suyashhh-s/" target="_blank" rel="noopener noreferrer" className="w-full">
                            <Button className="w-full flex items-center justify-center gap-2 border-[#0A66C2] text-[#0A66C2] hover:bg-[#0A66C2] hover:text-white transition-colors" variant="outline">
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-9h3v9zm-1.5-10.28c-.97 0-1.75-.79-1.75-1.75s.78-1.75 1.75-1.75 1.75.79 1.75 1.75-.78 1.75-1.75 1.75zm13.5 10.28h-3v-4.5c0-1.08-.02-2.47-1.5-2.47-1.5 0-1.73 1.17-1.73 2.39v4.58h-3v-9h2.89v1.23h.04c.4-.75 1.38-1.54 2.84-1.54 3.04 0 3.6 2 3.6 4.59v4.72z"/></svg>
                              LinkedIn Profile
                            </Button>
                          </a>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </section>
              </div>

              {/* Bottom Navigation */}
              <div className="fixed bottom-20 left-0 right-0 p-4 md:p-6 z-20">
                <div className="max-w-2xl mx-auto">
                  <div className="grid grid-cols-5 gap-2 md:gap-3">
                    {navSections.map((section, index) => {
                      const IconComponent = section.icon;
                      return (
                        <Button
                          key={section.name}
                          variant="ghost"
                          className={`flex flex-col items-center gap-1 md:gap-2 p-3 md:p-4 h-16 md:h-20 rounded-2xl backdrop-blur-xl shadow-lg border-0 transition-all duration-300 hover:scale-105 ${section.color} bg-white/20 hover:bg-white/30`}
                          style={{ animationDelay: `${index * 100}ms` }}
                          onClick={section.action}
                        >
                          <IconComponent className="w-4 h-4 md:w-5 md:h-5 text-gray-700" />
                          <span className="text-xs font-medium text-gray-700 truncate max-w-[60px] block">
                            {section.name}
                          </span>
                        </Button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Fixed Chat Input at Bottom */}
              <div className="fixed bottom-0 left-0 right-0 p-4 md:p-6 z-20">
                <div className="max-w-md mx-auto">
                  <form onSubmit={handleChatSubmit} className="flex gap-2 md:gap-3 items-center">
                    <div className="flex-1 relative">
                      <Input
                        value={chatMessage}
                        onChange={(e) => setChatMessage(e.target.value)}
                        onClick={handleInputClick}
                        placeholder="Ask me anything..."
                        className="w-full h-12 md:h-14 pl-4 md:pl-6 pr-4 rounded-full border-0 bg-white/60 backdrop-blur-xl shadow-lg placeholder:text-gray-500 text-gray-800 focus:ring-2 focus:ring-blue-400/50 cursor-pointer"
                        readOnly
                      />
                    </div>
                    <Button
                      type="submit"
                      className="h-12 w-12 md:h-14 md:w-14 rounded-full bg-blue-500 hover:bg-blue-600 flex items-center justify-center p-0 shadow-lg"
                    >
                      <Send className="w-5 h-5 text-white" />
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Project Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        {modalProject && (
          <DialogContent className="max-w-2xl w-full p-6">
            <div className="w-full aspect-video mb-4">
              <video
                className="w-full h-full object-contain rounded-lg"
                src={modalProject.video}
                controls
                autoPlay
              />
            </div>
            <h2 className="text-2xl font-bold mb-2">{modalProject.title}</h2>
            <p className="mb-4 text-gray-700">{modalProject.description}</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {modalProject.tech.map((tech: string) => (
                <Badge key={tech} variant="secondary" className="text-xs">
                  {tech}
                </Badge>
              ))}
            </div>
            <div className="flex gap-4">
              <a href="https://github.com/Suyashh-s" target="_blank" rel="noopener noreferrer">
                <Button className="w-full" variant="outline">
                  <Github className="w-4 h-4 mr-2" />
                  GitHub
                </Button>
              </a>
              <a href={modalProject.video} download className="flex-1">
                <Button className="w-full" variant="outline">
                  Download
                </Button>
              </a>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </>
  );
};

export default Index;

