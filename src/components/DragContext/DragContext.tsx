import React, { createContext, useState } from "react";

export interface IDragContext {
  currentActive: string;
  setCurrentActive: React.Dispatch<React.SetStateAction<string>>;
  currentOver: string;
  setCurrentOver?: React.Dispatch<React.SetStateAction<string>>;
  onDragEnd(over: string): any;
  children?: React.JSX.Element[];
}

export interface IDragInterface {
  onDragEnd(over: string): any;
  children?: React.JSX.Element[];
}

export const DragContextWrapper = createContext<IDragContext>({
  onDragEnd: () => {
    console.error("onDragEnd not defined!");
  },
  currentOver: "",
  currentActive: "",
  setCurrentActive: () => {},
});

export default function DragContext(props: IDragInterface) {
  const [currentOver, setCurrentOver] = useState("");
  const [currentActive, setCurrentActive] = useState("");

  document.onmouseup = (e) => {
    setCurrentActive("");
  };

  document.onmousemove = (e) => {
    if (currentActive !== "") {
      console.log(e);
    }
  };

  return (
    <div>
      <DragContextWrapper.Provider
        value={{
          currentActive: currentActive,
          onDragEnd: props.onDragEnd,
          currentOver: currentOver,
          setCurrentOver: setCurrentOver,
          setCurrentActive: setCurrentActive,
        }}
      >
        {props.children}
      </DragContextWrapper.Provider>
    </div>
  );
}
