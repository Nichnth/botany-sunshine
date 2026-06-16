import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import HomePage from "@/pages/HomePage";
import FSMPage from "@/pages/FSMPage";
import GamePage from "@/pages/GamePage";

function App() {
  return (
    <div className="App min-h-screen bg-[#F4F9F4]">
      <BrowserRouter>
        <Sidebar />
        <main className="lg:ml-72 min-h-screen">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/fsm/:id" element={<FSMPage />} />
            <Route path="/game" element={<GamePage />} />
          </Routes>
        </main>
      </BrowserRouter>
    </div>
  );
}

export default App;
