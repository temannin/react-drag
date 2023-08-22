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
  const [isOver, setIsOver] = useState(false);

  const updateElementDimensions = () => {
    if (ref.current) {
      setDimensions(ref.current.getBoundingClientRect());
    }
  };

  const [dimensions, setDimensions] = useState<DOMRect>();
  const [initialDimensions, setInitialDimensions] = useState<DOMRect>();

  useEffect(() => {
    if (currentActive === "") {
      setIsOver(false);
    } else {
      setIsOver(
        isPointInsideElement(
          coordinatesOfCursor,
          container.current?.getBoundingClientRect()
        )
      );
    }
  }, [coordinatesOfCursor, dimensions, currentActive]);

  useEffect(() => {
    if (isOver) {
      setCurrentOver(props.id);
    }
  }, [isOver]);

  const commonStyles: React.CSSProperties = {
    border: `8px solid red`,
    margin: 4,
  };

  const additionalStyles: React.CSSProperties = isCurrent
    ? {
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

  useEffect(() => {
    setInitialDimensions(ref.current?.getBoundingClientRect());
  }, []);

  return (
    <>
      <div ref={container}>
        <motion.div
          animate={{
            left: coordinatesOfCursor.X,
            top: coordinatesOfCursor.Y,
          }}
          transition={{ duration: 0.05 }}
          ref={ref}
          onMouseDown={(e) => {
            e.preventDefault();
            setCoordinatesOfCursor({ X: e.clientX - 10, Y: e.clientY - 10 });
            setCurrentActive(props.id);
          }}
          onTouchStart={(e) => {
            e.preventDefault();
            setCoordinatesOfCursor({
              X: e.targetTouches[0].clientX - 10,
              Y: e.targetTouches[0].clientY - 10,
            });
            setCurrentActive(props.id);
          }}
          style={styling}
        >
          {props.children}
        </motion.div>
        {currentActive !== "" ? (
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
                  duration: 0.1,
                },
                opacity: {
                  duration: 0.25,
                  delay: 0.15,
                },
              },
              borderStyle: "dashed",
              height: initialDimensions?.height,
              width: initialDimensions?.width,
              backgroundColor: isOver ? "red" : "gray",
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
