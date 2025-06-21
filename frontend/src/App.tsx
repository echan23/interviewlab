import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Room from "./pages/Room";
import Home from "./pages/Home";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/lab/:roomID" element={<Room />} />
      </Routes>
    </Router>
  );
}

export default App;
