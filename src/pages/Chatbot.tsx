
import { useState, useRef, useEffect } from "react";
import { Send, ArrowLeft, User, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const Chatbot = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hi! I'm Suyash's AI assistant. Ask me anything about his skills, projects, or experience!",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Thanks for your message! I'm still learning about Suyash's work. Feel free to ask me about his AI projects, gamification expertise, or full-stack development experience.",
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-4 p-6 bg-white/80 backdrop-blur-xl border-b border-gray-200/50">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/")}
          className="rounded-full hover:bg-gray-100"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-semibold text-gray-900">Suyash's AI Assistant</h1>
            <p className="text-sm text-gray-500">Ask me anything!</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`flex items-start gap-3 max-w-xs sm:max-w-md ${
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
                <p className="text-sm">{message.text}</p>
              </div>
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
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-6 bg-white/80 backdrop-blur-xl border-t border-gray-200/50">
        <form onSubmit={handleSendMessage} className="flex gap-3 items-center max-w-4xl mx-auto">
          <div className="flex-1 relative">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type your message..."
              className="w-full h-12 pl-4 pr-4 rounded-full border-gray-200 bg-white focus:ring-2 focus:ring-blue-400/50"
              disabled={isTyping}
            />
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
    </div>
  );
};

export default Chatbot;
