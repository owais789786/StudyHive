import React, { useRef, useState, useEffect } from 'react'
import { useScroll, useTransform, motion, useMotionValue, useSpring } from 'motion/react'

const aboutArray = [
  {
    id: 1,
    tag: "Our Mission",
    heading: "Learning, Reimagined for the AI Era",
    body: "StudyHive was built because students deserve more than static PDFs and overcrowded group chats. We combined the power of large language models with real university workflows to create a platform that actually understands how you study.",
    accent: "from-cyan-400 to-blue-500",
    border: "border-cyan-500/30",
    glow: "shadow-cyan-500/20",
    text: "text-cyan-500",
    icon: "🧠",
  },
  {
    id: 2,
    tag: "How It Works",
    heading: "Your AI Study Partner — Available 24/7",
    body: "Upload your lecture notes, ask anything, get instant summaries, generate practice quizzes, and collaborate with classmates in real-time. StudyHive's AI adapts to your course content — not generic internet fluff.",
    accent: "from-violet-400 to-purple-600",
    border: "border-violet-500/30",
    text: "text-violet-500",
    glow: "shadow-violet-500/20",
    icon: "⚡",
  },
  {
    id: 3,
    tag: "Built For You",
    heading: "Made by Students, Shaped by Students",
    body: "We're university students ourselves. We know the 3 AM panic before finals. We know how broken the current tools are. StudyHive is our answer — a living platform that grows smarter with every student who uses it.",
    accent: "from-emerald-400 to-teal-500",
    border: "border-emerald-500/30",
    text: "text-emerald-500",
    glow: "shadow-emerald-500/20",
    icon: "🎓",
  },
];


const About = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const container = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!container.current) return;

      const containerTop = container.current.getBoundingClientRect().top + window.scrollY;
      const scrolled = window.scrollY - containerTop;
      const slideHeight = window.innerHeight;

      // Bas itna — agar itna scroll hua to slide badlo
      if (scrolled < slideHeight * 0.5) {
        setActiveSlide(0);
      } else if (scrolled < slideHeight * 1.5) {
        setActiveSlide(1);
      } else {
        setActiveSlide(2);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end end"]
  })

  const rawY = useMotionValue(0);

  // Damping yahan set karo
  const y = useSpring(rawY, {
    stiffness: 200,  // kitni tezi se jaye
    damping: 35,     // kitna bounce kare — badhao to kam bounce
    mass: 2
  });

  const translateY = useTransform(y, v => `-${v}%`);

  // activeSlide change hone pe rawY update karo
  useEffect(() => {
    rawY.set(activeSlide * 33.33);
  }, [activeSlide]);

  return (
    <div ref={container} id='about' className="h-[300dvh] bg-gray-900 flex justify-center">
      <div className="sticky top-0 h-dvh max-w-300 w-full flex flex-col py-20 px-5">
        <p className='text-white font-dosis text-4xl font-bold mb-10'>About <span className='text-2xl text-primary font-dancing '>Stydy Hive</span></p>
        {/* Bas translateY state se drive ho raha hai */}
        <div className='relative w-full min-h-100 overflow-hidden'>

          <motion.div
            style={{
              translateY,
            }}
            className=" absolute grid grid-rows-3 ease-in-out "

          >
            {aboutArray.map((item, i) => (
              <div key={item.id} className={`grid grid-cols-1 min-h-100 sm:grid-cols-[1fr_2fr] items-center px-6 gap-6 relative place-items-center justify-items-center`} >
                {/* Icon */}
                <div className={`w-20 h-20 rounded-2xl bg-linear-to-br ${item.accent} flex items-center justify-center text-4xl `}>
                  {item.icon}
                </div>
                {/* Text */}
                <div className="flex  p-2 rounded-2xl flex-col gap-2">
                  <span className={ `text-xs ${item.text} font-bold font-dosis text-gray-400 uppercase tracking-widest` } >{item.tag}</span>
                  <h2 className="text-white font-dosis text-2xl font-bold">{item.heading}</h2>
                  <p className="text-gray-400 text-sm leading-relaxed">{item.body}</p>
                </div>
              </div>
            ))}

          </motion.div>

          <div className='absolute inset-0 sm:bg-linear-to-b from-gray-900 via-transparent to-gray-900'></div>

        </div>

      </div>
    </div>
  );
};

export default About;