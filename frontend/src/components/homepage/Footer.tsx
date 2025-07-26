"use client";

import {
  SiGo,
  SiReact,
  SiTypescript,
  SiPython,
  SiRedis,
  SiPostgresql,
} from "react-icons/si";

const techStack = [
  { name: "Go", Icon: SiGo },
  { name: "React", Icon: SiReact },
  { name: "TypeScript", Icon: SiTypescript },
  { name: "Python", Icon: SiPython },
  { name: "Redis", Icon: SiRedis },
  { name: "PostgreSQL", Icon: SiPostgresql },
];

export default function Footer() {
  return (
    <footer className="relative w-full overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/30 to-transparent" />
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm border-t border-white/10" />

      <div className="absolute top-0 left-1/4 w-64 h-32 bg-gradient-to-r from-white/5 to-white/2 rounded-full blur-3xl opacity-30" />
      <div className="absolute bottom-0 right-1/4 w-48 h-24 bg-gradient-to-l from-white/4 to-white/8 rounded-full blur-3xl opacity-25" />

      <div className="relative py-12 px-6">
        <div className="mx-auto max-w-screen-xl">
          <div className="text-center mb-8">
            <h3 className="text-lg font-semibold text-white mb-6 tracking-wide">
              Built with
            </h3>
            <div className="flex flex-wrap items-center justify-center gap-6">
              {techStack.map(({ name, Icon }) => (
                <Icon
                  key={name}
                  title={name}
                  className="h-8 w-8 text-gray-400 transition hover:text-white"
                />
              ))}
            </div>
          </div>

          <div className="w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent my-8" />

          <div className="text-center">
            <p className="text-sm text-gray-400 font-light tracking-wide">
              © {new Date().getFullYear()} InterviewLab
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
