import axios from "axios";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";

const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY as string;

const CreateRoomButton = () => {
  const navigate = useNavigate();
  const captchaRef = useRef<ReCAPTCHA>(null);
  const [captchaVisible, setCaptchaVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCreateRoom = () => {
    setCaptchaVisible(true);
  };

  const handleCaptchaChange = async (token: string | null) => {
    if (!token) return;
    setLoading(true);
    try {
      const { data } = await axios.post(
        "http://localhost:8080/api/room/create",
        { captchaToken: token }
      );
      const roomID = data.roomID;
      navigate(`/lab/${roomID}`);
    } catch (err) {
      console.error("Failed to navigate to room", err);
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <Button
        className="rounded-full px-8 py-4 text-lg font-semibold shadow-md shadow-black/10 ring-1 ring-black/10 bg-neutral-900 text-white hover:bg-neutral-800 transition"
        onClick={handleCreateRoom}
        disabled={loading}
      >
        {loading ? "Loading..." : "Create Room"}
      </Button>

      <div className="h-[80px] w-full flex justify-center">
        <div style={{ visibility: captchaVisible ? "visible" : "hidden" }}>
          <ReCAPTCHA sitekey={siteKey} onChange={handleCaptchaChange} />
        </div>
      </div>
    </div>
  );
};

export default CreateRoomButton;
