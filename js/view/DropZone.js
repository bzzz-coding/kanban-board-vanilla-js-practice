import KanbanAPI from "../api/KanbanAPI.js"


export default class DropZone {
  static createDropZone() {
    const range = document.createRange();
    range.selectNode(document.body);
    const dropZone = range.createContextualFragment(`
            <div class="kanban__dropzone"></div>
        `).children[0];

    // target dropzone listens for when a draggable item hovers over
    dropZone.addEventListener("dragover", e => {
      e.preventDefault();
      dropZone.classList.add("kanban__dropzone--active");
    })

    dropZone.addEventListener("dragleave", () => {
      dropZone.classList.remove("kanban__dropzone--active");
    })

    dropZone.addEventListener("drop", e => {
      e.preventDefault();
      dropZone.classList.remove("kanban__dropzone--active");

      // display the dropzone that was hidden during dragging
      document.querySelector('.kanban__dropzone--hide').classList.remove('kanban__dropzone--hide')

      // The closest() method of the Element interface traverses the element and its parents (heading toward the document root) until it finds a node that matches the specified CSS selector.
      const columnElement = dropZone.closest(".kanban__column");
      const columnId = Number(columnElement.dataset.id);

      // querySelectorAll() returns a static (not live) NodeList representing a list of elements; use Array.from() to convert to array
      const dropZonesInColumn = Array.from(columnElement.querySelectorAll(".kanban__dropzone"));
      
      // get index of current item
      const droppedIndex = dropZonesInColumn.indexOf(dropZone);

      // get id from event through dataTransfer
      const itemId = Number(e.dataTransfer.getData("text/plain"));

      const droppedItemElement = document.querySelector(`[data-id="${itemId}"]`)

      // because dropzones are either attached to the bottom of an item, or at the top of the items div, insert either after the parent div of the current dropzone, or in the latter case, insert after the top dropzone
      const elementAbove = dropZone.parentElement.classList.contains("kanban__item") ? dropZone.parentElement : dropZone

      if (droppedItemElement.contains(dropZone)) {
        return
      }

      // The Element.after() method inserts a set of Node or string objects in the children list of the Element's parent, just after the Element. 
      elementAbove.after(droppedItemElement)

      // update localStorage
      KanbanAPI.updateItem(itemId, {
        targetColumnId: columnId,
        targetPosition: droppedIndex
      })
    })

    return dropZone
  }
}

