"use client";

import * as React from "react";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export default function GeneratePopover() {
  const [difficulty, setDifficulty] = React.useState("easy");
  const [type, setType] = React.useState("random");
  const [company, setCompany] = React.useState("");

  const handleGenerate = () => {
    console.log({ difficulty, type, company });
    // call API or trigger logic here
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Generate</Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 space-y-4">
        {/* Difficulty */}
        <div>
          <label className="text-sm font-medium block mb-1">Difficulty</label>
          <Select value={difficulty} onValueChange={setDifficulty}>
            <SelectTrigger>
              <SelectValue placeholder="Select difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="easy">Easy</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="hard">Hard</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Type */}
        <div>
          <label className="text-sm font-medium block mb-1">Type</label>
          <Select value={type} onValueChange={setType}>
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="random">Random</SelectItem>
              <SelectItem value="data-structures">Data Structures</SelectItem>
              <SelectItem value="algorithms">Algorithms</SelectItem>
              <SelectItem value="system-design">System Design</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Company */}
        <div>
          <label className="text-sm font-medium block mb-1">
            Company (optional)
          </label>
          <Select value={company} onValueChange={setCompany}>
            <SelectTrigger>
              <SelectValue placeholder="None" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">None</SelectItem>
              <SelectItem value="google">Google</SelectItem>
              <SelectItem value="amazon">Amazon</SelectItem>
              <SelectItem value="meta">Meta</SelectItem>
              <SelectItem value="microsoft">Microsoft</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button onClick={handleGenerate} className="w-full">
          Generate
        </Button>
      </PopoverContent>
    </Popover>
  );
}
