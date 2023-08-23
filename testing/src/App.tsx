import { useState } from "react";
import { Drag, DragContext } from "../../src/components";

import { move } from "../../src/helpers/";

function App() {
  const [items, setItems] = useState(
    [1, 2, 3, 4, 5].map((item) => {
      return { id: item };
    })
  );

  return (
    <>
      <div style={{ margin: "0 auto", width: "75%" }}>
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
      </div>
    </>
  );
}

export default App;
