"use client";

import { motion } from "framer-motion";
import CreateRoomButton from "@/components/homepage/CreateRoomButton";
import LanguageShowdown from "@/components/homepage/LanguageShowdown";
import Footer from "@/components/homepage/Footer";
import UseCases from "@/components/homepage/UseCases";

const floating = [
  { src: "/assets/sticky.svg", x: "-44%", y: "60%", delay: 0 },
  { src: "/assets/clip.svg", x: "-52%", y: "10%", delay: 1.2 },
  { src: "/assets/chat.svg", x: "46%", y: "-38%", delay: 0.8 },
  { src: "/assets/doc.svg", x: "50%", y: "50%", delay: 1.6 },
  { src: "/assets/token.svg", x: "40%", y: "-8%", delay: 0.4 },
];

export default function Home() {
  return (
    <div className="relative min-h-screen bg-neutral-50 text-neutral-900 overflow-hidden flex flex-col">
      {/* Floating elements */}
      <div className="pointer-events-none absolute inset-0 z-0">
        {floating.map(({ src, x, y, delay }, i) => (
          <motion.img
            key={i}
            src={src}
            alt=""
            className="absolute select-none"
            style={{ translateX: x, translateY: y }}
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{
              duration: 50,
              repeat: Infinity,
              ease: "linear",
              delay,
            }}
          />
        ))}
      </div>

      {/* Header */}
      <div className="flex justify-between items-center px-40 py-4 z-10">
        <div className="flex items-center">
          <img
            src="/interviewlablogo.svg"
            alt="InterviewLab Logo"
            className="h-10 w-10 md:h-12 md:w-12"
          />
          <span className="text-xl md:text-2xl font-bold tracking-tight text-neutral-800">
            Interview Lab
          </span>
        </div>

        <div className="text-sm text-neutral-500">266 rooms created</div>
      </div>

      {/* Center content */}
      <div className="flex flex-col items-center justify-center flex-grow z-10 px-4">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl text-center text-5xl font-extrabold leading-tight lg:text-6xl"
        >
          The smarter way to&nbsp;start a live coding room
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="mt-6 text-center text-lg text-neutral-600 max-w-xl"
        >
          Spin up an interactive pad, share a link, and collaborate in
          real&nbsp;time.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-8"
        >
          <CreateRoomButton />
        </motion.div>
      </div>

      {/* Feature section (GIFs, LanguageShowdown, etc.) */}
      <div className="z-10 mt-12 mb-8 px-4">
        <LanguageShowdown />
        <UseCases />
        <Footer />
      </div>
    </div>
  );
}
