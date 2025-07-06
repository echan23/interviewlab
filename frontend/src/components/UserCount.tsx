import { User } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";

interface UserCountProps {
  count: number;
}

export default function UserCount({ count }: UserCountProps) {
  const { theme } = useTheme();

  return (
    <div
      className={`flex items-center gap-2 rounded-lg px-3 py-2 shadow-md mr-3 ${
        theme === "dark"
          ? "bg-[#2d2d30] border border-[#3c3c3c]"
          : "bg-[#f3f3f3] border border-[#e5e5e5]"
      }`}
    >
      <User
        className={`w-4 h-4 ${
          theme === "dark" ? "text-[#cccccc]/70" : "text-[#383a42]/70"
        }`}
      />
      <span className="text-sm font-medium text-green-500">{count}</span>
    </div>
  );
}
