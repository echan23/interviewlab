import { Moon, Sun } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "@/components/ThemeProvider";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const isDark = theme === "dark";

  return (
    <div className="flex items-center space-x-2 mr-3">
      <Switch
        checked={isDark}
        onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
        className="relative w-12 h-6 bg-muted rounded-full transition-all duration-200 border border-border hover:scale-105 hover:shadow-md hover:border-primary/50 group"
      >
        <Sun className="absolute left-1 top-1/2 -translate-y-1/2 w-4 h-4 text-yellow-500 pointer-events-none group-hover:scale-110 group-hover:rotate-12 transition-all duration-200" />
        <Moon className="absolute right-1 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 dark:text-slate-300 pointer-events-none group-hover:scale-110 group-hover:-rotate-12 transition-all duration-200" />
      </Switch>
    </div>
  );
}
