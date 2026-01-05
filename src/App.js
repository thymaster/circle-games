import { useRef, useState } from "react";
import "./styles.css";

const COLORS = ["red", "blue", "green", "orange", "purple"];
const DIAMETER = 50;
const getRandomColor = () => {
  return Math.floor(Math.random() * COLORS.length) + 1;
};

const Circle = ({ clientX, clientY, color }) => {
  const radius = DIAMETER / 2;
  return (
    <span
      style={{
        width: `${DIAMETER}px`,
        height: `${DIAMETER}px`,
        borderRadius: "50%",
        position: "absolute",
        top: clientY - radius,
        left: clientX - radius,
        backgroundColor: `${color}`,
      }}
    ></span>
  );
};

export default function App() {
  const [circles, setCircles] = useState([]);
  const [stacks, setStacks] = useState([]);
  const canvasRef = useRef();

  const generateCircle = (event) => {
    if (canvasRef.current) {
      const { clientX, clientY } = event;
      const rect = canvasRef.current.getBoundingClientRect();
      const _clientX = clientX - rect.left;
      const _clientY = clientY - rect.top;
      const colorIndex = getRandomColor();
      const color = COLORS[colorIndex - 1];

      setCircles((prev) => {
        return [
          ...prev,
          { id: Date.now(), clientX: _clientX, clientY: _clientY, color },
        ];
      });
    }
  };
  
  const undo = () => {
    const lastCircle = circles.pop();
    setStacks((prev) => [...prev, lastCircle]);
    setCircles([...circles]);
  };

  const redo = () => {
    const lastCircle = stacks.pop();
    setCircles((prev) => [...prev, lastCircle]);
    setStacks([...stacks]);
  };

  const reset = () => {
    setCircles([]);
    setStacks([]);
  };

  return (
    <div className="App">
      <div className="container" onClick={generateCircle} ref={canvasRef}>
        {circles.map((ele) => (
          <Circle key={ele.id} {...ele} />
        ))}
      </div>
      <div className="action-area">
        <button disabled={circles.length === 0} onClick={undo}>
          Undo
        </button>
        <button disabled={stacks.length === 0} onClick={redo}>
          Redo
        </button>
        <button disabled={circles.length === 0 && stacks.length === 0} onClick={reset}>
          Reset
        </button>
      </div>
    </div>
  );
}
