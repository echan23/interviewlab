"use client";
import CreateRoomButton from "@/components/homepage/CreateRoomButton";
import Footer from "@/components/homepage/Footer";
import Features from "@/components/homepage/Features";

const floating = [
  { src: "/assets/sticky.svg", x: "-44%", y: "60%", delay: 0 },
  { src: "/assets/clip.svg", x: "-52%", y: "10%", delay: 1.2 },
  { src: "/assets/chat.svg", x: "46%", y: "-38%", delay: 0.8 },
  { src: "/assets/doc.svg", x: "50%", y: "50%", delay: 1.6 },
  { src: "/assets/token.svg", x: "40%", y: "-8%", delay: 0.4 },
];

export default function Home() {
  return (
    <div className="relative min-h-screen text-white overflow-hidden flex flex-col bg-black">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white/8 via-transparent to-white/4"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(255,255,255,0.06)_0%,_transparent_50%)]"></div>

        <div className="absolute w-96 h-96 -top-48 -left-48 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute w-80 h-80 -bottom-40 -right-40 bg-white/4 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute w-64 h-64 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white/3 rounded-full blur-3xl animate-bounce"
          style={{ animationDuration: "8s" }}
        ></div>
      </div>

      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(255,255,255,0.1)_0%,_transparent_70%)]"></div>
      </div>

      <div className="pointer-events-none absolute inset-0 z-0">
        {floating.map(({ src, x, y }, i) => (
          <img
            key={i}
            src={src}
            alt=""
            className="absolute select-none w-12 h-12 opacity-20 brightness-0 invert animate-pulse"
            style={{
              left: x,
              top: y,
              animationDelay: `${i * 0.5}s`,
              animationDuration: "3s",
            }}
          />
        ))}
      </div>

      <div className="flex justify-between items-center px-6 md:px-12 py-6 z-10 relative backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src="/interviewlablogo.svg"
              alt="InterviewLab Logo"
              className="h-10 w-10 md:h-12 md:w-12 brightness-0 invert"
            />
            <div className="absolute inset-0 bg-white rounded-full opacity-20 blur-sm"></div>
          </div>
          <span className="text-xl md:text-2xl font-bold tracking-tight text-white">
            Interview Lab
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-white/80">
              266 labs created
            </span>
          </div>
          <div className="md:hidden text-sm text-white/60">266 labs</div>
        </div>
      </div>

      <div className="flex-1 z-10 relative flex items-center justify-center px-4">
        <div className="relative flex flex-col gap-8 items-center justify-center text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold leading-tight">
            <span className="block text-white">Practice smarter.</span>
            <span className="block text-gray-300">Interview better.</span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-400 max-w-2xl leading-relaxed">
            Compile code, get AI-powered feedback, and collaborate in real time
            — all in your browser.
          </p>

          <div className="mt-4">
            <CreateRoomButton />
          </div>

          <div className="flex items-center gap-8 mt-8 text-sm text-gray-500"></div>
        </div>
      </div>

      <div className="w-full z-10 relative mt-16 mb-8">
        <Features />
      </div>

      <div className="w-full z-10 relative mt-auto">
        <Footer />
      </div>
    </div>
  );
}
