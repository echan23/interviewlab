import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FlaskConical } from "lucide-react";

export function RedirectHome() {
  const navigate = useNavigate();

  return (
    <Button
      size="icon"
      variant="secondary"
      onClick={() => navigate("/")}
      className="h-12 w-12 rounded-lg shadow-md hover:scale-105 transition-transform"
    >
      <FlaskConical className="h-7 w-7" />
    </Button>
  );
}
