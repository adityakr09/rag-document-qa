from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
import os
import tempfile
import shutil

from rag import RAGPipeline

load_dotenv()

app = FastAPI(title="RAG Document Q&A API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

rag = RAGPipeline()

class QuestionRequest(BaseModel):
    question: str
    collection_name: str = "default"

class QuestionResponse(BaseModel):
    answer: str
    sources: list[str]
    collection_name: str

@app.get("/")
def root():
    return {"status": "ok", "message": "RAG Document Q&A API — LangChain + ChromaDB + Groq ✅"}

@app.post("/upload")
async def upload_document(
    file: UploadFile = File(...),
    collection_name: str = "default"
):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported")

    with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
        shutil.copyfileobj(file.file, tmp)
        tmp_path = tmp.name

    try:
        chunk_count = rag.ingest_document(tmp_path, collection_name)
        return {
            "message": f"Document '{file.filename}' ingested successfully",
            "chunks": chunk_count,
            "collection_name": collection_name
        }
    finally:
        os.unlink(tmp_path)

@app.post("/ask", response_model=QuestionResponse)
async def ask_question(request: QuestionRequest):
    if not request.question.strip():
        raise HTTPException(status_code=400, detail="Question cannot be empty")

    result = rag.query(request.question, request.collection_name)

    return QuestionResponse(
        answer=result["answer"],
        sources=result["sources"],
        collection_name=request.collection_name
    )

@app.get("/collections")
def list_collections():
    collections = rag.list_collections()
    return {"collections": collections}

@app.delete("/collections/{collection_name}")
def delete_collection(collection_name: str):
    rag.delete_collection(collection_name)
    return {"message": f"Collection '{collection_name}' deleted"}
