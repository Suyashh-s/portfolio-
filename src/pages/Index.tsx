
import { useState, useEffect } from "react";
import { Send, User, FolderOpen, BookOpen, Palette, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Index = () => {
  const [chatMessage, setChatMessage] = useState("");
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const navSections = [
    { name: "Me", icon: User, color: "bg-emerald-400/30" },
    { name: "Projects", icon: FolderOpen, color: "bg-purple-400/30" },
    { name: "Skills", icon: BookOpen, color: "bg-blue-400/30" },
    { name: "Fun", icon: Palette, color: "bg-pink-400/30" },
    { name: "Contact", icon: Phone, color: "bg-yellow-400/30" }
  ];

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (chatMessage.trim()) {
      console.log("Chat message:", chatMessage);
      setChatMessage("");
    }
  };

  return (
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

      {/* Header with Logo */}
      <div className="flex justify-center pt-12 pb-6 relative z-10">
        <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center shadow-lg">
          <div className="w-6 h-6 bg-white transform rotate-45 rounded-sm"></div>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-40 relative z-10">
        
        {/* Greeting */}
        <div className="text-center mb-8">
          <p className="text-lg text-gray-600 mb-3">Hey, I'm Suyash 👋</p>
          <h1 className="text-5xl md:text-6xl font-bold text-black mb-6">
            AI portfolio
          </h1>
        </div>

        {/* Avatar */}
        <div className="mb-12">
          <div className="relative">
            <div className="w-48 h-48 rounded-full bg-gradient-to-br from-orange-200 via-pink-200 to-purple-200 flex items-center justify-center shadow-2xl">
              <div className="text-8xl">👨‍💻</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-20 left-0 right-0 p-6 z-20">
        <div className="max-w-2xl mx-auto">
          <div className="grid grid-cols-5 gap-3">
            {navSections.map((section, index) => {
              const IconComponent = section.icon;
              return (
                <Button
                  key={section.name}
                  variant="ghost"
                  className={`flex flex-col items-center gap-2 p-4 h-20 rounded-2xl backdrop-blur-xl shadow-lg border-0 transition-all duration-300 hover:scale-105 ${section.color} bg-white/20 hover:bg-white/30`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <IconComponent className="w-5 h-5 text-gray-700" />
                  <span className="text-xs font-medium text-gray-700">
                    {section.name}
                  </span>
                </Button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Fixed Chat Input at Bottom */}
      <div className="fixed bottom-0 left-0 right-0 p-6 z-20">
        <div className="max-w-md mx-auto">
          <form onSubmit={handleChatSubmit} className="flex gap-3 items-center">
            <div className="flex-1 relative">
              <Input
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                placeholder="Ask me anything..."
                className="w-full h-14 pl-6 pr-4 rounded-full border-0 bg-white/60 backdrop-blur-xl shadow-lg placeholder:text-gray-500 text-gray-800 focus:ring-2 focus:ring-blue-400/50"
              />
            </div>
            <Button
              type="submit"
              className="h-14 w-14 rounded-full bg-blue-500 hover:bg-blue-600 flex items-center justify-center p-0 shadow-lg"
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
