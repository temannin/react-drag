export function move(idToMove: any, idToInsertAfter: any, items: Array<any>) {
  if (isEmpty(idToMove, idToInsertAfter, items)) return items;
  if (idToMove === idToInsertAfter) return items;

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
    }
  }

  // Output the updated array
  return items;
}

function isEmpty(...args: any[]) {
  for (let index = 0; index < args.length; index++) {
    const val = JSON.stringify(args[index]);

    const result =
      val === undefined || val == null || val.length <= 0 ? true : false;

    if (result === true) return true;
  }
  return false;
}
