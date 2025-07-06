import { useParams } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, Share2 } from "lucide-react";
import { useState } from "react";
import ActionsDropdown from "./actiondropdown/ActionsDropdown";
import { RedirectHome } from "./RedirectHome";
import * as monaco from "monaco-editor";
import UserCount from "./UserCount";
import { useTheme } from "@/components/ThemeProvider";

type HeaderProps = {
  editorRef: React.MutableRefObject<monaco.editor.IStandaloneCodeEditor | null>;
  userCount: number;
};

export default function Header({ editorRef, userCount }: HeaderProps) {
  const { roomID } = useParams<{ roomID: string }>();
  const shareURL = `${window.location.origin}/lab/${roomID}`;
  const [copied, setCopied] = useState(false);
  const { theme } = useTheme();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareURL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <header className="relative w-full bg-transparent">
      <div className="flex items-center justify-between px-4 py-2">
        <div className="flex items-center gap-2">
          <div className="relative">
            <RedirectHome />
          </div>

          <div className="relative">
            <ActionsDropdown editorRef={editorRef} />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <UserCount count={userCount} />
            <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="secondary"
                className={`relative flex items-center gap-2 px-3 py-1.5 border rounded-md shadow-sm group transition-all duration-200 hover:scale-105 hover:-translate-y-0.5 ${
                  theme === "dark"
                    ? "bg-[#2d2d30] border-[#3c3c3c] hover:bg-[#094771] hover:border-[#007acc] hover:shadow-lg hover:shadow-black/20 text-[#cccccc]"
                    : "bg-[#f3f3f3] border-[#e5e5e5] hover:bg-[#e8f4fd] hover:border-[#007acc] hover:shadow-md text-[#383a42]"
                }`}
              >
                <Share2
                  className={`h-3.5 w-3.5 group-hover:scale-110 transition-all duration-200 ${
                    theme === "dark"
                      ? "text-[#cccccc]/70 group-hover:text-[#cccccc]"
                      : "text-[#383a42]/70 group-hover:text-[#383a42]"
                  }`}
                />
                <span
                  className={`text-sm font-medium group-hover:tracking-wide transition-all duration-200 ${
                    theme === "dark" ? "text-[#cccccc]" : "text-[#383a42]"
                  }`}
                >
                  {copied ? "Copied!" : "Share"}
                </span>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className={`w-80 border shadow-lg rounded-lg p-1 ${
                theme === "dark"
                  ? "bg-[#252526] border-[#3c3c3c]"
                  : "bg-[#f8f8f8] border-[#e5e5e5]"
              }`}
            >
              <DropdownMenuLabel
                className={`pb-3 pt-2 px-3 font-medium ${
                  theme === "dark" ? "text-[#cccccc]" : "text-[#383a42]"
                }`}
              >
                Share this lab room
              </DropdownMenuLabel>

              <div className="flex items-center gap-3 px-3 pb-3">
                <div className="flex-1">
                  <Input
                    readOnly
                    value={shareURL}
                    className={`text-sm rounded-md focus:ring-2 focus:ring-[#007acc]/20 focus:border-[#007acc]/40 ${
                      theme === "dark"
                        ? "bg-[#2d2d30] border-[#3c3c3c] text-[#cccccc]"
                        : "bg-[#f3f3f3] border-[#e5e5e5] text-[#383a42]"
                    }`}
                    onFocus={(e) => e.currentTarget.select()}
                  />
                </div>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleCopy}
                  className={`shrink-0 rounded-md transition-all duration-200 ${
                    theme === "dark"
                      ? "bg-[#2d2d30] hover:bg-[#094771] border-[#3c3c3c] hover:border-[#007acc]"
                      : "bg-[#f3f3f3] hover:bg-[#e8f4fd] border-[#e5e5e5] hover:border-[#007acc]"
                  }`}
                >
                  <Copy
                    size={16}
                    className={
                      copied
                        ? "text-green-500"
                        : theme === "dark"
                        ? "text-[#cccccc]/70 hover:text-[#cccccc]"
                        : "text-[#383a42]/70 hover:text-[#383a42]"
                    }
                  />
                </Button>
              </div>

              <div className="px-3 pb-2">
                <p
                  className={`text-xs rounded-md px-3 py-2 ${
                    theme === "dark"
                      ? "text-[#cccccc]/70 bg-[#2d2d30]"
                      : "text-[#383a42]/70 bg-[#f3f3f3]"
                  }`}
                >
                  Anyone with this link can join your interview room
                </p>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
