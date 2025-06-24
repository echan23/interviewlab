import { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button";

const SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

const CreateRoomButtonWithCaptcha = () => {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  const handleCaptchaVerify = async (token: string | null) => {
    console.log("Received token:", token);

    if (!token) return
    
    try {
      const { data } = await axios.post("http://localhost:8080/api/room/create", {
        captcha: token,
      })
      const roomID = data.roomID
      navigate(`/lab/${roomID}`)
    } catch (error) {
      console.error("Room creation failed:", error)
    } finally {
      setOpen(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Create Room</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md flex flex-col items-center gap-4">
        <DialogHeader>
          <DialogTitle>Verify you're human</DialogTitle>
        </DialogHeader>
        <ReCAPTCHA sitekey={SITE_KEY} onChange={handleCaptchaVerify} />
        <DialogClose asChild>
          <Button variant="ghost">Cancel</Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  )
}

export default CreateRoomButtonWithCaptcha