"use client";

import * as React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import DifficultySelector from "./DifficultySelector";
import { useState } from "react";
import CompanySelector from "./CompanySelector";
import { Button } from "./ui/button";
import ContentSelector from "./ContentSelector";

export default function GeneratePopover() {
  const [difficulty, setDifficulty] = useState("easy");
  const [selectedCompany, setSelectedCompany] = useState(" ");
  const [selectedTopic, setSelectedTopic] = useState(" ");

  /*const handleGenerate = () => {
    console.log({ difficulty, type, company });
    // call API or trigger logic here
  };*/

  return (
    <Popover>
      <PopoverTrigger>
        <Button variant="default">Generate</Button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="space-y-4">
          <DifficultySelector value={difficulty} onChange={setDifficulty} />
          <CompanySelector
            value={selectedCompany}
            onChange={setSelectedCompany}
          />
          <ContentSelector value={selectedTopic} onChange={setSelectedTopic} />
          <Button variant="outline">Generate Question</Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
