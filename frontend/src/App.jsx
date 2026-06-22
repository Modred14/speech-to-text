import { useState } from "react";
import Home from "./pages/Home";
import History from "./pages/History";
import "./index.css";

export default function App() {
  const [page, setPage] = useState("home");

  return (
    <div className="app">
      <nav className="navbar">
        <div className="nav-brand">
          <span className="nav-icon">🎙️</span>
          <span className="nav-title">VoiceScript</span>
        </div>
        <div className="nav-links">
          <button
            className={`nav-btn ${page === "home" ? "active" : ""}`}
            onClick={() => setPage("home")}
          >
            Transcribe
          </button>
          <button
            className={`nav-btn ${page === "history" ? "active" : ""}`}
            onClick={() => setPage("history")}
          >
            History
          </button>
        </div>
      </nav>

      <main className="main-content">
        {page === "home" ? <Home /> : <History />}
      </main>
    </div>
  );
}
