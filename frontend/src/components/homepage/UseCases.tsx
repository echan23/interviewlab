"use client";

import { motion } from "framer-motion";
import { Sparkles, Brain, Users, TerminalSquare } from "lucide-react";

const features = [
  {
    title: "Generate Smart Problems",
    description:
      "Filter problems by company, difficulty, and type for focused interview prep.",
    icon: Sparkles,
  },
  {
    title: "Strong & Weak AI Hints",
    description:
      "Get intelligent, contextual hints based on your code—gentle or direct, your choice.",
    icon: Brain,
  },
  {
    title: "Live Collaboration",
    description:
      "Work in sync with others in real time. Share, edit, and solve problems together.",
    icon: Users,
  },
  {
    title: "In-Browser Compilation",
    description:
      "No setup needed. Write and execute code directly in the browser with instant feedback.",
    icon: TerminalSquare,
  },
];

export default function Features() {
  return (
    <div className="relative z-10 w-full bg-gradient-to-b from-neutral-50 to-white px-6 py-24">
      <div className="mx-auto max-w-6xl text-center">
        <h2 className="text-4xl font-bold tracking-tight text-neutral-900 sm:text-5xl">
          Powerful Features. Seamless Experience.
        </h2>
        <p className="mt-4 text-lg text-neutral-600 max-w-2xl mx-auto">
          Everything you need to learn, practice, and collaborate—all in one
          place.
        </p>
      </div>

      <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto">
        {features.map(({ title, description, icon: Icon }, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.15 }}
            viewport={{ once: true }}
            className="rounded-2xl bg-white p-6 shadow-sm transition hover:shadow-md border border-neutral-200"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-neutral-100 text-neutral-800">
              <Icon className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold text-neutral-900">{title}</h3>
            <p className="mt-2 text-sm text-neutral-600">{description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
