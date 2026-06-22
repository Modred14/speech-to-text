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

  return res.json(); // { text, words, duration }
}

export async function saveTranscription(text, source) {
  const res = await fetch(`${BASE}/transcriptions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, source }),
  });

  if (!res.ok) throw new Error("Failed to save");
  return res.json();
}

export async function getTranscriptions() {
  const res = await fetch(`${BASE}/transcriptions`);
  if (!res.ok) throw new Error("Failed to load");
  return res.json();
}

export async function deleteTranscription(id) {
  const res = await fetch(`${BASE}/transcriptions/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete");
  return res.json();
}
