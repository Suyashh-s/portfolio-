
import { useState } from "react";
import { MessageCircle, X, Send, MapPin, Calendar, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

const Index = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState("");

  const tags = [
    "AI", "Developer", "Gamification", "SaaS Builder", "Tech Enthusiast", 
    "Full-Stack", "Restaurant Tech", "AR Experiences"
  ];

  const navSections = [
    { name: "Me", emoji: "👋", color: "bg-blue-100 hover:bg-blue-200 text-blue-800" },
    { name: "Projects", emoji: "🚀", color: "bg-purple-100 hover:bg-purple-200 text-purple-800" },
    { name: "Skills", emoji: "⚡", color: "bg-yellow-100 hover:bg-yellow-200 text-yellow-800" },
    { name: "Fun", emoji: "🎮", color: "bg-green-100 hover:bg-green-200 text-green-800" },
    { name: "Contact", emoji: "💬", color: "bg-pink-100 hover:bg-pink-200 text-pink-800" }
  ];

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (chatMessage.trim()) {
      console.log("Chat message:", chatMessage);
      setChatMessage("");
      // Here you could integrate with a chatbot or send to an API
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Hero Section */}
      <div className="container mx-auto px-6 py-12">
        <div className="flex flex-col lg:flex-row items-center gap-12 max-w-6xl mx-auto">
          {/* Profile Photo */}
          <div className="flex-shrink-0 animate-fade-in">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=400&h=400&fit=crop&crop=face"
                alt="Suyash Sawant"
                className="w-72 h-72 lg:w-80 lg:h-80 rounded-3xl object-cover shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105"
              />
              <div className="absolute -bottom-4 -right-4 bg-white rounded-full p-3 shadow-lg">
                <Sparkles className="w-8 h-8 text-yellow-500" />
              </div>
            </div>
          </div>

          {/* Intro Content */}
          <div className="flex-1 text-center lg:text-left animate-fade-in">
            <div className="mb-6">
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
                Suyash Sawant
              </h1>
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 text-gray-600 text-lg mb-6">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  <span>24 years old</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  <span>Mumbai, India</span>
                </div>
              </div>
              <p className="text-2xl text-gray-700 leading-relaxed mb-8">
                Hey 👋 I'm Suyash! I'm a developer passionate about AI, gamification, 
                and creating fun digital experiences for restaurants.
              </p>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-3 justify-center lg:justify-start mb-8">
              {tags.map((tag, index) => (
                <span
                  key={tag}
                  className="px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 text-gray-700 rounded-full text-sm font-medium hover:scale-105 transition-transform duration-200 cursor-default"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Bio */}
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <p className="text-gray-700 leading-relaxed text-lg">
                  I'm a full-stack developer with a love for creating engaging, gamified digital experiences. 
                  Currently working on restaurant tech with AR and playful menus. I believe tech should be 
                  fun, human, and memorable! ✨
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Navigation Section */}
        <div className="mt-20 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Explore My World 🌟
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {navSections.map((section, index) => (
              <Button
                key={section.name}
                variant="ghost"
                className={`${section.color} h-24 rounded-2xl border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex flex-col gap-2 text-lg font-semibold animate-fade-in`}
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <span className="text-2xl">{section.emoji}</span>
                {section.name}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Floating Chat Button */}
      <div className="fixed bottom-6 right-6 z-50">
        {!isChatOpen && (
          <Button
            onClick={() => setIsChatOpen(true)}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-full h-16 w-16 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
          >
            <MessageCircle className="w-6 h-6" />
          </Button>
        )}

        {/* Chat Window */}
        {isChatOpen && (
          <Card className="absolute bottom-0 right-0 w-80 h-96 bg-white shadow-2xl rounded-2xl border-0 animate-scale-in">
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-2xl">
              <h3 className="font-semibold">Ask me anything! 💬</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsChatOpen(false)}
                className="text-white hover:bg-white/20 h-8 w-8 p-0 rounded-full"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="p-4 h-64 overflow-y-auto">
              <div className="bg-gray-100 rounded-2xl p-3 mb-4 max-w-xs">
                <p className="text-sm text-gray-700">
                  Hi there! 👋 Feel free to ask me anything about my projects, skills, or just say hello!
                </p>
              </div>
            </div>
            
            <form onSubmit={handleChatSubmit} className="p-4 border-t">
              <div className="flex gap-2">
                <Input
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 rounded-full border-gray-200 focus:border-blue-500"
                />
                <Button
                  type="submit"
                  size="sm"
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-full h-10 w-10 p-0"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </form>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Index;
