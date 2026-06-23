const BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

export async function transcribeAudio(blob) {
  const form = new FormData();
  form.append("audio", blob, "recording.webm");

  const res = await fetch(`${BASE}/transcribe`, {
    method: "POST",
    body: form,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Transcription failed");
  }

  return res.json();
}

// ── Local storage helpers ──
export function saveTranscription(text, source) {
  const items = getTranscriptions();
  const newItem = {
    id: Date.now(),
    text,
    source,
    created_at: new Date().toISOString(),
  };
  items.unshift(newItem);
  localStorage.setItem("vs_transcriptions", JSON.stringify(items));
  return newItem;
}

export function getTranscriptions() {
  try {
    return JSON.parse(localStorage.getItem("vs_transcriptions") || "[]");
  } catch {
    return [];
  }
}

export function deleteTranscription(id) {
  const items = getTranscriptions().filter((i) => i.id !== id);
  localStorage.setItem("vs_transcriptions", JSON.stringify(items));
}