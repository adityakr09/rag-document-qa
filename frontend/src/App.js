import React, { useState, useRef, useEffect } from "react";
import "./App.css";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

function App() {
  const [file, setFile] = useState(null);
  const [collection, setCollection] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState(null);
  const [sources, setSources] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [asking, setAsking] = useState(false);
  const [uploadMsg, setUploadMsg] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadedCollection, setUploadedCollection] = useState("");
  const [history, setHistory] = useState([]);
  const answerRef = useRef(null);

  useEffect(() => {
    if (answer && answerRef.current) {
      answerRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [answer]);

  const handleUpload = async () => {
    if (!file) return alert("Please select a PDF file");
    if (!collection.trim()) return alert("Please enter a collection name (min 3 chars)");
    setUploading(true);
    setUploadMsg("");
    setUploadSuccess(false);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch(`${API_URL}/upload?collection_name=${collection}`, {
        method: "POST", body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setUploadMsg(`${data.message} · ${data.chunks} chunks indexed`);
        setUploadSuccess(true);
        setUploadedCollection(collection);
      } else {
        setUploadMsg(`Error: ${data.detail}`);
      }
    } catch {
      setUploadMsg("Upload failed. Is the backend running?");
    }
    setUploading(false);
  };

  const handleAsk = async () => {
    if (!question.trim()) return;
    setAsking(true);
    setAnswer(null);
    setSources([]);
    try {
      const res = await fetch(`${API_URL}/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, collection_name: uploadedCollection || collection }),
      });
      const data = await res.json();
      if (res.ok) {
        setAnswer(data.answer);
        setSources(data.sources);
        setHistory(prev => [{ q: question, a: data.answer, s: data.sources }, ...prev.slice(0, 4)]);
        setQuestion("");
      } else {
        setAnswer(`Error: ${data.detail}`);
      }
    } catch {
      setAnswer("Failed to get answer. Is the backend running?");
    }
    setAsking(false);
  };

  return (
    <div className="app">
      {/* Background */}
      <div className="bg-grid" />
      <div className="bg-glow" />

      {/* Header */}
      <header className="header">
        <div className="header-tag">AI-POWERED</div>
        <h1 className="header-title">
          <span className="title-doc">DOC</span>
          <span className="title-sep">×</span>
          <span className="title-qa">Q&A</span>
        </h1>
        <p className="header-sub">Upload any PDF · Ask anything · Get instant answers</p>
        <div className="stack-pills">
          {["LangChain", "ChromaDB", "Groq Llama 3", "FastAPI", "React"].map(t => (
            <span key={t} className="pill">{t}</span>
          ))}
        </div>
      </header>

      <main className="main">
        {/* Upload Card */}
        <div className={`card upload-card ${uploadSuccess ? "success" : ""}`}>
          <div className="card-num">01</div>
          <h2 className="card-title">Upload Document</h2>
          <div className="upload-area">
            <label className="file-label">
              <input type="file" accept=".pdf" onChange={e => setFile(e.target.files[0])} className="file-hidden" />
              <div className="file-box">
                <span className="file-icon">📄</span>
                <span className="file-text">{file ? file.name : "Choose PDF file"}</span>
              </div>
            </label>
            <input
              type="text"
              placeholder="Collection name (e.g. finance, legal)"
              value={collection}
              onChange={e => setCollection(e.target.value)}
              className="input"
            />
            <button onClick={handleUpload} disabled={uploading} className="btn-upload">
              {uploading ? (
                <><span className="spinner" /> Indexing...</>
              ) : "Upload & Index"}
            </button>
          </div>
          {uploadMsg && (
            <div className={`upload-msg ${uploadSuccess ? "ok" : "err"}`}>
              {uploadSuccess ? "✓" : "✗"} {uploadMsg}
            </div>
          )}
        </div>

        {/* Ask Card */}
        <div className="card ask-card">
          <div className="card-num">02</div>
          <h2 className="card-title">Ask Anything</h2>
          <div className="ask-area">
            <input
              type="text"
              placeholder="What is the main topic? Summarize key points..."
              value={question}
              onChange={e => setQuestion(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleAsk()}
              className="ask-input"
            />
            <button onClick={handleAsk} disabled={asking} className="btn-ask">
              {asking ? <span className="spinner white" /> : "→"}
            </button>
          </div>

          {asking && (
            <div className="thinking">
              <span className="dot" /><span className="dot" /><span className="dot" />
              <span className="thinking-text">Retrieving context & generating answer...</span>
            </div>
          )}

          {answer && (
            <div className="answer-box" ref={answerRef}>
              <div className="answer-label">ANSWER</div>
              <p className="answer-text">{answer}</p>
              {sources.length > 0 && (
                <div className="sources">
                  <span className="sources-label">SOURCES</span>
                  {sources.map((s, i) => <span key={i} className="source-tag">{s}</span>)}
                </div>
              )}
            </div>
          )}
        </div>

        {/* History */}
        {history.length > 0 && (
          <div className="card history-card">
            <div className="card-num">03</div>
            <h2 className="card-title">Recent Questions</h2>
            <div className="history-list">
              {history.map((item, i) => (
                <div key={i} className="history-item">
                  <div className="history-q">Q: {item.q}</div>
                  <div className="history-a">{item.a.slice(0, 120)}{item.a.length > 120 ? "..." : ""}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <footer className="footer">
        Built by <strong>Aditya Kumar</strong> · Python Backend & AI Developer
      </footer>
    </div>
  );
}

export default App;