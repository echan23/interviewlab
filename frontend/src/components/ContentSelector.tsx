import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

type ContentSelectorProps = {
  value: string;
  onChange: (value: string) => void;
};

export default function ContentSelector({
  value,
  onChange,
}: ContentSelectorProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select topic" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value=" ">Random Question</SelectItem>
        <SelectItem value="array">Array</SelectItem>
        <SelectItem value="string">String</SelectItem>
        <SelectItem value="hashmap">Hash Map / Set</SelectItem>
        <SelectItem value="two-pointers">Two Pointers</SelectItem>
        <SelectItem value="sliding-window">Sliding Window</SelectItem>
        <SelectItem value="stack">Stack</SelectItem>
        <SelectItem value="linked-list">Linked List</SelectItem>
        <SelectItem value="binary-tree">Binary Tree</SelectItem>
        <SelectItem value="heap">Heap / Priority Queue</SelectItem>
        <SelectItem value="graph">Graph</SelectItem>
        <SelectItem value="backtracking">Backtracking</SelectItem>
        <SelectItem value="dynamic-programming">Dynamic Programming</SelectItem>
        <SelectItem value="greedy">Greedy</SelectItem>
        <SelectItem value="trie">Trie</SelectItem>
        <SelectItem value="union-find">Union Find</SelectItem>
        <SelectItem value="bit-manipulation">Bit Manipulation</SelectItem>
        <SelectItem value="math">Math</SelectItem>
        <SelectItem value="recursion">Recursion</SelectItem>
      </SelectContent>
    </Select>
  );
}
