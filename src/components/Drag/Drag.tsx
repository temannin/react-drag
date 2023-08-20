import React, { useContext } from "react";
import { DragContextWrapper } from "../DragContext/DragContext";

export interface DragProps {
  children: React.JSX.Element;
  id: string;
}

const Drag = (props: DragProps) => {
  const {
    onDragEnd,
    currentOver,
    setCurrentOver,
    currentActive,
    setCurrentActive,
  } = useContext(DragContextWrapper);

  const isOver = props.id === currentOver;
  const isCurrent = props.id === currentActive;

  return (
    <div
      onMouseDown={(e) => {
        e.preventDefault();
        setCurrentActive(props.id);
      }}
      style={{
        border: `8px solid ${isOver ? "green" : "red"}`,
        margin: 4,
      }}
    >
      {props.children}
    </div>
  );
};

export default Drag;
