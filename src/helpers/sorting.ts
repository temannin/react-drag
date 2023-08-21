export function move(idToMove: any, idToInsertAfter: any, items: Array<any>) {
  items = JSON.parse(JSON.stringify(items));
  // Find the index of the element with the given ID
  let indexOfElementToMove = items.findIndex((item) => item.id === idToMove);

  // Check if the ID was found in the array
  if (indexOfElementToMove !== -1) {
    // Remove the item from its original position
    let itemToMove = items.splice(indexOfElementToMove, 1)[0];

    // Find the index of the element after which to insert
    let indexOfElementToInsertAfter = items.findIndex(
      (item) => item.id === idToInsertAfter
    );

    // Check if the ID was found in the array
    if (indexOfElementToInsertAfter !== -1) {
      // Insert the item after the identified element
      items.splice(indexOfElementToInsertAfter + 1, 0, itemToMove);
    } else {
      console.log("ID to insert after not found in the array.");
    }
  } else {
    console.log("ID to move not found in the array.");
  }

  // Output the updated array
  return items;
}
