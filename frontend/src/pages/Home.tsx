"use client";

import { motion } from "framer-motion";
import CreateRoomButton from "@/components/CreateRoomButton";

const floating = [
  { src: "/assets/sticky.svg", x: "-44%", y: "60%", delay: 0 },
  { src: "/assets/clip.svg", x: "-52%", y: "10%", delay: 1.2 },
  { src: "/assets/chat.svg", x: "46%", y: "-38%", delay: 0.8 },
  { src: "/assets/doc.svg", x: "50%", y: "50%", delay: 1.6 },
  { src: "/assets/token.svg", x: "40%", y: "-8%", delay: 0.4 },
];

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-neutral-50 text-neutral-900">
      {/* radial spotlight */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="h-[140%] w-[140%] rounded-full bg-gradient-to-b from-white via-transparent to-transparent blur-[120px]" />
      </div>

      {/* floating edges */}
      {floating.map(({ src, x, y, delay }, i) => (
        <motion.img
          key={i}
          src={src}
          alt=""
          className="pointer-events-none absolute select-none"
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

      {/* logo (optional) */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 mb-8"
      >
        <img src="/logo-mark.svg" alt="Logo" className="h-10 w-10" />
      </motion.div>

      {/* headline + subcopy */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 max-w-4xl px-4 text-center text-5xl font-extrabold leading-tight lg:text-6xl"
      >
        The smarter way to&nbsp;start a live coding room
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.8 }}
        className="relative z-10 mt-6 px-4 text-center text-lg text-neutral-600"
      >
        Spin up an interactive pad, share a link, and collaborate in
        real&nbsp;time.
      </motion.p>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="relative z-10 mt-10"
      >
        <CreateRoomButton></CreateRoomButton>
      </motion.div>
    </div>
  );
}
