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

//EditorRef gets drilled two levels from Room.tsx -> Header.tsx -> ActionsDropdown.tsx
type HeaderProps = {
  editorRef: React.MutableRefObject<monaco.editor.IStandaloneCodeEditor | null>;
  userCount: number;
};

export default function Header({ editorRef, userCount }: HeaderProps) {
  const { roomID } = useParams<{ roomID: string }>();
  const shareURL = `${window.location.origin}/lab/${roomID}`;
  const [copied, setCopied] = useState(false);

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
      {/* Main content */}
      <div className="flex items-center justify-between px-4 py-2">
        {/* Left action buttons */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <RedirectHome />
          </div>

          <div className="relative">
            <ActionsDropdown editorRef={editorRef} />
          </div>
        </div>

        {/* Right components */}
        <div className="flex items-center gap-2">
          {/* User count with enhanced styling */}
          <div className="relative">
            <UserCount count={userCount} />
            {/* Live indicator */}
            <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          </div>

          {/* Enhanced Share button */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="secondary"
                className="relative flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-md shadow-sm hover:shadow-md hover:bg-gray-50 group"
              >
                <Share2 className="h-3.5 w-3.5 text-gray-600 group-hover:text-gray-800" />
                <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                  {copied ? "Copied!" : "Share"}
                </span>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="w-80 bg-white border border-gray-200 shadow-lg rounded-lg p-1"
            >
              <DropdownMenuLabel className="pb-3 pt-2 px-3 text-gray-800 font-medium">
                Share this lab room
              </DropdownMenuLabel>

              <div className="flex items-center gap-3 px-3 pb-3">
                <div className="flex-1">
                  <Input
                    readOnly
                    value={shareURL}
                    className="text-sm bg-gray-50 border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/40"
                    onFocus={(e) => e.currentTarget.select()}
                  />
                </div>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleCopy}
                  className="shrink-0 bg-white hover:bg-gray-50 border-gray-200 rounded-md"
                >
                  <Copy
                    size={16}
                    className={
                      copied
                        ? "text-green-600"
                        : "text-gray-600 hover:text-gray-800"
                    }
                  />
                </Button>
              </div>

              {/* Additional info */}
              <div className="px-3 pb-2">
                <p className="text-xs text-gray-500 bg-gray-50 rounded-md px-3 py-2">
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
