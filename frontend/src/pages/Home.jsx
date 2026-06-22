import { useState, useRef } from "react";
import useRecorder from "../hooks/useRecorder";
import useToast from "../hooks/useToast";
import Waveform from "../components/Waveform";
import Toast from "../components/Toast";
import { transcribeAudio, saveTranscription } from "../utils/api";

export default function Home() {
  const { recording, audioBlob, seconds, error, start, stop, reset, formatTime } = useRecorder();
  const { toast, showToast } = useToast();

  const [transcript, setTranscript] = useState("");
  const [processing, setProcessing] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [saved, setSaved] = useState(false);

  const fileInputRef = useRef(null);

  const handleTranscribe = async (blob) => {
    setProcessing(true);
    setTranscript("");
    setSaved(false);
    try {
      const data = await transcribeAudio(blob);
      setTranscript(data.text);
    } catch (err) {
      showToast("⚠️ " + err.message);
    } finally {
      setProcessing(false);
    }
  };

  const handleStopAndTranscribe = async () => {
    stop();
    // wait for blob to be set via useEffect
    setTimeout(async () => {
      if (audioBlob) await handleTranscribe(audioBlob);
    }, 300);
  };

  // Watch for blob after stop
  const prevBlob = useRef(null);
  if (audioBlob && audioBlob !== prevBlob.current && !recording) {
    prevBlob.current = audioBlob;
    handleTranscribe(audioBlob);
  }

  const handleFile = (file) => {
    if (!file) return;
    if (!file.type.startsWith("audio/")) {
      showToast("Please upload an audio file.");
      return;
    }
    reset();
    handleTranscribe(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(transcript);
    showToast("✓ Copied to clipboard");
  };

  const handleDownload = () => {
    const blob = new Blob([transcript], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `transcript-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    showToast("✓ Downloaded");
  };

  const handleSave = async () => {
    if (!transcript) return;
    try {
      await saveTranscription(transcript, audioBlob ? "microphone" : "upload");
      setSaved(true);
      showToast("✓ Saved to history");
    } catch {
      showToast("⚠️ Could not save — is the backend running?");
    }
  };

  const handleClear = () => {
    reset();
    setTranscript("");
    setSaved(false);
  };

  const wordCount = transcript ? transcript.trim().split(/\s+/).filter(Boolean).length : 0;

  return (
    <div className="page">
      {/* Hero */}
      <div className="hero">
        <div className="hero-eyebrow">
          <span>🎙️</span> Open-Source · MIT Licensed
        </div>
        <h1>Turn speech into text — instantly</h1>
        <p>Record your microphone or upload an audio file. Powered by Groq AI.</p>
      </div>

      {/* Microphone recorder */}
      <div className="card">
        <div className="card-label">Microphone</div>
        <div className="recorder-center">
          {recording && <div className="timer">{formatTime(seconds)}</div>}
          {recording && <Waveform />}

          <button
            className={`mic-btn ${recording ? "recording" : ""}`}
            onClick={recording ? stop : start}
            disabled={processing}
            title={recording ? "Stop recording" : "Start recording"}
          >
            {recording ? "⏹" : "🎙️"}
          </button>

          <p className={`mic-status ${recording ? "active" : ""}`}>
            {recording
              ? "Recording… tap to stop"
              : processing
              ? "Processing…"
              : "Tap to start recording"}
          </p>
        </div>

        {error && (
          <p style={{ color: "var(--red)", fontSize: "0.85rem", textAlign: "center", marginTop: "1rem" }}>
            {error}
          </p>
        )}
      </div>

      <div className="section-divider">or upload a file</div>

      {/* File upload */}
      <div className="card">
        <div className="card-label">Upload Audio</div>
        <div
          className={`upload-zone ${dragOver ? "drag-over" : ""}`}
          onClick={() => fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="audio/*"
            onChange={(e) => handleFile(e.target.files[0])}
          />
          <div className="upload-icon">📁</div>
          <div className="upload-text">Drop an audio file here, or click to browse</div>
          <div className="upload-hint">MP3, WAV, M4A, WebM — up to 25 MB</div>
        </div>
      </div>

      {/* Processing indicator */}
      {processing && (
        <div className="processing">
          <div className="spinner" />
          <span className="processing-text">Transcribing your audio with Whisper AI…</span>
        </div>
      )}

      {/* Transcript output */}
      {(transcript || (!processing && audioBlob)) && (
        <div className="card" style={{ animationDelay: "0.1s" }}>
          <div className="meta-row">
            <div className="card-label" style={{ margin: 0 }}>Transcript</div>
            {wordCount > 0 && (
              <span className="badge success">{wordCount} words</span>
            )}
            {saved && <span className="badge success">✓ Saved</span>}
          </div>

          <div className="transcript-box">
            {transcript || <span className="transcript-empty">No transcript yet.</span>}
          </div>

          {transcript && (
            <div className="actions">
              <button className="btn btn-primary" onClick={handleCopy}>
                📋 Copy
              </button>
              <button className="btn btn-ghost" onClick={handleDownload}>
                ⬇ Download .txt
              </button>
              {!saved && (
                <button className="btn btn-ghost" onClick={handleSave}>
                  💾 Save to history
                </button>
              )}
              <button className="btn btn-ghost" onClick={handleClear} style={{ marginLeft: "auto" }}>
                ✕ Clear
              </button>
            </div>
          )}
        </div>
      )}

      <Toast toast={toast} />
    </div>
  );
}
