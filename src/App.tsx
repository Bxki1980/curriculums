import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./Landing";
import Curriculum from "./Curriculum";
import "./App.css";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/curriculum/:id" element={<Curriculum />} />
        {/* temporary catch-all so you always see something */}
        <Route path="*" element={<Landing />} />
      </Routes>
    </BrowserRouter>
  );
}
