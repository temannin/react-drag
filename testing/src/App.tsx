import { useState } from "react";
import { Drag, DragContext } from "../../src/components";

import { move } from "../../src/helpers/";

import { nanoid } from "nanoid";

function App() {
  const [items, setItems] = useState(
    Array.from({ length: 5 }, () => {
      return { id: nanoid() };
    })
  );

  return (
    <>
      <DragContext
        onDragEnd={(active, over) => {
          setItems(move(active, over, items));
        }}
      >
        {items.map((item) => {
          return (
            <Drag id={item.id} key={item.id}>
              <div>{item.id}</div>
            </Drag>
          );
        })}
      </DragContext>
    </>
  );
}

export default App;
