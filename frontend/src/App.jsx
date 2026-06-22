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
  <div className="nav-logo">
    <span className="logo-v">V</span>
    <span className="logo-s">S</span>
  </div>
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
