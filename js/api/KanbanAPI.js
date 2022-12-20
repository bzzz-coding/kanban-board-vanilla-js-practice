
export default class KanbanAPI {
  // A static method is callable from the class itself; a non-static method is callable from an instance of the class

  // Get/Read
  static getItems(columnId) {
    // read() returns a list of objects, each has an id and a list of items
    const data = read();
    // Array.find() returns the first matched element, or undefined if no match found.
    const column = data.find(column => column.id === columnId);

    if (!column) {
      return []
    }

    // returns a list of item objects
    return column.items
  }

  // Post/Create
  static insertItem(columnId, content) {
    const data = read();
    const column = data.find(column => column.id === columnId);

    const item = {
      id: Math.floor(Math.random() * 100000),
      content, // same as content: content
    }

    if (!column) {
      throw new Error("Column does not exist")
    }
    // The throw statement throws a user-defined exception. Execution of the current function will stop (the statements after throw won't be executed), and control will be passed to the first catch block in the call stack. If no catch block exists among caller functions, the program will terminate.

    column.items.push(item);

    // save data in localStorage
    save(data);

    // returns item object that has an id and content
    return item
  }

  // Put/Update
  static updateItem(itemId, newProps) {
    const data = read();

    // array destructuring
    const [item, currentColumn] = (() => {
      // nested loops to search for the item that matches itemId
      for (const column of data) {
        const item = column.items.find(item => item.id === itemId);

        if (item) {
          return [item, column] // return [matched item, the column where the item was found] which will be assigned to item and currentColumn
        }
      }
    })() // immediately calls anonymous function

    // if after the nested loop, item is still undefined, meaning it was not found
    if (!item) {
      throw new Error("Item not found")
    }

    // if newProps has content, update item.content with newProps.content
    item.content = newProps.content === undefined ? item.content : newProps.content;

    // if newProps has target columnId and position
    if (
      newProps.targetColumnId !== undefined
      && newProps.targetPosition !== undefined
    ) {
      const targetColumn = data.find(column => column.id == newProps.targetColumnId);

      if (!targetColumn) {
        throw new Error("Target column not found")
      }

      // delete item from currentColumn
      currentColumn.items.splice(currentColumn.items.indexOf(item), 1);
      // insert item into targetColumn
      targetColumn.items.splice(newProps.targetPosition, 0, item);
    }


    save(data);
  }

  // Delete
  static deleteItem(itemId) {
    const data = read();

    for (const column of data) {
      const item = column.items.find(item => item.id === itemId);

      if (item) {
        // if found item, delete it from current column
        column.items.splice(column.items.indexOf(item), 1);
        break
      }
    }

    save(data)
  }
}

function read() {
  // get localStorage data (JSON string) with the id "kanban-data" 
  const json = localStorage.getItem("kanban-data")
  console.log(`json from localStorage: ${JSON.parse(json)}`)
  if (!json) {
    return [
      {
        id: 1,
        items: []
      },
      {
        id: 2,
        items: []
      },
      {
        id: 3,
        items: []
      },
      {
        id: 4,
        items: []
      },
    ]
  }

  // parse JSON string and construct a JavaScript object described by the string
  // returns a list of objects, each has an id and a list of items
  return JSON.parse(json)
}

function save(data) {
  // save data (stringified) in localStorage under id "kanban-data"
  localStorage.setItem("kanban-data", JSON.stringify(data))
}