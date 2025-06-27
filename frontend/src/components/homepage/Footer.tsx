"use client";

import {
  SiGo,
  SiReact,
  SiTypescript,
  SiPython,
  SiRedis,
  SiPostgresql,
} from "react-icons/si";
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from "@/components/ui/hover-card";

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
            <HoverCard>
              <HoverCardTrigger asChild>
                <p className="text-sm text-gray-400 cursor-pointer hover:text-white transition-colors duration-300 font-light tracking-wide">
                  © {new Date().getFullYear()} InterviewLab • Connect with us on
                  LinkedIn
                </p>
              </HoverCardTrigger>
              <HoverCardContent className="bg-black/80 backdrop-blur-md border border-white/20 shadow-xl">
                <div className="p-2">
                  <h4 className="text-sm font-semibold text-white mb-3 tracking-wide">
                    Our team
                  </h4>
                  <div className="flex flex-col gap-2">
                    {[
                      {
                        name: "Edward Chan",
                        url: "https://www.linkedin.com/in/edchan23/",
                      },
                      {
                        name: "Ben Li",
                        url: "https://www.linkedin.com/in/benjaminliumd/",
                      },
                      {
                        name: "Chris Nam",
                        url: "https://www.linkedin.com/in/chrisnam28/",
                      },
                      {
                        name: "Hao Jiang",
                        url: "https://www.linkedin.com/in/haojiang418/",
                      },
                    ].map((member) => (
                      <a
                        key={member.name}
                        href={member.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10 transition-all duration-200"
                      >
                        <div className="w-2 h-2 bg-white/40 rounded-full group-hover:bg-white transition-colors duration-200" />
                        <span className="text-sm text-gray-300 group-hover:text-white transition-colors duration-200 font-light">
                          {member.name}
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
              </HoverCardContent>
            </HoverCard>
          </div>
        </div>
      </div>
    </footer>
  );
}
