import { useState, useEffect } from "react";
import useToast from "../hooks/useToast";
import Toast from "../components/Toast";
import { getTranscriptions, deleteTranscription } from "../utils/api";

export default function History() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const { toast, showToast } = useToast();

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    setLoading(true);
    try {
      const data = await getTranscriptions();
      setItems(data);
    } catch {
      showToast("⚠️ Could not load history — is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    try {
      await deleteTranscription(id);
      setItems((prev) => prev.filter((i) => i.id !== id));
      showToast("✓ Deleted");
      if (expanded === id) setExpanded(null);
    } catch {
      showToast("⚠️ Could not delete");
    }
  };

  const handleCopy = (e, text) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    showToast("✓ Copied to clipboard");
  };

  const handleDownload = (e, text, id) => {
    e.stopPropagation();
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `transcript-${id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const formatDate = (iso) => {
    const d = new Date(iso);
    return d.toLocaleString("en-GB", {
      day: "numeric", month: "short", year: "numeric",
      hour: "2-digit", minute: "2-digit"
    });
  };

  return (
    <div className="page">
      <div className="hero">
        <div className="hero-eyebrow">
          <span>🗂️</span> Saved Transcriptions
        </div>
        <h1>Your history</h1>
        <p>All transcriptions you've saved are stored here.</p>
      </div>

      {loading && (
        <div style={{ textAlign: "center", color: "var(--muted)", padding: "3rem" }}>
          <div className="spinner" style={{ margin: "0 auto 1rem" }} />
          Loading…
        </div>
      )}

      {!loading && items.length === 0 && (
        <div className="history-empty">
          <div className="empty-icon">🗒️</div>
          <p>No saved transcriptions yet.<br />Go to Transcribe and save one!</p>
        </div>
      )}

      {!loading && items.map((item, i) => (
        <div
          key={item.id}
          className="history-item"
          style={{ animationDelay: `${i * 0.06}s` }}
          onClick={() => setExpanded(expanded === item.id ? null : item.id)}
        >
          <div className="history-item-header">
            <span className="badge">{item.source === "microphone" ? "🎙️ Mic" : "📁 Upload"}</span>
            <span className="history-date">{formatDate(item.created_at)}</span>
          </div>

          <div className="history-preview" style={expanded === item.id ? { WebkitLineClamp: "unset" } : {}}>
            {item.text}
          </div>

          <div className="history-actions" onClick={(e) => e.stopPropagation()}>
            <button className="btn-icon" onClick={(e) => handleCopy(e, item.text)}>📋 Copy</button>
            <button className="btn-icon" onClick={(e) => handleDownload(e, item.text, item.id)}>⬇ Download</button>
            <button className="btn-icon danger" onClick={(e) => handleDelete(e, item.id)}>🗑 Delete</button>
          </div>
        </div>
      ))}

      <Toast toast={toast} />
    </div>
  );
}
