import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FlaskConical } from "lucide-react";

export function RedirectHome() {
  const navigate = useNavigate();

  return (
    <Button
      size="icon"
      variant="ghost"
      onClick={() => navigate("/")}
      className="h-12 w-12 rounded-lg bg-transparent hover:bg-transparent hover:text-inherit hover:shadow-none hover:ring-0"
    >
      <FlaskConical className="h-7 w-7" />
    </Button>
  );
}
