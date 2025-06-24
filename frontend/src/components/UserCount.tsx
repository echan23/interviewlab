import React from "react";
import { User } from "lucide-react";

interface UserCountProps {
  count: number;
}

export default function UserCount({ count }: UserCountProps) {
  return (
    <div className="flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-2 shadow-md hover:scale-105 transition-transform mr-3">
      <User className="w-4 h-4 text-gray-600" />
      <span className="text-sm font-medium text-indigo-600">{count}</span>
    </div>
  );
}
