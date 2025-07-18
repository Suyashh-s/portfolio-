import React, { useState, useEffect } from "react";
import { Send, User, FolderOpen, BookOpen, Palette, Phone, Award, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

// Typing effect hook
function useTypingEffect(text, speed = 80, delay = 0) {
  const [displayed, setDisplayed] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  // Grapheme splitter
  function getGraphemes(str) {
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
    // eslint-disable-next-line
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

const Index = () => {
  const [chatMessage, setChatMessage] = useState("");
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const navigate = useNavigate();
  const [showPreloader, setShowPreloader] = useState(true);
  const [startTyping, setStartTyping] = useState(false);
  const [showResumeModal, setShowResumeModal] = useState(false);

  useEffect(() => {
    if (!showPreloader) {
      setStartTyping(true);
    }
  }, [showPreloader]);

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
    { name: "Contact", icon: Phone, color: "bg-yellow-400/30", action: () => { sessionStorage.setItem("autoQuestion", "how to connect with you"); navigate("/chat"); } }
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
              <div className="flex-1 flex flex-col items-center justify-center px-6 pb-40 relative z-10">
                {/* About Me Section */}
                <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-6 md:p-8 shadow-lg border border-gray-200/50 max-w-4xl mx-auto mb-8 mt-12">
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
                          I’m Suyash Sawant
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
                          I’m Suyash Sawant
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
                            I’m driven to create technology that feels personal, purposeful, and truly meaningful.
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
                <div className="block md:hidden space-y-3 text-sm text-gray-700 leading-relaxed mt-4">
                  <p>
                    Software Engineer and Full Stack Developer experienced in JavaScript, TypeScript, React, Next.js, Node.js (Express), Python, Flutter, and AI/ML technologies like TensorFlow and PyTorch. Currently pursuing a B.E. in Information Technology at Datta Meghe College of Engineering.
                  </p>
                  <p>
                    Winner of <span className="font-bold">Smart India Hackathon 2024</span> and a finalist in multiple national hackathons, including InspirioBiz 5.0 and Airavat 2.0. I specialize in building scalable web applications, cross-platform mobile apps, and intelligent AI-powered solutions that address real-world challenges.
                  </p>
                  <p className="font-medium text-gray-800">
                    I’m driven to create technology that feels personal, purposeful, and truly meaningful.
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
    </>
  );
};

export default Index;

