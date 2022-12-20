import KanbanAPI from "../api/KanbanAPI.js"
import DropZone from "./DropZone.js"


export default class Item {
  constructor(id, content) {

    const bottomDropZone = DropZone.createDropZone();

    this.elements = {};
    this.elements.root = Item.createRoot(); // HTML div element
    this.elements.input = this.elements.root.querySelector(".kanban__item-input"); // input div
    this.elements.root.dataset.id = id;
    this.elements.input.textContent = content; // set input div textContent
    this.content = content;
    // each element has a bottom dropzone
    this.elements.root.appendChild(bottomDropZone);

    const onBlur = () => {
      // input div content is editable
      const newContent = this.elements.input.textContent.trim();

      // if trimmed content is the same as before
      if (newContent === this.content) {
        return
      }

      // set content to newContent
      this.content = newContent;

      KanbanAPI.updateItem(id, { content: this.content })
    }

    // add event listener to input div for possible content update
    // blur means clicking away, it's the opposite of focus
    this.elements.input.addEventListener("blur", onBlur);

    // add event listener to item div for delete on double click
    this.elements.root.addEventListener("dblclick", () => {
      // confirm() will pop up a window for user to confirm, and return true or false based on user selection
      const check = confirm("Are you sure you want to delete");

      if (check) {
        KanbanAPI.deleteItem(id);
        // remove content div event listener
        this.elements.input.removeEventListener("blur", onBlur);
        // remove entire item div
        this.elements.root.parentElement.removeChild(this.elements.root);
      }
    });

    this.elements.root.addEventListener("dragstart", e => {
      // The DataTransfer object is used to hold the data that is being dragged during a drag and drop operation. It may hold one or more data items, each of one or more data types.
      e.dataTransfer.setData("text/plain", id);
      
      // hide the bottomDropZone during dragging
      e.target.lastChild.classList.add('kanban__dropzone--hide')
    });

    this.elements.input.addEventListener("drop", e => {
      e.preventDefault(); // if the event does not get explicitly handled, its default action should not be taken as it normally would be
    });
  }

  // returns the HTML div element
  static createRoot() {
    const range = document.createRange()

    range.selectNode(document.body) // optional?

    // attributes: draggable="true", contenteditable
    return range.createContextualFragment(`
            <div class="kanban__item" draggable="true"> 
                <div class="kanban__item-input" contenteditable></div>
            </div>
        `).children[0]
  }
}