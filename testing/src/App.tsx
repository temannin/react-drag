import { useState } from "react";
import { Drag, DragContext } from "../../src/components";

import { nanoid } from "nanoid";

function App() {
  const [items, setItems] = useState([
    { id: nanoid() },
    { id: nanoid() },
    { id: nanoid() },
    { id: nanoid() },
  ]);

  return (
    <>
      <DragContext
        onDragEnd={(e) => {
          console.log(e);
        }}
      >
        {items.map((item) => {
          return (
            <Drag id={item.id}>
              <div>{item.id}</div>
            </Drag>
          );
        })}
      </DragContext>
    </>
  );
}

export default App;
