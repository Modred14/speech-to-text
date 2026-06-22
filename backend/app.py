"""
VoiceScript Backend
-------------------
Flask API using Groq Whisper API (no local model — RAM friendly)
"""

from dotenv import load_dotenv
load_dotenv()

import os
import tempfile
import threading
import time
import requests
from flask import Flask, request, jsonify
from flask_cors import CORS
from groq import Groq
from database import init_db, save_transcription, get_transcriptions, delete_transcription

app = Flask(__name__)
CORS(app)

client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

init_db()

def keep_alive():
    while True:
        time.sleep(840)
        try:
            url = os.environ.get("RENDER_URL", "http://localhost:5000") + "/health"
            requests.get(url, timeout=10)
        except:
            pass

threading.Thread(target=keep_alive, daemon=True).start()


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "model": "groq-whisper"})


@app.route("/transcribe", methods=["POST"])
def transcribe():
    if "audio" not in request.files:
        return jsonify({"error": "No audio file provided"}), 400

    audio_file = request.files["audio"]
    suffix = os.path.splitext(audio_file.filename or ".webm")[1] or ".webm"

    with tempfile.NamedTemporaryFile(suffix=suffix, delete=False) as tmp:
        tmp_path = tmp.name
        audio_file.save(tmp_path)

    try:
        with open(tmp_path, "rb") as f:
            result = client.audio.transcriptions.create(
                file=(os.path.basename(tmp_path), f),
                model="whisper-large-v3-turbo",
                response_format="text"
            )
        text = result.strip() if isinstance(result, str) else result.text.strip()
        return jsonify({"text": text, "language": "auto"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        os.unlink(tmp_path)


@app.route("/transcriptions", methods=["GET"])
def list_transcriptions():
    return jsonify(get_transcriptions())


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