<div align="center">

<img src="./header.svg" width="100%"/>

<br/>

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-Visit_App-f97316?style=for-the-badge)](https://rag-document-qa-lemon.vercel.app/)
[![API Docs](https://img.shields.io/badge/📄_API_Docs-Swagger_UI-ec4899?style=for-the-badge)](https://rag-document-qa-m86f.onrender.com/docs)
[![GitHub](https://img.shields.io/badge/GitHub-adityakr09-181717?style=for-the-badge&logo=github)](https://github.com/adityakr09)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Aditya_Kumar-0A66C2?style=for-the-badge&logo=linkedin)](https://linkedin.com/in/aditya-kumar-O1)

<br/>

![Python](https://img.shields.io/badge/Python_3.11-3776AB?style=flat-square&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=flat-square&logo=fastapi&logoColor=white)
![LangChain](https://img.shields.io/badge/LangChain-1C3C3C?style=flat-square&logo=langchain&logoColor=white)
![ChromaDB](https://img.shields.io/badge/ChromaDB-FF6B35?style=flat-square&logoColor=white)
![React](https://img.shields.io/badge/React_18-61DAFB?style=flat-square&logo=react&logoColor=black)
![Groq](https://img.shields.io/badge/Groq_Llama_3.3-F55036?style=flat-square&logoColor=white)
![HuggingFace](https://img.shields.io/badge/HuggingFace-FFD21E?style=flat-square&logo=huggingface&logoColor=black)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=vercel&logoColor=white)
![Render](https://img.shields.io/badge/Render-46E3B7?style=flat-square&logo=render&logoColor=black)

<br/>

> **Built by — [Aditya Kumar](https://github.com/adityakr09)**

</div>

---

## ✨ What is this?

**RAG Document Q&A** is a production-ready API that lets you **upload any PDF** and instantly ask natural language questions about its content — no hallucinations, only answers grounded in your document.

Under the hood it runs a full **Retrieval-Augmented Generation (RAG)** pipeline:
- 📄 Parses & chunks your PDF intelligently
- 🧠 Embeds chunks using HuggingFace's `all-MiniLM-L6-v2`
- 🗄️ Stores & retrieves vectors with **ChromaDB**
- ⚡ Generates answers with **Groq Llama 3.3-70B** — blazing fast

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────┐
│                   PDF Upload Flow                   │
│                                                     │
│  User uploads PDF                                   │
│        │                                            │
│        ▼                                            │
│  PyPDFLoader ──► splits into chunks                 │
│        │                                            │
│        ▼                                            │
│  HuggingFace Embeddings (all-MiniLM-L6-v2)          │
│        │                                            │
│        ▼                                            │
│  ChromaDB ──► stores vectors (persistent)           │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│                  Question Flow                      │
│                                                     │
│  User asks a question                               │
│        │                                            │
│        ▼                                            │
│  ChromaDB ──► retrieves top 4 relevant chunks       │
│        │                                            │
│        ▼                                            │
│  Groq Llama 3.3-70B ──► generates grounded answer   │
│        │                                            │
│        ▼                                            │
│  FastAPI ──► returns answer + source page numbers   │
└─────────────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Backend** | Python 3.11, FastAPI, Uvicorn | REST API server |
| **RAG Pipeline** | LangChain, LangChain-Groq | Document loading & chaining |
| **Vector DB** | ChromaDB (persistent) | Store & retrieve embeddings |
| **Embeddings** | HuggingFace `all-MiniLM-L6-v2` | Convert text → vectors |
| **LLM** | Groq `llama-3.3-70b-versatile` | Answer generation |
| **Frontend** | React 18 | Upload UI & chat interface |
| **Hosting** | Vercel + Render | Frontend + Backend deploy |

---

## 🚀 Getting Started

### Prerequisites

- Python 3.11+
- Node.js 18+
- Groq API key → [Get one free](https://console.groq.com)

### 1️⃣ Clone the repo

```bash
git clone https://github.com/adityakr09/rag-document-qa.git
cd rag-document-qa
```

### 2️⃣ Backend Setup

```bash
cd backend
cp .env.example .env
# Add your GROQ_API_KEY to .env
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

> 🟢 Backend: `http://localhost:8000` · Swagger Docs: `http://localhost:8000/docs`

### 3️⃣ Frontend Setup

```bash
cd frontend
npm install
npm start
```

> 🟢 Frontend: `http://localhost:3000`

---

## 🌐 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/` | Health check |
| `POST` | `/upload` | Upload a PDF document |
| `POST` | `/ask` | Ask a question about the document |
| `GET` | `/collections` | List all stored collections |
| `DELETE` | `/collections/{name}` | Delete a collection |

### Example Usage

**Upload a PDF:**
```bash
curl -X POST "http://localhost:8000/upload" \
  -H "accept: application/json" \
  -F "file=@your_document.pdf"
```

**Ask a question:**
```bash
curl -X POST "http://localhost:8000/ask" \
  -H "Content-Type: application/json" \
  -d '{"question": "What is the main topic of this document?", "collection": "your_collection"}'
```

**Sample Response:**
```json
{
  "answer": "The document discusses...",
  "source_pages": [2, 5, 11],
  "model": "llama-3.3-70b-versatile"
}
```

---

## 💡 How RAG Works

> [!NOTE]
> **RAG = Retrieval-Augmented Generation** — instead of relying on the LLM's training data, we retrieve relevant context from *your* document and feed it to the model. Answers are always grounded in what you uploaded.

```
Without RAG  →  LLM guesses from training data  →  Hallucinations ❌
With RAG     →  LLM reads YOUR document context  →  Accurate answers ✅
```

---

## 📝 Notes

> [!IMPORTANT]
> A valid **`GROQ_API_KEY`** is required in `.env` for the LLM to work.

> [!NOTE]
> ChromaDB stores vectors **persistently** — your uploaded documents survive server restarts.

> [!WARNING]
> CORS is open (`*`) in development — **restrict to your frontend domain in production**.

---

<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:8b5cf6,50:ec4899,100:f97316&height=120&section=footer" width="100%"/>

**Made with ❤️ by [Aditya Kumar](https://github.com/adityakr09)**

[![GitHub followers](https://img.shields.io/github/followers/adityakr09?style=social)](https://github.com/adityakr09)

</div>
