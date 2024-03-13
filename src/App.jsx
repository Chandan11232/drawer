import { useState, useRef, useEffect } from "react";

function App() {
  const [color, setColor] = useState("#000000"); // Default text/drawing color
  const [background, setBackground] = useState("#FFFFFF"); // Background color of the canvas
  const [font, setFont] = useState(16); // Font size for text input and drawing line width
  const [isDrawing, setIsDrawing] = useState(false); // Track drawing state
  const [mode, setMode] = useState("draw"); // 'draw' or 'text' mode
  const canvasRef = useRef(null);
  const [texts, setTexts] = useState([]); // Store texts with their positions

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    const context = canvas.getContext("2d");
    // Set background
    context.fillStyle = background;
    context.fillRect(0, 0, canvas.width, canvas.height);
    // Redraw texts after background change
    texts.forEach((textItem) => {
      context.fillStyle = textItem.color;
      context.font = `${textItem.font}px Arial`;
      context.fillText(textItem.text, textItem.x, textItem.y);
    });
  }, [background, texts]);

  const startDrawing = (e) => {
    if (mode !== "draw") return;
    const { offsetX, offsetY } = e.nativeEvent;
    setIsDrawing(true);
    const context = canvasRef.current.getContext("2d");
    context.beginPath();
    context.moveTo(offsetX, offsetY);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const { offsetX, offsetY } = e.nativeEvent;
    const context = canvasRef.current.getContext("2d");
    context.lineTo(offsetX, offsetY);
    context.strokeStyle = color;
    context.lineWidth = font;
    context.stroke();
  };

  const stopDrawing = () => {
    if (mode !== "draw") return;
    setIsDrawing(false);
    const context = canvasRef.current.getContext("2d");
    context.closePath();
  };

  // Handling text input on canvas click
  const handleCanvasClick = (e) => {
    if (mode !== "text") return;
    const text = prompt("Enter your text:");
    if (text) {
      const { offsetX, offsetY } = e.nativeEvent;
      const context = canvasRef.current.getContext("2d");
      context.textAlign = "center"; // Center text horizontally around the click
      context.textBaseline = "middle"; // Center text vertically around the click
      context.fillStyle = color;
      context.font = `${font}px Arial`;
      context.fillText(text, offsetX, offsetY);
      setTexts([...texts, { text, color, font, x: offsetX, y: offsetY }]);
    }
  };

  // Inside return statement of App component
  return (
    <>
      <div className="w-full mx-auto p-20 bg-black/50 h-screen">
        {/* Control Elements */}
        <div className="flex items-center justify-between mb-4">
          {/* Color picker */}
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
          />
          {/* Background color picker */}
          <input
            type="color"
            value={background}
            onChange={(e) => setBackground(e.target.value)}
          />
          {/* Font size selector */}
          <input
            type="number"
            value={font}
            onChange={(e) => setFont(parseInt(e.target.value, 10))}
          />
          {/* Mode toggle */}
          <button onClick={() => setMode(mode === "draw" ? "text" : "draw")}>
            Mode: {mode === "draw" ? "Drawing" : "Text"}
          </button>
        </div>
        {/* Canvas */}
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onClick={handleCanvasClick}
          className="border-2 border-black"
          style={{
            width: "100%",
            height: "80vh",
            cursor: mode === "draw" ? "crosshair" : "text",
          }}
        ></canvas>
      </div>
    </>
  );
}

export default App;
