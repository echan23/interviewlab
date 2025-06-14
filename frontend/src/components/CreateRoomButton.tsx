import axios from "axios";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const CreateRoomButton = () => {
  const navigate = useNavigate();
  const handleCreateRoom = async () => {
    try {
      const { data } = await axios.post(
        "http://localhost:8080/api/room/create"
      );
      const roomID = data.roomID;
      console.log("Navigating to room", roomID);
      navigate(`/lab/${roomID}`);
    } catch (err) {
      console.error("Failed to navigate to room", err);
    }
  };

  return <Button onClick={handleCreateRoom}>Create Room</Button>;
};

export default CreateRoomButton;
