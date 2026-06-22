# VoiceScript — Open-Source Speech-to-Text Transcription Tool

> **Project | MIT Licensed**  
> A full-stack web application that converts spoken audio into editable text using Groq's Whisper Large v3 Turbo API.

---

## Features

- **Live microphone recording** with real-time waveform animation
- **Audio file upload** (MP3, WAV, M4A, WebM)
- **AI transcription** powered by Groq Whisper Large v3 Turbo (free API)
- **Save transcriptions** to PostgreSQL database (Neon)
- **Copy / Download** transcripts as .txt files
- **History page** to view, copy, download and delete past transcriptions
- **Beautiful dark UI** with smooth animations

---

## Tech Stack

| Layer      | Technology                              |
|------------|-----------------------------------------|
| Frontend   | React + Vite                            |
| Backend    | Python + Flask                          |
| AI Model   | Groq Whisper Large v3 Turbo (free API)  |
| Database   | PostgreSQL (Neon)                       |
| Hosting    | Netlify (frontend) + Render (backend)   |
| Licence    | MIT                                     |

---

## Project Structure

```
speech-to-text/
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
- A free Groq API key from console.groq.com
- A free Neon PostgreSQL database from neon.tech

---

### 1. Clone the repo
```bash
git clone https://github.com/yourusername/voicescript.git
cd speech-to-text
```

---

### 2. Set up the backend
```bash
cd backend

# Create virtual environment
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # Mac/Linux

# Install dependencies
pip install setuptools
pip install -r requirements.txt

# Copy and edit environment variables
copy .env.example .env       # Windows
# cp .env.example .env       # Mac/Linux

# Fill in your GROQ_API_KEY and DATABASE_URL in .env

# Start the backend
python app.py
```

Backend will run at **http://localhost:5000**

---

### 3. Set up the frontend
```bash
cd ../frontend

# Install dependencies
npm install

# Copy env file
copy .env.example .env       # Windows

# Set VITE_API_URL=http://localhost:5000 in .env

# Start frontend
npm run dev
```

Frontend will run at **http://localhost:3000**

---

## Environment Variables

### Backend (.env)
```
DATABASE_URL=your-neon-postgresql-connection-string
GROQ_API_KEY=your-groq-api-key
RENDER_URL=https://your-render-service.onrender.com
PORT=5000
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000
```

---

## Deployment

### Frontend → Netlify
1. Push code to GitHub
2. Go to netlify.com → Add new site → Import from GitHub
3. Set Base directory to `frontend`
4. Set Build command to `npm run build`
5. Set Publish directory to `frontend/dist`
6. Add environment variable: `VITE_API_URL=https://your-render-service.onrender.com`
7. Deploy

### Backend → Render
1. Go to render.com → New Web Service → Connect GitHub repo
2. Set Root Directory to `backend`
3. Set Build Command to `pip install setuptools && pip install -r requirements.txt`
4. Set Start Command to `python app.py`
5. Add environment variables: `DATABASE_URL`, `GROQ_API_KEY`, `RENDER_URL`
6. Deploy

---

## API Endpoints

| Method | Endpoint              | Description                   |
|--------|-----------------------|-------------------------------|
| GET    | /health               | Check if backend is running   |
| POST   | /transcribe           | Upload audio, get transcript  |
| GET    | /transcriptions       | List all saved transcriptions |
| POST   | /transcriptions       | Save a transcription          |
| DELETE | /transcriptions/{id}  | Delete a transcription        |

---

## Licence

MIT © 2024 — Free to use, modify, and distribute.