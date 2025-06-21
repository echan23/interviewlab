"use client";

import * as React from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import DifficultySelector from "./DifficultySelector";
import CompanySelector from "./CompanySelector";
import ContentSelector from "./ContentSelector";
import { Sparkles, Wand2, Lightbulb } from "lucide-react";

export default function ActionsDropdown() {
  const [open, setOpen] = React.useState(false);
  const [difficulty, setDifficulty] = React.useState("easy");
  const [company, setCompany] = React.useState(" ");
  const [topic, setTopic] = React.useState(" ");

  const handleGenerate = () => {
    console.log({ difficulty, company, topic });
    setOpen(false);
  };

  const handleWeakHint = () => {
    console.log("weak hint");
    setOpen(false);
  };

  const handleStrongHint = () => {
    console.log("strong hint");
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          size="icon"
          variant="secondary"
          className="h-12 w-12 rounded-lg shadow-md p-0 hover:scale-105 transition-transform"
        >
          <Sparkles className="h-7 w-7" />
        </Button>
      </PopoverTrigger>

      <PopoverContent align="start" sideOffset={8} className="w-64 space-y-4">
        {/* Generate section */}
        <div className="space-y-3">
          <DifficultySelector value={difficulty} onChange={setDifficulty} />
          <CompanySelector value={company} onChange={setCompany} />
          <ContentSelector value={topic} onChange={setTopic} />

          <Button
            variant="default"
            className="w-full flex items-center gap-2"
            onClick={handleGenerate}
          >
            <Wand2 className="h-4 w-4" />
            Generate
          </Button>
        </div>

        <div className="flex gap-2 pt-3 border-t">
          <Button
            variant="outline"
            className="flex-1 flex items-center gap-1"
            onClick={handleWeakHint}
          >
            <Lightbulb className="h-4 w-4" />
            Weak
          </Button>
          <Button
            variant="outline"
            className="flex-1 flex items-center gap-1"
            onClick={handleStrongHint}
          >
            <Lightbulb className="h-4 w-4 fill-current" />
            Strong
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
