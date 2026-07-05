import React, { useEffect, useRef, useState } from "react";

function Scratchpad() {
  const canvasRef = useRef(null);
  const isDrawingRef = useRef(false);
  const [penColor, setPenColor] = useState("black");

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    context.lineWidth = 4;
    context.lineCap = "round";
    context.lineJoin = "round";
    context.strokeStyle = "#111827";
  }, []);

  function getCanvasPoint(event) {
    const canvas = canvasRef.current;
    const rectangle = canvas.getBoundingClientRect();

    return {
      x: ((event.clientX - rectangle.left) / rectangle.width) * canvas.width,
      y: ((event.clientY - rectangle.top) / rectangle.height) * canvas.height
    };
  }

  function startDrawing(event) {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    const point = getCanvasPoint(event);

    context.strokeStyle = penColor === "red" ? "#dc2626" : "#111827";
    context.beginPath();
    context.moveTo(point.x, point.y);

    isDrawingRef.current = true;
  }

  function draw(event) {
    if (!isDrawingRef.current) {
      return;
    }

    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    const point = getCanvasPoint(event);

    context.lineTo(point.x, point.y);
    context.stroke();
  }

  function stopDrawing() {
    isDrawingRef.current = false;
  }

  function clearScratchpad() {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    context.clearRect(0, 0, canvas.width, canvas.height);
  }

  return (
    <section className="page">
      <div className="page-title-row">
        <div>
          <h2>Scratchpad</h2>
          <p>Use this area for quick rough work, reminders, or math practice.</p>
        </div>

        <button className="danger-button" onClick={clearScratchpad} type="button">
          Clear
        </button>
      </div>

      <div className="drawing-toolbar">
        <button
          className={penColor === "black" ? "primary-button" : "secondary-button"}
          onClick={() => setPenColor("black")}
          type="button"
        >
          Black Pen
        </button>

        <button
          className={penColor === "red" ? "primary-button" : "secondary-button"}
          onClick={() => setPenColor("red")}
          type="button"
        >
          Red Pen
        </button>
      </div>

      <canvas
        ref={canvasRef}
        className="drawing-canvas"
        width="1000"
        height="560"
        onPointerDown={startDrawing}
        onPointerMove={draw}
        onPointerUp={stopDrawing}
        onPointerLeave={stopDrawing}
      />
    </section>
  );
}

export default Scratchpad;
