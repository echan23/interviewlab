import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Header() {
  return (
    <header className="flex items-center justify-between p-1 ml-1 mr-1">
      <h1 className="text-xl font-semibold">@interviewlab</h1>
      <div className="flex gap-2">
        <Button>Login</Button>
      </div>
    </header>
  );
}
