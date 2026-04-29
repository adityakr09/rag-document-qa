import os
from dotenv import load_dotenv
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_chroma import Chroma
from langchain_groq import ChatGroq
from langchain_community.embeddings import FastEmbedEmbeddings
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

load_dotenv()
CHROMA_DIR = "./chroma_db"

PROMPT = ChatPromptTemplate.from_template("""
Answer based only on the context. If unsure, say "I don't have enough information."
Context: {context}
Question: {question}
""")

class RAGPipeline:
    def __init__(self):
        self.embeddings = FastEmbedEmbeddings(model_name="BAAI/bge-small-en-v1.5")
        self.llm = ChatGroq(model="llama-3.3-70b-versatile", api_key=os.getenv("GROQ_API_KEY"), temperature=0)
        self.text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)

    def ingest_document(self, pdf_path, collection_name="default"):
        chunks = self.text_splitter.split_documents(PyPDFLoader(pdf_path).load())
        Chroma.from_documents(documents=chunks, embedding=self.embeddings, persist_directory=CHROMA_DIR, collection_name=collection_name)
        return len(chunks)

    def query(self, question, collection_name="default"):
        vectorstore = Chroma(persist_directory=CHROMA_DIR, embedding_function=self.embeddings, collection_name=collection_name)
        docs = vectorstore.as_retriever(search_kwargs={"k": 4}).invoke(question)
        context = "\n\n".join(doc.page_content for doc in docs)
        answer = (PROMPT | self.llm | StrOutputParser()).invoke({"context": context, "question": question})
        sources = list({f"Page {int(doc.metadata.get('page', 0)) + 1}" for doc in docs})
        return {"answer": answer, "sources": sources}

    def list_collections(self):
        import chromadb
        return [c.name for c in chromadb.PersistentClient(path=CHROMA_DIR).list_collections()]

    def delete_collection(self, collection_name):
        import chromadb
        chromadb.PersistentClient(path=CHROMA_DIR).delete_collection(collection_name)
