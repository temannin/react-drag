import React, { createContext, useState } from "react";

export interface ICoordinates {
  X: number;
  Y: number;
}

export interface IDragContext {
  currentActive: string;
  setCurrentActive: React.Dispatch<React.SetStateAction<string>>;
  currentOver: string;
  setCurrentOver: React.Dispatch<React.SetStateAction<string>>;
  onDragEnd(active: string, over: string): any;
  children?: React.JSX.Element[];
  coordinatesOfCursor: ICoordinates;
  setCoordinatesOfCursor: React.Dispatch<React.SetStateAction<ICoordinates>>;
}

export interface IDragInterface {
  onDragEnd(active: string, over: string): any;
  children?: React.JSX.Element[];
}

export const DragContextWrapper = createContext<IDragContext>({
  onDragEnd: (active: string, over: string) => {
    throw new Error("onDragEnd not defined!");
  },
  currentOver: "",
  setCurrentOver: () => {},
  currentActive: "",
  setCurrentActive: () => {},
  coordinatesOfCursor: { X: 0, Y: 0 },
  setCoordinatesOfCursor: () => {
    throw new Error("setCoordinates is not defined");
  },
});

export default function DragContext(props: IDragInterface) {
  const [currentOver, setCurrentOver] = useState("");
  const [currentActive, setCurrentActive] = useState("");

  const [coordinatesOfCursor, setCoordinatesOfCursor] = useState({
    X: 0,
    Y: 0,
  });

  document.onmousemove = (e) => {
    if (currentActive !== "") {
      let { clientX: x, clientY: y } = e;
      setCoordinatesOfCursor({ X: x - 10, Y: y - 10 });
    }
  };

  document.ontouchmove = (e) => {
    console.log(e);
    if (currentActive !== "") {
      let { pageX: x, pageY: y } = e.targetTouches[0];
      setCoordinatesOfCursor({ X: x - 10, Y: y - 10 });
    }
  };

  document.onmouseup = (e) => {
    if (currentActive !== "") {
      let retValues: { active: string; over: string } = JSON.parse(
        JSON.stringify({ active: currentActive, over: currentOver })
      );
      setCurrentActive("");
      props.onDragEnd(retValues.active, retValues.over);
    }
  };

  document.ontouchend = (e) => {
    if (currentActive !== "") {
      let retValues: { active: string; over: string } = JSON.parse(
        JSON.stringify({ active: currentActive, over: currentOver })
      );
      setCurrentActive("");
      props.onDragEnd(retValues.active, retValues.over);
    }
  };

  return (
    <div style={{ touchAction: "none" }}>
      <DragContextWrapper.Provider
        value={{
          currentActive,
          onDragEnd: props.onDragEnd,
          currentOver,
          setCurrentOver,
          setCurrentActive,
          coordinatesOfCursor,
          setCoordinatesOfCursor,
        }}
      >
        {props.children}
      </DragContextWrapper.Provider>
    </div>
  );
}
