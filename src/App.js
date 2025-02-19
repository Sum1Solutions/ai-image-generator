import { useState } from "react";

function App() {
  const [text, setText] = useState("");
  const [provider, setProvider] = useState("openai");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateImage = async () => {
    setLoading(true);
    setImage(null);
    setError(null);

    try {
      const response = await fetch(process.env.REACT_APP_WORKER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, provider }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate image.");
      }

      const data = await response.json();
      setImage(data.imageUrl);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ color: "#4F46E5" }}>Tracey's Image-inator</h1>
      <p style={{ marginBottom: "10px" }}>Enter a text prompt and let's create some magic! ✨</p>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter a prompt..."
        rows={3}
        style={{ width: "80%", padding: "10px", fontSize: "16px" }}
      />
      <br /><br />

      <select value={provider} onChange={(e) => setProvider(e.target.value)}
        style={{ padding: "10px", fontSize: "16px", borderRadius: "5px" }}>
        <option value="openai">OpenAI (DALL·E)</option>
        <option value="anthropic">Anthropic (Claude)</option>
      </select>
      <br /><br />

      <button
        onClick={generateImage}
        disabled={loading}
        style={{
          backgroundColor: "#4F46E5", color: "white", padding: "10px 20px", fontSize: "16px",
          borderRadius: "5px", cursor: "pointer", border: "none"
        }}
      >
        {loading ? "Creating Magic..." : "Generate Image"}
      </button>

      {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
      
      {image && (
        <div>
          <h3>Your Magical Creation</h3>
          <img src={image} alt="Generated" width="300px" style={{ borderRadius: "10px", boxShadow: "0px 4px 10px rgba(0,0,0,0.2)" }} />
        </div>
      )}
    </div>
  );
}

export default App;
