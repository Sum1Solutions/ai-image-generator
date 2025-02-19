import { useState, useEffect } from "react";

function App() {
  const [text, setText] = useState("");
  const [images, setImages] = useState({ openai: null, anthropic: null });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [savedImages, setSavedImages] = useState([]);
  const [options, setOptions] = useState({
    size: "1024x1024",
    style: "vivid",
    quality: "standard"
  });

  // Load saved images from localStorage on component mount
  useEffect(() => {
    const saved = localStorage.getItem('savedImages');
    if (saved) {
      setSavedImages(JSON.parse(saved));
    }
  }, []);

  const generateImages = async () => {
    setLoading(true);
    setImages({ openai: null, anthropic: null });
    setError(null);

    try {
      const response = await fetch(process.env.REACT_APP_WORKER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, options }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate images.");
      }

      const data = await response.json();
      setImages({
        openai: data.openaiImageUrl,
        anthropic: data.anthropicImageUrl
      });

      // Save the generation to history
      const newSavedImages = [data, ...savedImages].slice(0, 20); // Keep last 20 generations
      setSavedImages(newSavedImages);
      localStorage.setItem('savedImages', JSON.stringify(newSavedImages));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const downloadImage = async (url, filename) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = objectUrl;
      link.download = `${filename}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(objectUrl);
    } catch (err) {
      console.error('Failed to download image:', err);
    }
  };

  const ImageDisplay = ({ url, title }) => url && (
    <div style={{ marginBottom: "20px", width: "100%" }}>
      <img 
        src={url} 
        alt={`${title} Generated`} 
        style={{ 
          width: "100%", 
          borderRadius: "10px", 
          boxShadow: "0px 4px 10px rgba(0,0,0,0.2)",
          marginBottom: "10px"
        }} 
      />
      <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
        <button
          onClick={() => window.open(url, '_blank')}
          style={{
            backgroundColor: "#10B981",
            color: "white",
            padding: "8px 16px",
            fontSize: "14px",
            borderRadius: "5px",
            cursor: "pointer",
            border: "none"
          }}
        >
          Open Full Size ↗️
        </button>
        <button
          onClick={() => downloadImage(url, `${title}-${Date.now()}`)}
          style={{
            backgroundColor: "#6366F1",
            color: "white",
            padding: "8px 16px",
            fontSize: "14px",
            borderRadius: "5px",
            cursor: "pointer",
            border: "none"
          }}
        >
          Download 💾
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ 
      display: "flex", 
      minHeight: "100vh",
      margin: 0,
      padding: 0,
      fontFamily: "Arial, sans-serif"
    }}>
      {/* Left Column - DALL-E */}
      <div style={{ 
        flex: 1,
        padding: "20px",
        borderRight: "1px solid #e5e7eb",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        backgroundColor: "#f8fafc",
        overflowY: "auto"
      }}>
        <h2 style={{ color: "#4F46E5", marginBottom: "20px" }}>DALL-E Results</h2>
        {loading ? (
          <div style={{ marginTop: "20px" }}>Generating DALL-E image...</div>
        ) : (
          <ImageDisplay url={images.openai} title="DALL-E" />
        )}
        
        <div style={{ marginTop: "20px", width: "100%" }}>
          <h3 style={{ color: "#4F46E5", marginBottom: "10px" }}>History</h3>
          {savedImages.map((item, index) => (
            <div key={item.id} style={{ marginBottom: "20px" }}>
              <p style={{ fontSize: "14px", color: "#666", marginBottom: "5px" }}>
                {new Date(item.timestamp).toLocaleString()}
              </p>
              <ImageDisplay url={item.openaiImageUrl} title={`DALL-E-${index}`} />
            </div>
          ))}
        </div>
      </div>

      {/* Center Column - Controls */}
      <div style={{ 
        width: "400px",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        backgroundColor: "white",
        overflowY: "auto"
      }}>
        <h1 style={{ color: "#4F46E5", marginBottom: "20px" }}>Tracey's Image-inator</h1>
        <p style={{ marginBottom: "20px", textAlign: "center" }}>Enter a text prompt and let's create some magic! ✨</p>
        
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter a prompt..."
          rows={4}
          style={{ 
            width: "100%", 
            padding: "10px", 
            fontSize: "16px",
            borderRadius: "5px",
            border: "1px solid #e5e7eb",
            marginBottom: "20px"
          }}
        />

        {/* Image Options */}
        <div style={{ width: "100%", marginBottom: "20px" }}>
          <h3 style={{ color: "#4F46E5", marginBottom: "10px" }}>Image Options</h3>
          
          <label style={{ display: "block", marginBottom: "10px" }}>
            Size:
            <select
              value={options.size}
              onChange={(e) => setOptions({ ...options, size: e.target.value })}
              style={{ 
                width: "100%",
                padding: "8px",
                borderRadius: "5px",
                border: "1px solid #e5e7eb"
              }}
            >
              <option value="1024x1024">1024x1024</option>
              <option value="1792x1024">1792x1024 (Landscape)</option>
              <option value="1024x1792">1024x1792 (Portrait)</option>
            </select>
          </label>

          <label style={{ display: "block", marginBottom: "10px" }}>
            Style:
            <select
              value={options.style}
              onChange={(e) => setOptions({ ...options, style: e.target.value })}
              style={{ 
                width: "100%",
                padding: "8px",
                borderRadius: "5px",
                border: "1px solid #e5e7eb"
              }}
            >
              <option value="vivid">Vivid</option>
              <option value="natural">Natural</option>
            </select>
          </label>

          <label style={{ display: "block", marginBottom: "10px" }}>
            Quality:
            <select
              value={options.quality}
              onChange={(e) => setOptions({ ...options, quality: e.target.value })}
              style={{ 
                width: "100%",
                padding: "8px",
                borderRadius: "5px",
                border: "1px solid #e5e7eb"
              }}
            >
              <option value="standard">Standard</option>
              <option value="hd">HD</option>
            </select>
          </label>
        </div>

        <button
          onClick={generateImages}
          disabled={loading}
          style={{
            backgroundColor: "#4F46E5",
            color: "white",
            padding: "12px 24px",
            fontSize: "16px",
            borderRadius: "5px",
            cursor: loading ? "not-allowed" : "pointer",
            border: "none",
            opacity: loading ? 0.7 : 1,
            transition: "opacity 0.2s"
          }}
        >
          {loading ? "Creating Magic..." : "Generate Images"}
        </button>

        {error && (
          <p style={{ 
            color: "red", 
            marginTop: "20px",
            textAlign: "center",
            padding: "10px",
            backgroundColor: "#fee2e2",
            borderRadius: "5px",
            width: "100%"
          }}>
            {error}
          </p>
        )}
      </div>

      {/* Right Column - Claude */}
      <div style={{ 
        flex: 1,
        padding: "20px",
        borderLeft: "1px solid #e5e7eb",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        backgroundColor: "#f8fafc",
        overflowY: "auto"
      }}>
        <h2 style={{ color: "#4F46E5", marginBottom: "20px" }}>Claude Results</h2>
        {loading ? (
          <div style={{ marginTop: "20px" }}>Generating Claude image...</div>
        ) : (
          <ImageDisplay url={images.anthropic} title="Claude" />
        )}

        <div style={{ marginTop: "20px", width: "100%" }}>
          <h3 style={{ color: "#4F46E5", marginBottom: "10px" }}>History</h3>
          {savedImages.map((item, index) => (
            <div key={item.id} style={{ marginBottom: "20px" }}>
              <p style={{ fontSize: "14px", color: "#666", marginBottom: "5px" }}>
                {new Date(item.timestamp).toLocaleString()}
              </p>
              <ImageDisplay url={item.anthropicImageUrl} title={`Claude-${index}`} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
