"use client";

import { motion } from "framer-motion";
import { Sparkles, Play, Lightbulb } from "lucide-react";
import generateImg from "@/assets/GenerateFeatureExample.png";
import runImg from "@/assets/RunFeatureExample.png";
import weakHintImg from "@/assets/WeakHintExample.png";
import strongHintImg from "@/assets/StrongHintExample.png";
import CreateRoomButton from "./CreateRoomButton";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut" as const,
    },
  },
};

export default function Features() {
  const coreFeatures = [
    {
      title: "AI-Generated Interview Questions",
      description:
        "Practice with questions tailored by company, topic and difficulty — or generate random questions instantly.",
      image: generateImg,
      icon: <Sparkles className="w-6 h-6" />,
    },
    {
      title: "Run Code Instantly In-Browser",
      description:
        "Test solutions in real time with zero setup: write, run and repeat directly from the browser.",
      image: runImg,
      icon: <Play className="w-6 h-6" />,
    },
    {
      title: "Contextual Hint Feedback",
      description:
        "Receive a quick hint first, then a full explanation when you're stuck.",
      images: [weakHintImg, strongHintImg],
      icon: <Lightbulb className="w-6 h-6" />,
    },
  ];

  return (
    <section className="relative py-24 px-6 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent" />

      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-gradient-to-r from-white/10 to-white/5 rounded-full blur-3xl opacity-30" />
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-gradient-to-l from-white/8 to-white/12 rounded-full blur-3xl opacity-25" />

      <motion.div
        className="absolute inset-0 opacity-10"
        animate={{
          background: [
            "radial-gradient(circle at 20% 30%, rgba(255,255,255,0.1) 0%, transparent 70%)",
            "radial-gradient(circle at 80% 70%, rgba(255,255,255,0.15) 0%, transparent 70%)",
            "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.12) 0%, transparent 70%)",
            "radial-gradient(circle at 20% 30%, rgba(255,255,255,0.1) 0%, transparent 70%)",
          ],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <div className="relative max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.h2
            className="text-4xl sm:text-5xl font-bold text-white mb-6 leading-tight"
            animate={{
              textShadow: [
                "0 0 30px rgba(255,255,255,0.3)",
                "0 0 50px rgba(255,255,255,0.2)",
                "0 0 30px rgba(255,255,255,0.3)",
              ],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            Features
          </motion.h2>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed font-light tracking-wide">
            We built a free version of CoderPad — code instantly, share a link,
            and collaborate. No signup needed. Free forever.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto"
        >
          {coreFeatures.map((feature, i) => (
            <motion.article
              key={i}
              variants={itemVariants}
              className={`relative bg-black/30 backdrop-blur-md border border-white/10 overflow-hidden shadow-xl rounded-xl ${
                feature.images ? "lg:col-span-2" : ""
              }`}
            >
              {feature.images ? (
                <div className="p-6 h-full flex flex-col">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="inline-flex items-center justify-center w-10 h-10 bg-black/50 text-white rounded-lg shadow-md border border-white/20">
                      <span className="w-5 h-5 flex items-center justify-center">
                        {feature.icon}
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold text-white">
                      {feature.title}
                    </h3>
                  </div>
                  <p className="text-sm text-gray-300 leading-relaxed mb-6 font-light tracking-wide">
                    {feature.description}
                  </p>
                  <div className="mt-auto flex justify-center items-center gap-4 pt-2">
                    {feature.images.map((src, idx) => (
                      <div
                        key={idx}
                        className="relative overflow-hidden rounded-md shadow-md border border-white/10"
                      >
                        <img
                          src={src}
                          alt={`${feature.title} screenshot ${idx + 1}`}
                          className="w-full h-auto object-contain"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-6 h-full flex flex-col">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="inline-flex items-center justify-center w-10 h-10 bg-black/50 text-white rounded-lg shadow-md border border-white/20">
                      <span className="w-5 h-5 flex items-center justify-center">
                        {feature.icon}
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold text-white">
                      {feature.title}
                    </h3>
                  </div>
                  <p className="text-sm text-gray-300 leading-relaxed mb-6 font-light tracking-wide">
                    {feature.description}
                  </p>
                  <div className="mt-auto rounded-md shadow-md border border-white/10 overflow-hidden">
                    <img
                      src={feature.image}
                      alt={feature.title}
                      className="w-full h-auto object-cover"
                    />
                  </div>
                </div>
              )}
            </motion.article>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-20"
        >
          <p className="text-sm text-gray-400 mb-5 font-light tracking-wide">
            Ready to level up your interview skills?
          </p>
          <CreateRoomButton />
        </motion.div>
      </div>
    </section>
  );
}
