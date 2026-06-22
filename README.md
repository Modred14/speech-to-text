# 🎙️ VoiceScript — Open-Source Speech-to-Text Transcription Tool

> **Final Year Project | MIT Licensed**  
> A full-stack web application that converts spoken audio into editable text using OpenAI's Whisper AI model.

---

## Features

- 🎙️ **Live microphone recording** with real-time waveform animation
- 📁 **Audio file upload** (MP3, WAV, M4A, WebM)
- 🤖 **AI transcription** powered by OpenAI Whisper (runs locally — free)
- 💾 **Save transcriptions** to PostgreSQL database
- 📋 **Copy / Download** transcripts as .txt files
- 🗂️ **History page** to view, copy, download and delete past transcriptions
- 🌑 **Beautiful dark UI** with smooth animations

---

## Tech Stack

| Layer      | Technology                     |
|------------|-------------------------------|
| Frontend   | React + Vite                  |
| Backend    | Python + Flask                |
| AI Model   | OpenAI Whisper (base, local)  |
| Database   | PostgreSQL                    |
| Hosting    | Vercel (frontend) + Railway (backend + DB) |
| Licence    | MIT                           |

---

## Project Structure

```
voicescript/
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── index.css
│   │   ├── main.jsx
│   │   ├── components/
│   │   │   ├── Toast.jsx
│   │   │   └── Waveform.jsx
│   │   ├── hooks/
│   │   │   ├── useRecorder.js
│   │   │   └── useToast.js
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   └── History.jsx
│   │   └── utils/
│   │       └── api.js
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
└── backend/
    ├── app.py
    ├── database.py
    ├── requirements.txt
    └── .env.example
```

---

## Local Setup

### Prerequisites
- Node.js (v18+)
- Python (v3.9+)
- PostgreSQL installed locally

---

### 1. Clone the repo
```bash
git clone https://github.com/yourusername/voicescript.git
cd voicescript
```

---

### 2. Set up the database
Open PostgreSQL and run:
```sql
CREATE DATABASE voicescript;
```

---

### 3. Set up the backend
```bash
cd backend

# Create virtual environment
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # Mac/Linux

# Install dependencies
pip install -r requirements.txt

# Copy and edit environment variables
copy .env.example .env       # Windows
# cp .env.example .env       # Mac/Linux

# Edit .env and set your PostgreSQL password

# Start the backend
python app.py
```

Backend will run at **http://localhost:5000**

> ⚠️ First run will download the Whisper model (~140 MB). This happens once.

---

### 4. Set up the frontend
```bash
cd ../frontend

# Install dependencies
npm install

# Copy env file
copy .env.example .env       # Windows

# Start frontend
npm run dev
```

Frontend will run at **http://localhost:3000**

---

## Deployment

### Frontend → Vercel
1. Push code to GitHub
2. Go to vercel.com → New Project → Import your repo
3. Set Root Directory to `frontend`
4. Add environment variable: `VITE_API_URL=https://your-railway-backend.up.railway.app`
5. Deploy

### Backend + Database → Railway
1. Go to railway.app → New Project
2. Add a PostgreSQL database
3. Deploy the `backend/` folder
4. Set environment variable: `DATABASE_URL` (Railway provides this automatically)

---

## API Endpoints

| Method | Endpoint              | Description                  |
|--------|-----------------------|------------------------------|
| GET    | /health               | Check if backend is running  |
| POST   | /transcribe           | Upload audio, get transcript |
| GET    | /transcriptions       | List all saved transcriptions|
| POST   | /transcriptions       | Save a transcription         |
| DELETE | /transcriptions/{id}  | Delete a transcription       |

---

## Licence

MIT © 2024 — Free to use, modify, and distribute.
# speech-to-text
