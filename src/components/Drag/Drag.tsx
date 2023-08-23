import React, { useContext, useEffect, useRef, useState } from "react";
import { DragContextWrapper, ICoordinates } from "../DragContext/DragContext";

import { motion } from "framer-motion";

export interface DragProps {
  children: React.JSX.Element;
  id: any;
}

const Drag = (props: DragProps) => {
  const {
    currentActive,
    currentOver,
    setCurrentOver,
    setCurrentActive,
    coordinatesOfCursor,
    setCoordinatesOfCursor,
  } = useContext(DragContextWrapper);

  const ref = useRef<HTMLDivElement>(null);
  const placeholder = useRef<HTMLDivElement>(null);
  const container = useRef<HTMLDivElement>(null);

  const isCurrent = props.id === currentActive;

  const updateElementDimensions = () => {
    if (ref.current) {
      setDimensions(ref.current.getBoundingClientRect());
    }
  };

  const [dimensions, setDimensions] = useState<DOMRect>();
  const [initialDimensions, setInitialDimensions] = useState<DOMRect>();

  const commonStyles: React.CSSProperties = {
    boxShadow:
      "0 0 0 calc(1px / var(--scale-x, 1)) rgba(63, 63, 68, 0.05), 0 1px calc(3px / var(--scale-x, 1)) 0 rgba(34, 33, 81, 0.15)",
    margin: 4,
    padding: "18px 20px",
    backgroundColor: "#fff",
    // left: coordinatesOfCursor.X - (dimensions?.width ?? 1) / 2,
    top: coordinatesOfCursor.Y - (dimensions?.height ?? 1) / 2,
  };

  const additionalStyles: React.CSSProperties = isCurrent
    ? {
        position: "absolute",
        cursor: "grabbing",
        width: (initialDimensions?.width ?? 1) - 40,
        zIndex: 20000,
      }
    : { cursor: "grab" };

  const styling: React.CSSProperties = {
    ...commonStyles,
    ...additionalStyles,
  };

  const isOver = currentOver === props.id;

  useEffect(() => {
    updateElementDimensions();
  }, [coordinatesOfCursor]);

  useEffect(() => {
    if (currentActive === "") return;

    if (
      isPointInsideElement(
        coordinatesOfCursor,
        container.current?.getBoundingClientRect()
      )
    ) {
      setCurrentOver(props.id);
    }
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

  useEffect(() => {
    setInitialDimensions(ref.current?.getBoundingClientRect());
  }, []);

  return (
    <>
      <div
        onContextMenu={(e) => {
          e.preventDefault();
        }}
        ref={container}
      >
        <div style={{ width: "100%", height: 2 }}></div>
        <motion.div
          transition={{ duration: 0.5 }}
          ref={ref}
          onMouseDown={(e) => {
            e.preventDefault();
            setCoordinatesOfCursor({ X: e.clientX - 10, Y: e.clientY - 10 });
            setCurrentActive(props.id);
          }}
          onTouchStart={(e) => {
            e.preventDefault();
            setCoordinatesOfCursor({
              X: e.targetTouches[0].clientX,
              Y: e.targetTouches[0].clientY,
            });
            setCurrentActive(props.id);
          }}
          style={styling}
        >
          {JSON.stringify(dimensions?.width)}
          {props.children}
        </motion.div>
        {currentActive !== "" && isOver ? (
          <motion.div
            ref={placeholder}
            initial={{
              height: 0,
              opacity: 0,
            }}
            animate={{
              opacity: 1,
              transition: {
                height: {
                  duration: 0.15,
                },
                opacity: {
                  duration: 0.1,
                },
              },
              borderColor: "#b2bec3",
              borderRadius: 4,
              borderStyle: "dashed",
              height: initialDimensions?.height,
              width: initialDimensions?.width,
              backgroundColor: isOver ? "#b2bec3" : "#dfe6e9",
            }}
          >
            {props.id}
          </motion.div>
        ) : null}
      </div>
    </>
  );
};

function isPointInsideElement(coordinates: ICoordinates, rect?: DOMRect) {
  if (!rect) return false;
  let { X: x, Y: y } = coordinates;
  return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
}

export default Drag;
