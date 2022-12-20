import Column from "./Column.js"

export default class Kanban {
  constructor(root) {
    // in main.js, new Kanban(document.querySelector(".kanban"))
    this.root = root;

    Kanban.columns().forEach(column => {
      const columnView = new Column(column.id, column.title); // create instance of Column with id and title
      this.root.appendChild(columnView.elements.root);
    });
  }

  static columns() {
    return [
      {
        id: 1,
        title: "Not Started"
      },
      {
        id: 2,
        title: "In Progress"
      },
      {
        id: 3,
        title: "Completed"
      },
      {
        id: 4,
        title: "On Hold"
      },
    ]
  }
}