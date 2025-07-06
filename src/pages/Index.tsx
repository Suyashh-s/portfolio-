
import { useState } from "react";
import { Send, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Index = () => {
  const [chatMessage, setChatMessage] = useState("");

  const navSections = [
    { name: "Me", emoji: "👤", color: "text-blue-600" },
    { name: "Projects", emoji: "📁", color: "text-green-600" },
    { name: "Skills", emoji: "📚", color: "text-purple-600" },
    { name: "Fun", emoji: "🎨", color: "text-pink-600" },
    { name: "Contact", emoji: "📞", color: "text-orange-600" }
  ];

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (chatMessage.trim()) {
      console.log("Chat message:", chatMessage);
      setChatMessage("");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col">
      {/* Header with Logo */}
      <div className="flex justify-center pt-8 pb-4">
        <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
      </div>

      {/* Main Content Container */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-32">
        
        {/* Greeting */}
        <div className="text-center mb-6">
          <p className="text-lg text-gray-600 mb-2">Hey, I'm Suyash 👋</p>
          <h1 className="text-4xl md:text-5xl font-bold text-black mb-4">
            AI portfolio
          </h1>
        </div>

        {/* Avatar */}
        <div className="mb-8">
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=200&h=200&fit=crop&crop=face"
              alt="Suyash Sawant"
              className="w-40 h-40 rounded-full object-cover shadow-lg mx-auto"
            />
            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-r from-pink-200 to-blue-200 rounded-full flex items-center justify-center">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Bio */}
        <div className="text-center mb-12 max-w-md">
          <p className="text-gray-600 leading-relaxed">
            I'm a full-stack developer passionate about AI, gamification, and creating engaging digital experiences for restaurants. I believe tech should be fun and memorable! ✨
          </p>
        </div>

        {/* Navigation Buttons */}
        <div className="grid grid-cols-5 gap-4 w-full max-w-lg mb-8">
          {navSections.map((section, index) => (
            <Button
              key={section.name}
              variant="ghost"
              className="flex flex-col items-center gap-2 p-4 h-20 bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <span className="text-xl">{section.emoji}</span>
              <span className={`text-xs font-medium ${section.color}`}>
                {section.name}
              </span>
            </Button>
          ))}
        </div>
      </div>

      {/* Bottom Chat Input */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4">
        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleChatSubmit} className="flex gap-3 items-center">
            <div className="flex-1 relative">
              <Input
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                placeholder="Ask me anything..."
                className="w-full h-12 pl-4 pr-12 rounded-full border-gray-200 focus:border-blue-400 focus:ring-1 focus:ring-blue-400 bg-gray-50"
              />
            </div>
            <Button
              type="submit"
              className="h-12 w-12 rounded-full bg-blue-500 hover:bg-blue-600 flex items-center justify-center p-0"
            >
              <Send className="w-5 h-5 text-white" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Index;
