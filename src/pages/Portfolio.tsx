import { useState, useEffect, useRef } from "react";
import { ArrowLeft, Github, ExternalLink, Mail, Phone, MapPin, Award, Code, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent } from "@/components/ui/dialog";

const Portfolio = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const navigate = useNavigate();
  const [projectsRepeat, setProjectsRepeat] = useState(2);
  const [visionRepeat, setVisionRepeat] = useState(2);
  const [projectsAnimDuration, setProjectsAnimDuration] = useState(30);
  const [visionAnimDuration, setVisionAnimDuration] = useState(30);
  const projectsContainerRef = useRef<HTMLDivElement>(null);
  const projectsContentRef = useRef<HTMLDivElement>(null);
  const visionContainerRef = useRef<HTMLDivElement>(null);
  const visionContentRef = useRef<HTMLDivElement>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalProject, setModalProject] = useState(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY + window.scrollY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

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
        // Animation duration proportional to content width
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
  }, [projects.length, visionVaultProjects.length]);

  // Scroll to section if hash is present in URL
  useEffect(() => {
    if (window.location.hash) {
      const id = window.location.hash.replace('#', '');
      const el = document.getElementById(id);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100); // slight delay to ensure layout is ready
      }
    }
  }, []);

  const skills = {
    
      "Frontend": ["React", "TypeScript", "Next.js", "Tailwind CSS", "Redux", "HTML", "CSS", "Bootstrap"],
      "Backend": ["Node.js", "Express.js", "MongoDB", "MySQL", "REST APIs", "Java", "AWS", "MongoDB Atlas", "Solidity"],
      "Tools & AI/ML": ["Python", "TensorFlow", "PyTorch", "computer vision", "Git", "GitHub", "Docker", "Postman", "AWS", "Figma", "Canva", "Adobe Photoshop", "Blender"],
      "Mobile Development": ["React Native", "Flutter"]
    }
    

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
      title: "LenDenClub’s AI Hackathon — Finalist",
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
      description: "Ranked among the top 30 teams at Manipal University Jaipur’s flagship hackathon, recognized for crafting smart tech-based solutions under pressure."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 relative overflow-hidden">
      {/* Animated color blobs - move to cover the whole page */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
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
      </div>
      {/* Header */}
      <div className="flex items-center gap-4 p-6 relative z-10">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/chat")}
          className="rounded-full hover:bg-white/50"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-2xl font-bold text-gray-900"></h1>
      </div>

      <div className="relative z-10 px-6 pb-6 space-y-12">
        {/* Projects Section */}
        <section id="projects">
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
                    {/* Overlay for extra clarity (optional) */}
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
                        <div className="flex-1" /> {/* Spacer to push buttons to bottom */}
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
          {/* Vision Vault Subsection - Dynamic Seamless Marquee */}
          <div className="mb-8" >
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
                      {/* Overlay for extra clarity (optional) */}
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
                          <div className="flex-1" /> {/* Spacer to push buttons to bottom */}
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
        <section id="skills">
          <div className="flex items-center gap-3 mb-8">
            <Code className="w-6 h-6 text-green-600" />
            <h2 className="text-3xl font-bold text-gray-900">Skills</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
        <section id="achievements">
          <div className="flex items-center gap-3 mb-8">
            <Award className="w-6 h-6 text-yellow-600" />
            <h2 className="text-3xl font-bold text-gray-900">Achievements</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
        <section id="contact">
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
                    <Button className="w-full flex items-center justify-center gap-2 border-purple-600 text-purple-700 hover:bg-purple-600 hover:text-white transition-colors" variant="outline" aria-label="Send Email">
                      <Mail className="w-4 h-4" />
                      Send Email
                    </Button>
                  </a>
                  <a href="https://github.com/Suyashh-s" target="_blank" rel="noopener noreferrer" className="w-full">
                    <Button className="w-full flex items-center justify-center gap-2 border-gray-800 text-gray-800 hover:bg-gray-800 hover:text-white transition-colors" variant="outline" aria-label="GitHub Profile">
                      <Github className="w-4 h-4" />
                      GitHub Profile
                    </Button>
                  </a>
                  <a href="https://www.linkedin.com/in/suyashhh-s/" target="_blank" rel="noopener noreferrer" className="w-full">
                    <Button className="w-full flex items-center justify-center gap-2 border-[#0A66C2] text-[#0A66C2] hover:bg-[#0A66C2] hover:text-white transition-colors" variant="outline" aria-label="LinkedIn Profile">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 mr-2"><path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-9h3v9zm-1.5-10.28c-.97 0-1.75-.79-1.75-1.75s.78-1.75 1.75-1.75 1.75.79 1.75 1.75-.78 1.75-1.75 1.75zm13.5 10.28h-3v-4.5c0-1.08-.02-2.47-1.5-2.47-1.5 0-1.73 1.17-1.73 2.39v4.58h-3v-9h2.89v1.23h.04c.4-.75 1.38-1.54 2.84-1.54 3.04 0 3.6 2 3.6 4.59v4.72z"/></svg>
                      LinkedIn Profile
                    </Button>
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
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
              {modalProject.tech.map((tech) => (
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
    </div>
  );
};

export default Portfolio;