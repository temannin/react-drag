import React, { useContext, useEffect, useRef, useState } from "react";
import { DragContextWrapper, ICoordinates } from "../DragContext/DragContext";

export interface DragProps {
  children: React.JSX.Element;
  id: string;
}

const Drag = (props: DragProps) => {
  const {
    currentActive,
    setCurrentActive,
    coordinatesOfCursor,
    setCoordinatesOfCursor,
  } = useContext(DragContextWrapper);

  const ref = useRef<HTMLDivElement>(null);
  const isCurrent = props.id === currentActive;

  const updateElementDimensions = () => {
    if (ref.current) {
      setDimensions(ref.current.getBoundingClientRect());
    }
  };

  const [dimensions, setDimensions] = useState<DOMRect>();

  const isOver = (function () {
    if (isCurrent) return false;
    return isPointInsideElement(coordinatesOfCursor, dimensions);
  })();

  function isPointInsideElement(coordinates: ICoordinates, rect?: DOMRect) {
    if (!rect) return false;
    let { X: x, Y: y } = coordinates;
    return (
      x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom
    );
  }

  const commonStyles: React.CSSProperties = {
    border: `8px solid ${isOver && !isCurrent ? "green" : "red"}`,
    margin: 4,
  };

  const additionalStyles: React.CSSProperties = isCurrent
    ? {
        left: coordinatesOfCursor.X,
        top: coordinatesOfCursor.Y,
        position: "absolute",
        cursor: "grabbing",
      }
    : { cursor: "grab" };

  const styling: React.CSSProperties = {
    ...commonStyles,
    ...additionalStyles,
  };

  useEffect(() => {
    updateElementDimensions();
  }, [coordinatesOfCursor]);

  useEffect(() => {
    // Initial update
    updateElementDimensions();
    // Update the dimensions when the window is resized
    window.addEventListener("resize", updateElementDimensions);
    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener("resize", updateElementDimensions);
    };
  }, []);

  return (
    <div
      ref={ref}
      onMouseDown={(e) => {
        e.preventDefault();
        setCurrentActive(props.id);
        setCoordinatesOfCursor({ X: e.clientX - 10, Y: e.clientY - 10 });
      }}
      style={styling}
    >
      {JSON.stringify(dimensions)}
      {props.children}
    </div>
  );
};

export default Drag;
