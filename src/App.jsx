/*
MCSS Ultra Website (v2) – FULL PROJECT BUILD
- React + TailwindCSS + framer-motion + lucide-react
- Includes: custom cursor, scroll progress, tilt cards, hover/tap team intros, marquee, CTA, full pages, footer

Install:
npm i
npm run dev

Note:
- Team placeholder images live in /public/team/*.svg
  Replace them anytime.
*/

import React, { useState, useEffect, useRef } from "react";
import {
  Monitor,
  Rocket,
  Smartphone,
  Bot,
  PenTool,
  Shield,
  CheckCircle,
  ExternalLink,
  ArrowRight,
  Mail,
  MessageSquare,
  MapPin,
  Menu,
  X,
  Code,
  Award,
  Users,
  ChevronUp,
  Globe,
  Database,
  Layers,
  Activity,
} from "lucide-react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useSpring,
  useInView,
  useTransform,
  useMotionValue,
  useReducedMotion,
} from "framer-motion";

// --- Animation Variants ---
const fadeInUp = {
  hidden: { opacity: 0, y: 60, filter: "blur(10px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

// --- Helper Components ---
const CustomCursor = () => {
  const reduceMotion = useReducedMotion();
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 25, stiffness: 150 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    if (reduceMotion) return;
    const moveCursor = (e) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };
    window.addEventListener("mousemove", moveCursor);
    return () => window.removeEventListener("mousemove", moveCursor);
  }, [cursorX, cursorY, reduceMotion]);

  if (reduceMotion) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 w-8 h-8 rounded-full border border-blue-500/50 pointer-events-none z-[9999] hidden lg:block"
      style={{
        x: cursorXSpring,
        y: cursorYSpring,
        translateX: "-50%",
        translateY: "-50%",
      }}
      aria-hidden
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-blue-400 rounded-full shadow-[0_0_10px_#3b82f6]" />
    </motion.div>
  );
};

const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-400 origin-left z-[100]"
      style={{ scaleX }}
      aria-hidden
    />
  );
};

const TiltCard = ({ children, className = "" }) => {
  const reduceMotion = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(y, [-100, 100], [10, -10]);
  const rotateY = useTransform(x, [-100, 100], [-10, 10]);

  function handleMouseMove(event) {
    if (reduceMotion) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set(event.clientX - centerX);
    y.set(event.clientY - centerY);
  }

  function handleMouseLeave() {
    if (reduceMotion) return;
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={reduceMotion ? undefined : { rotateX, rotateY, transformStyle: "preserve-3d" }}
      className={className}
    >
      <div style={reduceMotion ? undefined : { transform: "translateZ(50px)" }}>{children}</div>
    </motion.div>
  );
};

const AnimatedCounter = ({ value, duration = 2 }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;

    let start = 0;
    const end = parseInt(String(value).replace(/\D/g, ""), 10);
    if (Number.isNaN(end)) return;

    const totalMs = duration * 1000;
    const incrementTime = Math.max(totalMs / Math.max(end, 1), 10);

    const timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      }
    }, incrementTime);

    return () => clearInterval(timer);
  }, [isInView, value, duration]);

  return <span ref={ref}>{count}{String(value).replace(/[0-9]/g, "")}</span>;
};

const RevealSection = ({ children, className = "" }) => (
  <motion.div
    variants={fadeInUp}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: "-100px" }}
    className={className}
  >
    {children}
  </motion.div>
);

const SectionHeader = ({ subtitle, title, centered = true }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className={`mb-20 ${centered ? "text-center" : ""}`}
  >
    <div className="overflow-hidden inline-block">
      <motion.span
        initial={{ y: "100%" }}
        whileInView={{ y: 0 }}
        transition={{ duration: 0.6, ease: "circOut" }}
        className="text-blue-500 text-sm font-black uppercase block tracking-[0.4em] mb-4"
      >
        {subtitle}
      </motion.span>
    </div>
    <h2 className="text-4xl md:text-6xl font-black text-white leading-tight">
      {title}
    </h2>
    <motion.div
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      transition={{ duration: 1, delay: 0.5 }}
      className={`h-1.5 w-24 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 mt-8 rounded-full ${
        centered ? "mx-auto" : ""
      }`}
    />
  </motion.div>
);

// --- Main Components ---
const Navbar = ({ currentPage, setCurrentPage }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", id: "home" },
    { name: "About", id: "about" },
    { name: "Services", id: "services" },
    { name: "Team", id: "team" },
    { name: "Portfolio", id: "portfolio" },
    { name: "Process", id: "process" },
    { name: "Pricing", id: "pricing" },
    { name: "Contact", id: "contact" },
  ];

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-700 ${
        isScrolled
          ? "bg-slate-950/80 backdrop-blur-2xl border-b border-blue-500/10 py-3"
          : "bg-transparent py-8"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => setCurrentPage("home")}
        >
          <div className="relative w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-black text-xl shadow-[0_0_20px_rgba(59,130,246,0.3)] group-hover:rotate-12 transition-transform">
            <Layers size={24} className="group-hover:animate-pulse" />
          </div>
          <span className="text-2xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-slate-500">
            MCSS
          </span>
        </motion.div>

        <div className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => setCurrentPage(link.id)}
              className="relative text-xs font-black uppercase tracking-widest transition-colors group"
            >
              <span
                className={
                  currentPage === link.id
                    ? "text-blue-400"
                    : "text-slate-400 group-hover:text-white"
                }
              >
                {link.name}
              </span>
              {currentPage === link.id && (
                <motion.div
                  layoutId="navUnderline"
                  className="absolute -bottom-2 left-0 right-0 h-0.5 bg-blue-500 rounded-full"
                />
              )}
            </button>
          ))}
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(37,99,235,0.5)" }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setCurrentPage("contact")}
            className="px-8 py-3 rounded-full bg-blue-600 text-white text-[10px] font-black uppercase tracking-[0.2em] transition-all"
          >
            Start Project
          </motion.button>
        </div>

        <button
          className="md:hidden text-white"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 bg-slate-950/95 backdrop-blur-2xl z-40 flex flex-col items-center justify-center gap-10 md:hidden"
          >
            {navLinks.map((link, i) => (
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                key={link.id}
                onClick={() => {
                  setCurrentPage(link.id);
                  setMobileMenuOpen(false);
                }}
                className={`text-4xl font-black ${
                  currentPage === link.id ? "text-blue-500" : "text-slate-700"
                }`}
              >
                {link.name}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const ParticleBackground = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
    <div className="absolute top-0 left-0 w-full h-full bg-[#030712]" />

    <svg className="absolute w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
          <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#3b82f6" strokeWidth="0.5" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)" />
    </svg>

    <motion.div
      animate={{ scale: [1, 1.4, 1], x: [0, 100, 0], y: [0, -50, 0] }}
      transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
      className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-600/10 rounded-full blur-[160px]"
    />
    <motion.div
      animate={{ scale: [1, 1.3, 1], x: [0, -100, 0], y: [0, 50, 0] }}
      transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-purple-600/10 rounded-full blur-[160px]"
    />

    {[...Array(5)].map((_, i) => (
      <motion.div
        key={i}
        animate={{ x: ["100%", "-100%"] }}
        transition={{ duration: 8 + i * 2, repeat: Infinity, ease: "linear", delay: i }}
        className="absolute h-[1px] w-40 bg-gradient-to-r from-transparent via-blue-500 to-transparent"
        style={{ top: `${20 * i}%`, opacity: 0.2 }}
      />
    ))}
  </div>
);

const Hero = ({ onNavigate }) => {
  const words = ["Websites", "POS Systems", "Mobile Apps", "AI Automation"];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setIndex((p) => (p + 1) % words.length), 2800);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-32 pb-20 px-6 overflow-hidden">
      <ParticleBackground />
      <div className="max-w-7xl mx-auto text-center z-10">
        <motion.div
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="px-6 py-2 rounded-full border border-blue-500/20 bg-blue-500/5 text-blue-400 text-[10px] font-black uppercase tracking-[0.4em] mb-12 inline-block shadow-[0_0_20px_rgba(59,130,246,0.1)]"
          >
            Digital Protocol: Active
          </motion.div>

          <h1 className="text-6xl md:text-[10rem] font-black mb-10 tracking-tighter text-white leading-[0.85] uppercase">
            Matrix <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-blue-600">
              Core
            </span>
          </h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-xl md:text-3xl text-slate-500 max-w-4xl mx-auto mb-16 leading-relaxed font-light tracking-tight"
          >
            Engineering high-performance{" "}
            <span className="text-white font-black italic relative">
              <AnimatePresence mode="wait">
                <motion.span
                  key={index}
                  initial={{ y: 20, opacity: 0, filter: "blur(10px)" }}
                  animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                  exit={{ y: -20, opacity: 0, filter: "blur(10px)" }}
                  transition={{ duration: 0.5, ease: "backOut" }}
                  className="inline-block min-w-[200px]"
                >
                  {words[index]}
                </motion.span>
              </AnimatePresence>
              <motion.span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-blue-600 block" layoutId="heroLine" />
            </span>
          </motion.div>

          <div className="flex flex-col sm:flex-row gap-8 justify-center items-center">
            <motion.button
              whileHover={{ scale: 1.1, rotate: 1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onNavigate("contact")}
              className="group px-12 py-6 rounded-2xl bg-white text-black font-black uppercase tracking-widest flex items-center gap-4 hover:shadow-[0_20px_60px_-15px_rgba(255,255,255,0.3)] transition-all"
            >
              Initiate Project{" "}
              <Rocket size={20} className="group-hover:translate-y-[-4px] transition-transform" />
            </motion.button>
            <motion.button
              whileHover={{ x: 10, color: "#3b82f6" }}
              onClick={() => onNavigate("portfolio")}
              className="group px-12 py-6 text-white font-black uppercase tracking-widest flex items-center gap-3"
            >
              The Archive{" "}
              <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
            </motion.button>
          </div>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          viewport={{ once: true }}
          className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-16 max-w-5xl mx-auto border-t border-slate-900/50 pt-16"
        >
          {[
            { label: "Operational Assets", val: "250+" },
            { label: "Strategic Nodes", val: "120+" },
            { label: "Precision Index", val: "99%" },
          ].map((stat, i) => (
            <motion.div key={i} variants={fadeInUp} className="relative group">
              <div className="absolute inset-0 bg-blue-500/5 blur-2xl group-hover:bg-blue-500/10 transition-colors" />
              <div className="relative text-4xl md:text-6xl font-black text-white mb-3">
                <AnimatedCounter value={stat.val} />
              </div>
              <div className="text-slate-600 text-[10px] uppercase tracking-[0.5em] font-black">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

const ServicesGrid = () => {
  const services = [
    {
      title: "Core Web Systems",
      desc: "Architecture-first development using React, Next.js, and high-frequency cloud protocols.",
      icon: <Monitor className="text-blue-400" />,
    },
    {
      title: "POS Infrastructure",
      desc: "Distributed commerce systems with real-time inventory synchronization.",
      icon: <Database className="text-purple-400" />,
    },
    {
      title: "Mobile Nexus",
      desc: "Flawless native performance across iOS and Android with refined UI ecosystems.",
      icon: <Smartphone className="text-blue-400" />,
    },
    {
      title: "Autonomous AI",
      desc: "Deep learning integration and LLM-driven workflow automation.",
      icon: <Bot className="text-purple-400" />,
    },
    {
      title: "UI Interaction",
      desc: "Frictionless interface design focused on behavioral psychology and conversion.",
      icon: <PenTool className="text-blue-400" />,
    },
    {
      title: "Neural Shield",
      desc: "Multi-layer cybersecurity and offensive security audits for enterprise data.",
      icon: <Shield className="text-purple-400" />,
    },
  ];

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
    >
      {services.map((s, i) => (
        <TiltCard key={i} className="h-full">
          <motion.div
            variants={fadeInUp}
            whileHover={{ y: -5 }}
            className="p-12 h-full rounded-[3rem] bg-slate-900/30 border border-slate-800/50 hover:border-blue-500/40 transition-all group relative overflow-hidden backdrop-blur-xl"
          >
            <div className="absolute top-0 right-0 w-40 h-40 bg-blue-600/5 blur-[80px] group-hover:bg-blue-600/15 transition-all" />
            <motion.div
              whileHover={{ rotateY: 180 }}
              transition={{ duration: 0.6 }}
              className="mb-10 w-16 h-16 rounded-2xl bg-slate-800/50 flex items-center justify-center shadow-xl border border-slate-700/50"
            >
              {s.icon}
            </motion.div>
            <h3 className="text-2xl font-black text-white mb-6 tracking-tight">{s.title}</h3>
            <p className="text-slate-500 leading-relaxed text-sm font-light mb-10 group-hover:text-slate-300 transition-colors">
              {s.desc}
            </p>
            <div className="flex items-center gap-3 text-[10px] font-black text-blue-500 uppercase tracking-widest opacity-40 group-hover:opacity-100 transition-opacity">
              Deploy Protocol <ArrowRight size={14} />
            </div>
          </motion.div>
        </TiltCard>
      ))}
    </motion.div>
  );
};

const PortfolioGrid = () => {
  const projects = [
    {
      title: "Nova Retail Protocol",
      category: "Enterprise Systems",
      img: "https://images.unsplash.com/photo-1556742049-3ad74c6d7ef7?auto=format&fit=crop&q=80&w=1200",
      tech: ["Go", "React", "Kafka"],
    },
    {
      title: "Aether Digital Hub",
      category: "Experience Web",
      img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200",
      tech: ["Next.js", "Three.js"],
    },
    {
      title: "Synapse AI Assistant",
      category: "Deep Learning",
      img: "https://images.unsplash.com/photo-1531746790731-6c087fecd05a?auto=format&fit=crop&q=80&w=1200",
      tech: ["PyTorch", "OpenAI"],
    },
  ];

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="grid grid-cols-1 md:grid-cols-3 gap-12"
    >
      {projects.map((p, i) => (
        <motion.div
          key={i}
          variants={fadeInUp}
          className="group relative rounded-[3rem] overflow-hidden bg-slate-900/50 border border-slate-800/50"
        >
          <div className="aspect-[4/5] overflow-hidden relative">
            <motion.img
              whileHover={{ scale: 1.1, rotate: 2 }}
              transition={{ duration: 0.8 }}
              src={p.img}
              alt={p.title}
              className="w-full h-full object-cover grayscale-[80%] group-hover:grayscale-0 transition-all duration-700"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60 group-hover:opacity-20 transition-opacity" />
            <motion.div className="absolute top-10 right-10 w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0">
              <ExternalLink size={24} />
            </motion.div>
          </div>
          <div className="p-10">
            <div className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em] mb-4">
              {p.category}
            </div>
            <h3 className="text-3xl font-black text-white mb-6 tracking-tighter">{p.title}</h3>
            <div className="flex flex-wrap gap-3">
              {p.tech.map((t) => (
                <span
                  key={t}
                  className="px-4 py-2 rounded-xl bg-slate-800/80 text-slate-400 text-[10px] font-black uppercase tracking-widest"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

// --- Team Section ---
const TeamSection = () => {
  const reduceMotion = useReducedMotion();
  const [openId, setOpenId] = useState(null);

  const team = [
    {
      id: 1,
      name: "Sachin Kavishka",
      role: "Product Manager",
      intro:
        "Leads product direction and client alignment. Turns complex ideas into clear roadmaps and fast execution.",
      photo: "/team/member-1.svg",
    },
    {
      id: 2,
      name: "Chamodi Kavishka",
      role: "Full-Stack Engineer",
      intro:
        "Builds scalable web apps, APIs, and databases. Focused on performance, security, and clean architecture.",
      photo: "/team/member-2.svg",
    },
    {
      id: 3,
      name: "Sadeepa Dilshan",
      role: "UI/UX Designer",
      intro:
        "Designs high-converting interfaces with smooth motion and modern visual systems. Obsessed with details.",
      photo: "/team/member-3.svg",
    },
    {
      id: 4,
      name: "Manuka Ilangasinghe",
      role: "AI & Automation Engineer",
      intro:
        "Integrates AI assistants and workflow automation. Builds smart tools that reduce time and cost.",
      photo: "/team/member-4.svg",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <SectionHeader subtitle="Core Operators" title="Meet The Team" />

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10"
      >
        {team.map((m) => (
          <motion.div key={m.id} variants={fadeInUp} className="relative">
            <TiltCard className="h-full">
              <motion.button
                type="button"
                onClick={() => setOpenId((p) => (p === m.id ? null : m.id))}
                whileHover={reduceMotion ? undefined : { y: -6 }}
                className="w-full text-left p-10 rounded-[3rem] bg-slate-900/30 border border-slate-800/50 hover:border-blue-500/40 transition-all group relative overflow-hidden backdrop-blur-xl"
              >
                <div className="absolute top-0 right-0 w-40 h-40 bg-blue-600/5 blur-[80px] group-hover:bg-blue-600/15 transition-all" />

                <div className="relative w-28 h-28 rounded-full overflow-hidden border border-slate-700/60 shadow-[0_0_40px_rgba(59,130,246,0.12)]">
                  <img
                    src={m.photo}
                    alt={m.name}
                    className="w-full h-full object-cover scale-[1.02]"
                    loading="lazy"
                  />
                </div>

                <div className="mt-8">
                  <div className="text-white text-xl font-black tracking-tight">{m.name}</div>
                  <div className="mt-2 text-[10px] font-black uppercase tracking-[0.35em] text-blue-500">
                    {m.role}
                  </div>
                </div>

                <div className="mt-8 flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-500 group-hover:text-slate-300 transition-colors">
                  Hover / Tap for intro <ArrowRight size={14} />
                </div>

                {/* Hover Intro (desktop) */}
                <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden lg:block">
                  <div className="absolute inset-0 bg-gradient-to-b from-slate-950/40 via-slate-950/70 to-slate-950/95" />
                  <motion.div
                    initial={reduceMotion ? false : { y: 12, opacity: 0 }}
                    whileHover={reduceMotion ? undefined : { y: 0, opacity: 1 }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                    className="absolute left-8 right-8 bottom-8"
                  >
                    <div className="text-[10px] font-black uppercase tracking-[0.45em] text-blue-400 mb-3">
                      Introduction
                    </div>
                    <div className="text-sm text-slate-200 leading-relaxed font-light">
                      {m.intro}
                    </div>
                  </motion.div>
                </div>
              </motion.button>
            </TiltCard>

            {/* Tap Intro (mobile/tablet) */}
            <AnimatePresence>
              {openId === m.id && (
                <motion.div
                  initial={{ opacity: 0, y: 10, filter: "blur(8px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: 10, filter: "blur(8px)" }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="lg:hidden mt-4 p-8 rounded-[2rem] bg-slate-950/60 border border-slate-800/60"
                >
                  <div className="text-[10px] font-black uppercase tracking-[0.45em] text-blue-400 mb-3">
                    Introduction
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed font-light">{m.intro}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </motion.div>

      <div className="mt-10 text-center text-xs text-slate-600 font-black uppercase tracking-widest">
        Your requirements are our profession
      </div>
    </div>
  );
};

// --- App Entry ---
export default function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    const handleScroll = () => setShowScrollTop(window.scrollY > 800);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [currentPage]);

  const renderContent = () => {
    switch (currentPage) {
      case "home":
        return (
          <>
            <Hero onNavigate={setCurrentPage} />

            <RevealSection className="py-40 px-6 max-w-7xl mx-auto">
              <SectionHeader subtitle="Technology Stacks" title="Hyper-Performant Digital Infrastructure" />
              <ServicesGrid />
            </RevealSection>

            <RevealSection className="py-40 px-6 bg-[#030712] border-y border-slate-900/50">
              <TeamSection />
            </RevealSection>

            <RevealSection className="py-40 px-6 max-w-7xl mx-auto">
              <div className="flex flex-col md:flex-row justify-between items-end mb-24">
                <SectionHeader subtitle="Selected Archive" title="Precision Engineering" centered={false} />
                <motion.button
                  whileHover={{ gap: "2rem" }}
                  onClick={() => setCurrentPage("portfolio")}
                  className="mb-12 text-blue-500 font-black flex items-center gap-4 group text-[10px] uppercase tracking-[0.4em]"
                >
                  Access Full Archive <ArrowRight size={24} />
                </motion.button>
              </div>
              <PortfolioGrid />
            </RevealSection>

            <section className="py-32 overflow-hidden bg-slate-900/10 border-y border-slate-900/50">
              <div className="flex animate-marquee whitespace-nowrap">
                {["Scalable", "Secure", "Autonomous", "Global", "Optimized", "Intelligent", "Distributed", "Robust"].map(
                  (tag, i) => (
                    <span
                      key={i}
                      className="text-[12rem] font-black text-white/5 mx-16 uppercase italic outline-text tracking-tighter"
                    >
                      {tag}
                    </span>
                  )
                )}
                {["Scalable", "Secure", "Autonomous", "Global", "Optimized", "Intelligent", "Distributed", "Robust"].map(
                  (tag, i) => (
                    <span
                      key={i}
                      className="text-[12rem] font-black text-white/5 mx-16 uppercase italic outline-text tracking-tighter"
                    >
                      {tag}
                    </span>
                  )
                )}
              </div>
            </section>

            <RevealSection className="py-40 px-6 bg-[#030712]">
              <div className="max-w-7xl mx-auto">
                <SectionHeader subtitle="Operational Logic" title="The Development Cycle" />
                <div className="grid grid-cols-1 md:grid-cols-5 gap-16">
                  {[
                    { icon: <Globe />, label: "Discover" },
                    { icon: <Activity />, label: "Architect" },
                    { icon: <Code />, label: "Develop" },
                    { icon: <Shield />, label: "Harden" },
                    { icon: <Rocket />, label: "Deploy" },
                  ].map((s, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.5 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.1, duration: 0.6 }}
                      className="flex flex-col items-center gap-6"
                    >
                      <div className="w-24 h-24 rounded-[2rem] bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400 group relative">
                        <div className="absolute inset-0 bg-blue-600 rounded-[2rem] scale-0 group-hover:scale-100 transition-transform duration-500" />
                        <div className="relative z-10 group-hover:text-white transition-colors">
                          {s.icon}
                        </div>
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">
                        {s.label}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </RevealSection>

            <RevealSection className="py-40 px-6 max-w-7xl mx-auto text-center">
              <motion.div
                whileInView={{ scale: [0.95, 1], opacity: [0, 1] }}
                className="bg-gradient-to-br from-blue-700 via-blue-800 to-purple-900 rounded-[5rem] p-24 md:p-40 relative overflow-hidden shadow-[0_40px_100px_-20px_rgba(59,130,246,0.5)]"
              >
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/graphy-dark.png')] opacity-10" />
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
                  className="absolute -top-40 -left-40 w-96 h-96 border-[1px] border-white/5 rounded-full"
                />
                <div className="relative z-10">
                  <h2 className="text-5xl md:text-9xl font-black text-white mb-12 tracking-tighter leading-none">
                    INITIATE <br /> PROTOCOL.
                  </h2>
                  <p className="text-blue-100 text-xl md:text-2xl mb-16 max-w-3xl mx-auto font-light tracking-tight">
                    Deploy your next digital asset with the world's most precise software engineers.
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.1, backgroundColor: "#fff", color: "#000" }}
                    onClick={() => setCurrentPage("contact")}
                    className="px-16 py-8 rounded-full border-2 border-white text-white font-black text-2xl uppercase tracking-widest transition-all"
                  >
                    Start Deployment
                  </motion.button>
                </div>
              </motion.div>
            </RevealSection>
          </>
        );

      case "about":
        return (
          <section className="pt-56 pb-40 px-6 max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
              <motion.div initial={{ opacity: 0, x: -60 }} animate={{ opacity: 1, x: 0 }}>
                <SectionHeader subtitle="Company Profile" title="Matrix Core Software Solutions" centered={false} />
                <div className="space-y-8 text-slate-400 text-xl font-light leading-relaxed mb-16">
                  <p>
                    MCSS is a global engineering hub specializing in the fusion of behavioral design and
                    advanced computational logic.
                  </p>
                  <p>
                    From our command center in Sri Lanka, we orchestrate digital transformations for
                    high-growth startups and established global enterprises.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-10">
                  {[
                    {
                      icon: <Shield className="text-blue-500" />,
                      title: "Zero-Day Security",
                      text: "Hardened code from the first commit.",
                    },
                    {
                      icon: <Rocket className="text-purple-500" />,
                      title: "Infinite Scaling",
                      text: "Infrastructure designed for tomorrow's load.",
                    },
                  ].map((item, i) => (
                    <motion.div whileHover={{ y: -5 }} key={i} className="space-y-4">
                      <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center shadow-lg">
                        {item.icon}
                      </div>
                      <div className="text-white font-black text-sm uppercase tracking-widest">{item.title}</div>
                      <div className="text-xs text-slate-500 leading-relaxed font-light">{item.text}</div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative aspect-square bg-slate-900/50 rounded-[5rem] border border-slate-800/50 backdrop-blur-3xl flex items-center justify-center p-20"
              >
                <div className="grid grid-cols-2 gap-20 text-center">
                  {[
                    { v: "250+", l: "Protocols" },
                    { v: "40+", l: "Engineers" },
                    { v: "15+", l: "Nations" },
                    { v: "100%", l: "Precision" },
                  ].map((s, i) => (
                    <div key={i}>
                      <div className="text-6xl font-black text-white mb-4 tracking-tighter">
                        <AnimatedCounter value={s.v} />
                      </div>
                      <div className="text-blue-500 font-black text-[10px] uppercase tracking-[0.4em]">
                        {s.l}
                      </div>
                    </div>
                  ))}
                </div>

                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 p-10 pointer-events-none"
                >
                  <div className="w-full h-full border-[1px] border-dashed border-blue-500/20 rounded-full" />
                </motion.div>

                <motion.div
                  animate={{ y: [0, -18, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="absolute -top-10 -right-10 w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center text-white shadow-2xl"
                >
                  <Award size={40} />
                </motion.div>
              </motion.div>
            </div>
          </section>
        );

      case "services":
        return (
          <section className="pt-56 pb-40 px-6 max-w-7xl mx-auto">
            <SectionHeader subtitle="Operational Capabilities" title="The MCSS Technology Protocol" />
            <ServicesGrid />
          </section>
        );

      case "team":
        return (
          <section className="pt-56 pb-40 px-6 bg-[#030712]">
            <TeamSection />
          </section>
        );

      case "portfolio":
        return (
          <section className="pt-56 pb-40 px-6 max-w-7xl mx-auto">
            <SectionHeader subtitle="Visual Archive" title="Case Studies in Excellence" />
            <PortfolioGrid />
          </section>
        );

      case "process":
        return (
          <section className="pt-56 pb-40 px-6 max-w-7xl mx-auto">
            <SectionHeader subtitle="Operational Logic" title="The Development Cycle" />
            <div className="grid grid-cols-1 md:grid-cols-5 gap-16">
              {[
                { icon: <Globe />, label: "Discover" },
                { icon: <Activity />, label: "Architect" },
                { icon: <Code />, label: "Develop" },
                { icon: <Shield />, label: "Harden" },
                { icon: <Rocket />, label: "Deploy" },
              ].map((s, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1, duration: 0.6 }}
                  className="flex flex-col items-center gap-6"
                >
                  <div className="w-24 h-24 rounded-[2rem] bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400 group relative">
                    <div className="absolute inset-0 bg-blue-600 rounded-[2rem] scale-0 group-hover:scale-100 transition-transform duration-500" />
                    <div className="relative z-10 group-hover:text-white transition-colors">{s.icon}</div>
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">{s.label}</span>
                </motion.div>
              ))}
            </div>
          </section>
        );

      case "pricing":
        return (
          <section className="pt-56 pb-40 px-6 max-w-7xl mx-auto">
            <SectionHeader subtitle="Investment Structure" title="Deploy Your Strategic Asset" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {[
                {
                  name: "Launchpad",
                  price: "$1.5k",
                  features: [
                    "High-End Landing Protocol",
                    "Mobile Infrastructure",
                    "SEO Indexing",
                    "CMS Interface",
                    "30 Day Security",
                  ],
                  recommended: false,
                },
                {
                  name: "Enterprise",
                  price: "$3.5k",
                  features: [
                    "Distributed Commerce",
                    "Full API Ecosystem",
                    "Cloud Scaling",
                    "Behavioral UI",
                    "Priority Uplink",
                  ],
                  recommended: true,
                },
                {
                  name: "Omni Nexus",
                  price: "Custom",
                  features: [
                    "AI Agent Integration",
                    "Complex POS Networks",
                    "Neural Networks",
                    "Private Lead Architect",
                    "White-Glove Support",
                  ],
                  recommended: false,
                },
              ].map((p, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -10 }}
                  className={`relative p-12 rounded-[3rem] border-2 transition-all ${
                    p.recommended
                      ? "bg-slate-900 border-blue-500 shadow-[0_40px_80px_-20px_rgba(59,130,246,0.3)] z-10"
                      : "bg-slate-900/30 border-slate-800"
                  }`}
                >
                  <h3 className="text-2xl font-black text-white mb-4 uppercase tracking-tighter">{p.name}</h3>
                  <div className="flex items-baseline gap-2 mb-10">
                    <span className="text-5xl font-black text-white">{p.price}</span>
                    <span className="text-slate-600 text-[10px] font-black uppercase tracking-widest">/min</span>
                  </div>
                  <ul className="space-y-6 mb-12 pt-8 border-t border-slate-800/50">
                    {p.features.map((f) => (
                      <li key={f} className="flex items-center gap-4 text-xs font-light text-slate-400">
                        <CheckCircle size={16} className="text-blue-500 flex-shrink-0" /> {f}
                      </li>
                    ))}
                  </ul>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    onClick={() => setCurrentPage("contact")}
                    className={`w-full py-5 rounded-2xl font-black uppercase tracking-widest text-xs ${
                      p.recommended ? "bg-blue-600 text-white shadow-xl" : "border-2 border-slate-800 text-white"
                    }`}
                  >
                    Initiate Setup
                  </motion.button>
                </motion.div>
              ))}
            </div>
          </section>
        );

      case "contact":
        return (
          <section className="pt-56 pb-40 px-6 max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-32">
              <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }}>
                <SectionHeader subtitle="Communication Protocol" title="Connect With The Matrix" centered={false} />
                <p className="text-slate-500 mb-16 text-xl font-light leading-relaxed">
                  Submit your project requirements to initiate an engineering audit.
                </p>
                <div className="space-y-12">
                  {[
                    { icon: <Mail />, label: "Neural Uplink", val: "mcss@matrix.lk" },
                    { icon: <MessageSquare />, label: "Direct Protocol", val: "+94 77 167 6298" },
                    { icon: <MapPin />, label: "Command Node", val: "Colombo, Sri Lanka" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-8 group cursor-pointer">
                      <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-blue-500 group-hover:bg-blue-600 group-hover:text-white transition-all">
                        {item.icon}
                      </div>
                      <div>
                        <div className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-600 mb-1">
                          {item.label}
                        </div>
                        <div className="text-white text-2xl font-black tracking-tight">{item.val}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-slate-900/30 p-16 rounded-[4rem] border border-slate-800/50 backdrop-blur-3xl shadow-2xl"
              >
                <form className="space-y-10" onSubmit={(e) => e.preventDefault()}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600">
                        Operator Name
                      </label>
                      <input
                        type="text"
                        className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-8 py-5 text-white focus:border-blue-500 outline-none transition-all placeholder:text-slate-700"
                        placeholder="Your name"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600">
                        Return Channel
                      </label>
                      <input
                        type="text"
                        className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-8 py-5 text-white focus:border-blue-500 outline-none transition-all placeholder:text-slate-700"
                        placeholder="Email / WhatsApp"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600">
                      Deployment Type
                    </label>
                    <select className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-8 py-5 text-white focus:border-blue-500 outline-none transition-all appearance-none cursor-pointer">
                      <option>Full POS Ecosystem</option>
                      <option>Web Infrastructure</option>
                      <option>Mobile Core App</option>
                      <option>AI Automation Hub</option>
                    </select>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600">
                      Mission Parameters
                    </label>
                    <textarea
                      rows={4}
                      className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-8 py-5 text-white focus:border-blue-500 outline-none transition-all placeholder:text-slate-700"
                      placeholder="Provide technical scope..."
                    />
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02, boxShadow: "0 0 40px rgba(59,130,246,0.3)" }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-6 rounded-2xl bg-blue-600 text-white font-black uppercase tracking-[0.3em] text-sm shadow-xl flex items-center justify-center gap-4 group"
                  >
                    Deploy Inquiry{" "}
                    <Rocket size={20} className="group-hover:translate-x-2 group-hover:translate-y-[-2px] transition-transform" />
                  </motion.button>
                </form>
              </motion.div>
            </div>
          </section>
        );

      default:
        return <Hero onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] font-sans selection:bg-blue-500 selection:text-white overflow-x-hidden text-slate-300">
      <CustomCursor />
      <ScrollProgress />

      <style>{`
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .animate-marquee { animation: marquee 60s linear infinite; }
        .outline-text { -webkit-text-stroke: 1px rgba(255,255,255,0.05); color: transparent; }

        /* Scrollbar */
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #030712; }
        ::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: #3b82f6; }
      `}</style>

      <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} />

      <main>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, filter: "blur(20px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, filter: "blur(20px)" }}
            transition={{ duration: 0.8, ease: "circInOut" }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>

      <footer className="bg-slate-950/50 border-t border-slate-900 py-32 px-6 mt-40">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-20">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-4 mb-10">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-700 flex items-center justify-center text-white font-black text-3xl shadow-2xl">
                M
              </div>
              <span className="text-4xl font-black text-white tracking-tighter">MCSS</span>
            </div>
            <p className="text-slate-500 max-w-md mb-12 text-xl font-light leading-relaxed">
              Synthesizing behavior and logic to build the backbone of the next-generation global digital economy.
            </p>
            <div className="flex gap-6">
              {[Globe, Mail, Smartphone, Database].map((Icon, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.2, color: "#3b82f6" }}
                  className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 transition-all"
                >
                  <Icon size={24} />
                </motion.div>
              ))}
            </div>
          </div>

          <div className="space-y-8">
            <h4 className="text-white font-black uppercase text-[10px] tracking-[0.5em]">The Core</h4>
            <ul className="space-y-6 text-slate-500 font-medium text-sm">
              <li className="hover:text-blue-500 cursor-pointer transition-colors" onClick={() => setCurrentPage("about")}>Bio Protocol</li>
              <li className="hover:text-blue-500 cursor-pointer transition-colors" onClick={() => setCurrentPage("services")}>Active Stacks</li>
              <li className="hover:text-blue-500 cursor-pointer transition-colors" onClick={() => setCurrentPage("team")}>Team Node</li>
              <li className="hover:text-blue-500 cursor-pointer transition-colors" onClick={() => setCurrentPage("portfolio")}>Digital Archive</li>
              <li className="hover:text-blue-500 cursor-pointer transition-colors" onClick={() => setCurrentPage("pricing")}>Pricing Nodes</li>
            </ul>
          </div>

          <div className="space-y-8">
            <h4 className="text-white font-black uppercase text-[10px] tracking-[0.5em]">Protocol</h4>
            <ul className="space-y-6 text-slate-500 font-medium text-sm">
              <li className="hover:text-blue-500 cursor-pointer transition-colors" onClick={() => setCurrentPage("process")}>Process</li>
              <li className="hover:text-blue-500 cursor-pointer transition-colors" onClick={() => setCurrentPage("contact")}>Client Portal</li>
              <li className="hover:text-blue-500 cursor-pointer transition-colors">Neural Hub</li>
              <li className="hover:text-blue-500 cursor-pointer transition-colors">Data Privacy</li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-32 pt-12 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center text-slate-600 text-xs">
          <div className="mb-6 md:mb-0 font-black uppercase tracking-widest">
            © 2026 Matrix Core Software Solutions
          </div>
          <div className="flex gap-12 items-center">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_#22c55e]" />
              <span className="uppercase tracking-widest font-black">All Nodes Healthy</span>
            </div>
            <span className="font-black uppercase tracking-widest text-white">SRI LANKA 🇱🇰</span>
          </div>
        </div>
      </footer>

      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            whileHover={{ scale: 1.1, backgroundColor: "#3b82f6" }}
            whileTap={{ scale: 0.9 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="fixed bottom-12 right-12 w-16 h-16 rounded-full bg-slate-900 text-white flex items-center justify-center shadow-[0_20px_40px_rgba(0,0,0,0.5)] z-50 border border-slate-800"
            aria-label="Back to top"
          >
            <ChevronUp size={32} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
