import { useState, useRef, useEffect } from "react";
import {
  Send,
  ArrowLeft,
  User,
  Bot,
  FolderOpen,
  BookOpen,
  Palette,
  Award,
  Phone,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { marked } from "marked";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  images?: string[];
}

function isMobileDevice() {
  if (typeof navigator === 'undefined') return false;
  return /Mobi|Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(navigator.userAgent);
}

const RESUME_URL = "https://pub-c31ada0ae90b4637b66c95c2e1fef0f6.r2.dev/resume.pdf";

function ResumeModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    setIsMobile(isMobileDevice());
  }, []);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full relative">
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-xl font-bold"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
        <h2 className="text-lg font-semibold mb-4 text-gray-900">Resume PDF</h2>
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

const Chatbot = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hi! I'm Suyash. Ask me anything about my skills, projects,experience or even my fun activites!",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const formRef = useRef<HTMLFormElement>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [showResumeModal, setShowResumeModal] = useState(false);

  const navSections = [
    { name: "Resume", icon: FileText, color: "bg-blue-400/30 text-blue-800", action: () => setShowResumeModal(true) },
    { name: "Projects", icon: FolderOpen, color: "bg-purple-400/30", action: () => navigate("/portfolio#projects") },
    { name: "Skills", icon: BookOpen, color: "bg-blue-400/30", action: () => navigate("/portfolio#skills") },
    { name: "Achievements", icon: Award, color: "bg-pink-400/30", action: () => navigate("/portfolio#achievements") },
    { name: "Contact", icon: Phone, color: "bg-yellow-400/30", action: () => navigate("/portfolio#contact") },
  ];

  const suggestions = [
    "What achievement defines your journey so far?",
    "What are your technical skills?",
    "Tell me about your professional background",
  "What projects did you work on while freelancing?",
  "What are your goals?",
    "What achievement defines your journey so far?",
  "Which project are you most proud of?",
  "How have hackathons shaped your skills?",
  "What motivates you to keep learning?",
  "Which challenges pushed you the most?",
  "How do you handle high-pressure situations?",
  "What impact do you hope to create?",
  "What makes you stand out as a developer?",
  "How do you stay updated with new tech?",
   "Can you share some experiences that have shaped your growth as a developer?",
  "What projects or challenges are you most proud of solving?",
  "Have there been any moments in your journey that truly validated your skills?",
  "How have competitions or collaborative events influenced your career?",
  "Which accomplishments do you feel best represent your capabilities?",
  "What motivates you to keep pushing your technical and creative boundaries?",
  "How do you approach high-pressure or competitive environments?",
  "What achievements have had the most impact on your career trajectory?",
  "What key values guide you when working on challenging projects?",
  "How do you ensure continuous learning and stay updated with new technologies?",
  "What impact do you hope your work will have on users or society?",
  "Can you describe a time when you overcame a major technical or team obstacle?",
  "What aspects of your work give you the most fulfillment or satisfaction?",
  "How do you balance innovation and practicality in your projects?",
  "What are your long-term aspirations as a technologist and creator?",
  "How do you evaluate the success of a project beyond technical delivery?",
  "Which technical or personal strengths have helped you stand out?",
  "What role do teamwork and mentorship play in your growth?",
  "What motivates you to participate in hackathons and competitions?",
  "How do you leverage your achievements to inspire or mentor others?",
   "What values guide your work?",
  "Which skills helped you win competitions?",
  "How do you measure project success?",
  "What drives your passion for tech?",
  "How do you balance creativity and practicality?",
  "Which milestones are you most proud of?",
  "How do you approach complex problems?",
  "What inspires you to innovate?",
  "What strengths set you apart in teams?",
  "How do you turn failures into growth?",
  "What do you want to achieve next?"
  ];
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);

  const filteredSuggestions = inputMessage.trim() === ""
    ? suggestions
    : suggestions.filter(s => s.toLowerCase().includes(inputMessage.toLowerCase()));

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Auto-submit question from Index nav
  useEffect(() => {
    const autoQuestion = sessionStorage.getItem("autoQuestion");
    if (autoQuestion) {
      setInputMessage(autoQuestion);
      setShowPopup(true);
      setTimeout(() => {
        formRef.current?.requestSubmit();
        sessionStorage.removeItem("autoQuestion");
        setTimeout(() => setShowPopup(false), 6000);
      }, 100);
    }
  }, []);

  const handleNavButtonClick = (sectionName: string) => {
    setInputMessage(`Tell me about ${sectionName}`);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    setShowSuggestions(false); // Hide suggestions after sending

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    try {
      const API_URL = import.meta.env.VITE_API_URL || "https://portfolio-d4fz.onrender.com/api/query";
      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: userMessage.text }),
      });

      const data = await res.json();

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.answer || "Sorry, I couldn't generate a response.",
        isUser: false,
        timestamp: new Date(),
        images: data.images || [],
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error:", error);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Oops! Something went wrong. Please try again.",
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputMessage(suggestion);
    setShowSuggestions(false);
    setInputFocused(false);
    setTimeout(() => {
      formRef.current?.requestSubmit();
    }, 0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex flex-col">
      {/* Popup notification */}
      {showPopup && (
        <div className="fixed top-6 left-6 z-[9999] bg-blue-600/80 backdrop-blur-xl text-white px-6 py-3 rounded-xl shadow-lg text-sm font-medium animate-fade-in">
          If you don't believe my assistant, you can click the buttons below to see my projects, skills, and achievements
        </div>
      )}
      {/* Header */}
      <div className="flex items-center gap-3 p-3 bg-white/80 backdrop-blur-xl border-b border-gray-200/50 min-h-[48px]">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/")}
          className="rounded-full hover:bg-gray-100"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
            <Bot className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="font-semibold text-gray-900">Suyash</h1>
            <p className="text-sm text-gray-500">Ask me anything!</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 pb-40">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`flex flex-col items-start gap-2 max-w-xs sm:max-w-md ${
                message.isUser ? "items-end" : "items-start"
              }`}
            >
              <div
                className={`flex items-start gap-3 ${
                  message.isUser ? "flex-row-reverse" : "flex-row"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    message.isUser
                      ? "bg-blue-500"
                      : "bg-gradient-to-br from-orange-200 via-pink-200 to-purple-200"
                  }`}
                >
                  {message.isUser ? (
                    <User className="w-4 h-4 text-white" />
                  ) : (
                    <div className="text-sm">🤖</div>
                  )}
                </div>
                <div
                  className={`rounded-2xl px-4 py-3 ${
                    message.isUser
                      ? "bg-blue-500 text-white"
                      : "bg-white/80 backdrop-blur-xl text-gray-800 shadow-sm"
                  }`}
                >
                  {message.isUser ? (
                    <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                  ) : (
                    <div
                      className="text-sm whitespace-pre-wrap"
                      dangerouslySetInnerHTML={{
                        __html: marked.parse(message.text),
                      }}
                    ></div>
                  )}
                </div>
              </div>

              {message.images && message.images.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {message.images.map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt={`Image ${idx + 1}`}
                      className="w-32 h-20 object-cover rounded-lg border"
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="flex items-start gap-3 max-w-xs sm:max-w-md">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-200 via-pink-200 to-purple-200 flex items-center justify-center">
                <div className="text-sm">🤖</div>
              </div>
              <div className="bg-white/80 backdrop-blur-xl text-gray-800 shadow-sm rounded-2xl px-4 py-3">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Floating Nav Buttons */}
      <div className="fixed bottom-24 left-1/2 transform -translate-x-1/2 z-10">
        <div className="flex gap-4 px-4">
          {navSections.map((section, index) => {
            const IconComponent = section.icon;
            return (
              <Button
                key={section.name}
                variant="ghost"
                onClick={section.action}
                className={`flex flex-col items-center gap-1 w-16 h-16 rounded-2xl backdrop-blur-xl shadow-lg border-0 transition-all duration-300 hover:scale-110 hover:-translate-y-1 ${section.color} bg-white/50 hover:bg-white/70 p-2 animate-float`}
                style={{
                  animationDelay: `${index * 200}ms`,
                  animationDuration: `${3 + index * 0.5}s`,
                }}
              >
                <IconComponent className="w-5 h-5 text-gray-700" />
                <span className="text-xs font-medium text-gray-700 truncate max-w-[60px] block">
                  {section.name}
                </span>
              </Button>
            );
          })}
        </div>
      </div>

      {/* Input & Suggestions */}
      <div className="fixed bottom-0 left-0 w-full bg-white/80 backdrop-blur-xl border-t border-gray-200/50 z-[99999] p-6 flex justify-center">
        <form
          ref={formRef}
          onSubmit={handleSendMessage}
          className="flex gap-3 items-center w-full max-w-4xl"
        >
          <div className="flex-1 relative z-[99999]">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask me anything..."
              className="w-full h-12 pl-4 pr-4 rounded-full border-gray-200 bg-white focus:ring-2 focus:ring-blue-400/50"
              disabled={isTyping}
              onFocus={() => { setShowSuggestions(true); setInputFocused(true); }}
              onBlur={() => { setTimeout(() => { setShowSuggestions(false); setInputFocused(false); }, 150); }}
            />
            {inputFocused && showSuggestions && filteredSuggestions.length > 0 && (
              <div className="absolute left-0 right-0 bottom-full mb-2 bg-white border border-gray-200 rounded-xl shadow-lg z-[99999] max-h-72 overflow-y-auto animate-fade-in">
                {filteredSuggestions.map((suggestion, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className="w-full text-left px-4 py-3 hover:bg-blue-50 text-gray-700 text-sm focus:outline-none"
                    onMouseDown={() => handleSuggestionClick(suggestion)}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
          </div>
          <Button
            type="submit"
            disabled={!inputMessage.trim() || isTyping}
            className="h-12 w-12 rounded-full bg-blue-500 hover:bg-blue-600 flex items-center justify-center p-0 shadow-lg"
          >
            <Send className="w-5 h-5 text-white" />
          </Button>
        </form>
      </div>
      <ResumeModal open={showResumeModal} onClose={() => setShowResumeModal(false)} />
    </div>
  );
};

export default Chatbot;
