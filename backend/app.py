"""
VoiceScript Backend
-------------------
Flask API that handles:
  - POST /transcribe       — receives audio, runs Whisper, returns text
  - GET  /transcriptions   — list saved transcriptions from PostgreSQL
  - POST /transcriptions   — save a transcription
  - DELETE /transcriptions/<id> — delete one

Requirements: see requirements.txt
"""

import os
import tempfile
from flask import Flask, request, jsonify
from flask_cors import CORS
import whisper
from database import init_db, save_transcription, get_transcriptions, delete_transcription
import threading
import requests
import time

app = Flask(__name__)
CORS(app)  # allow requests from React frontend

# Load Whisper model once at startup (base model — fast & free)
print("Loading Whisper model...")
model = whisper.load_model("base")
print("Whisper ready.")

# Initialise database tables
init_db()

def keep_alive():
    while True:
        time.sleep(840)  # ping every 14 minutes
        try:
            requests.get(os.environ.get("RENDER_URL", "http://localhost:5000") + "/health")
        except:
            pass

threading.Thread(target=keep_alive, daemon=True).start()


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "model": "whisper-base"})


@app.route("/transcribe", methods=["POST"])
def transcribe():
    if "audio" not in request.files:
        return jsonify({"error": "No audio file provided"}), 400

    audio_file = request.files["audio"]

    # Save to a temp file so Whisper can read it
    suffix = os.path.splitext(audio_file.filename or ".webm")[1] or ".webm"
    with tempfile.NamedTemporaryFile(suffix=suffix, delete=False) as tmp:
        tmp_path = tmp.name
        audio_file.save(tmp_path)

    try:
        result = model.transcribe(tmp_path)
        text = result["text"].strip()
        return jsonify({
            "text": text,
            "language": result.get("language", "unknown"),
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        os.unlink(tmp_path)


@app.route("/transcriptions", methods=["GET"])
def list_transcriptions():
    items = get_transcriptions()
    return jsonify(items)


@app.route("/transcriptions", methods=["POST"])
def create_transcription():
    data = request.get_json()
    if not data or not data.get("text"):
        return jsonify({"error": "text is required"}), 400

    item = save_transcription(data["text"], data.get("source", "microphone"))
    return jsonify(item), 201


@app.route("/transcriptions/<int:item_id>", methods=["DELETE"])
def remove_transcription(item_id):
    delete_transcription(item_id)
    return jsonify({"deleted": item_id})


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=False)
