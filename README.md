# 📄 RAG Document Q&A API

Upload any PDF and ask questions about it -- powered by LangChain, ChromaDB, and Groq Llama 3.

Built by **Aditya Kumar** | [GitHub](https://github.com/adityakr09) | [LinkedIn](https://linkedin.com/in/aditya-kumar-O1)


## 💻🔴🚀 Live Demo & Documentation

Live Demo: https://rag-document-qa-lemon.vercel.app/

API Documentation: https://rag-document-qa-m86f.onrender.com/docs

---


## 🏗️ Architecture

```
User uploads PDF
      ↓
PyPDFLoader → splits into chunks
      ↓
HuggingFace Embeddings → vectors
      ↓
ChromaDB → stores vectors
      ↓
User asks question
      ↓
ChromaDB → retrieves top 4 relevant chunks
      ↓
Groq Llama 3.3-70B → generates answer
      ↓
FastAPI → returns answer + source pages
```

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Python 3.11, FastAPI, Uvicorn |
| RAG Pipeline | LangChain, LangChain-Groq |
| Vector DB | ChromaDB (persistent) |
| Embeddings | HuggingFace all-MiniLM-L6-v2 |
| LLM | Groq Llama 3.3-70B |
| Frontend | React 18 |

## 🚀 Getting Started

### Prerequisites
- Python 3.11+
- Node.js 18+
- Groq API key (free at https://console.groq.com)

### Backend Setup
```bash
cd backend
cp .env.example .env
# Add your GROQ_API_KEY to .env
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

Backend: http://localhost:8000  
API Docs: http://localhost:8000/docs

### Frontend Setup
```bash
cd frontend
npm install
npm start
```

Frontend: http://localhost:3000

## 🌐 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | / | Health check |
| POST | /upload | Upload PDF document |
| POST | /ask | Ask a question |
| GET | /collections | List all collections |
| DELETE | /collections/{name} | Delete a collection |
