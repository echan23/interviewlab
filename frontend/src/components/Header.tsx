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

//EditorRef gets drilled two levels from Room.tsx -> Header.tsx -> ActionsDropdown.tsx
type HeaderProps = {
  editorRef: React.MutableRefObject<monaco.editor.IStandaloneCodeEditor | null>;
};

export default function Header({ editorRef }: HeaderProps) {
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
    <header className="flex items-center justify-between px-3 py-1">
      {/* left group */}
      <div className="flex items-center gap-2">
        <RedirectHome />
        <ActionsDropdown editorRef={editorRef} />
      </div>

      {/* right share button */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="secondary"
            className="flex items-center gap-2 rounded-lg shadow-md hover:scale-105 transition-transform"
          >
            <Share2 className="h-4 w-4" />
            {copied ? "Copied!" : "Share"}
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-80">
          <DropdownMenuLabel className="pb-2">
            Share this room
          </DropdownMenuLabel>
          <div className="flex items-center gap-2 px-2 pb-2">
            <Input
              readOnly
              value={shareURL}
              className="flex-1 text-sm"
              onFocus={(e) => e.currentTarget.select()}
            />
            <Button
              variant="outline"
              size="icon"
              onClick={handleCopy}
              className="shrink-0"
            >
              <Copy size={16} />
            </Button>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
