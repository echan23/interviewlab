import axios from "axios";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
// swap in your preferred icon pack
import { PlusCircleIcon, ArrowRightIcon } from "@heroicons/react/24/outline";

const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY as string;

const CreateRoomButton = () => {
  const navigate = useNavigate();
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
      navigate(`/lab/${data.roomID}`);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-6">
      <Button
        onClick={handleCreateRoom}
        disabled={loading}
        className={`
          flex items-center justify-center space-x-3
          h-16 px-8 md:px-12
          bg-white text-black
          border-2 border-black
          rounded-lg shadow-sm
          transition-all duration-200
          hover:bg-black hover:text-white
          group
          disabled:opacity-50 disabled:cursor-not-allowed
        `}
      >
        {/* new plus icon */}
        <PlusCircleIcon className="h-6 w-6" />

        {/* label */}
        <span className="font-semibold text-lg">
          {loading ? "Creating…" : "Create Room"}
        </span>

        {/* arrow slides on hover */}
        <ArrowRightIcon className="h-5 w-5 transform transition-transform group-hover:translate-x-1" />
      </Button>

      {/* still the standard checkbox reCAPTCHA */}
      <div className="h-[88px] w-full flex justify-center">
        <div style={{ visibility: captchaVisible ? "visible" : "hidden" }}>
          <ReCAPTCHA sitekey={siteKey} onChange={handleCaptchaChange} />
        </div>
      </div>
    </div>
  );
};

export default CreateRoomButton;
