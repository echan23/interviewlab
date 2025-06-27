"use client";

import {
  SiGo,
  SiReact,
  SiTypescript,
  SiPython,
  SiRedis,
  SiPostgresql,
  SiOpenai,
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
  { name: "OpenAI", Icon: SiOpenai },
];

export default function Footer() {
  return (
    <footer className="w-full bg-gray-900 py-6">
      <div className="mx-auto flex max-w-screen-xl flex-wrap items-center justify-center gap-6 px-4">
        {techStack.map(({ name, Icon }) => (
          <Icon
            key={name}
            title={name}
            className="h-8 w-8 text-gray-400 transition hover:text-white"
          />
        ))}
      </div>

      <HoverCard>
        <HoverCardTrigger asChild>
          <p className="mt-4 text-center text-xs text-gray-400 cursor-pointer">
            © {new Date().getFullYear()} InterviewLab. Check us out on LinkedIn!
          </p>
        </HoverCardTrigger>
        <HoverCardContent className="text-sm">
          <div className="flex flex-col gap-1">
            <a
              href="https://www.linkedin.com/in/edchan23/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline text-gray-700 hover:text-black transition-colors duration-150"
            >
              @Edward Chan
            </a>
            <a
              href="https://www.linkedin.com/in/benjaminliumd/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline text-gray-700 hover:text-black transition-colors duration-150"
            >
              @Ben Li
            </a>
            <a
              href="https://www.linkedin.com/in/chrisnam28/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline text-gray-700 hover:text-black transition-colors duration-150"
            >
              @Chris Nam
            </a>
            <a
              href="https://www.linkedin.com/in/haojiang418/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline text-gray-700 hover:text-black transition-colors duration-150"
            >
              @Hao Jiang
            </a>
          </div>
        </HoverCardContent>
      </HoverCard>
    </footer>
  );
}
