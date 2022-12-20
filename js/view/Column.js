import KanbanAPI from "../api/KanbanAPI.js"
import DropZone from "./DropZone.js";
import Item from "./Item.js";

export default class Column {
  constructor(id, title) {

    const topDropZone = DropZone.createDropZone();

    this.elements = {}; // create Column.elements object
    this.elements.root = Column.createRoot(); // HTMLDivElement returned by createRoot() below
    this.elements.title = this.elements.root.querySelector(".kanban__column-title"); // div
    this.elements.items = this.elements.root.querySelector(".kanban__column-items"); // div
    this.elements.addItem = this.elements.root.querySelector(".kanban__add-item"); // button

    this.elements.root.dataset.id = id;
    this.elements.title.textContent = title; // set title div textContent

    // add child topDropZone element to items div; this is the first child appended to items, so it'll be above all items, which each has their own bottomDropZone
    this.elements.items.appendChild(topDropZone);  

    const itemsFromLocalStorage = KanbanAPI.getItems(id); // a list of item objects [{id: 1, content: '...'}, {}]
    itemsFromLocalStorage.forEach(item => {
      let currentItem = new Item(item.id, item.content);
      this.elements.items.appendChild(currentItem.elements.root)
    })
    

    // add event listener to button
    this.elements.addItem.addEventListener("click",
      () => {
        // pass in current column id and empty content, create and returns the new item
        const newItem = KanbanAPI.insertItem(id, "");
        // create and append new Item class instance and append html element to items div 
        this.renderItem(newItem);
      }
    )
  }

  static createRoot() {
    // Document.createRange() creates a range object, representing a fragment of a document that can contain nodes and parts of text nodes.
    const range = document.createRange();

    // The Range.selectNode() method sets the Range to contain the Node and its contents. The start and end of the Range will be the same as the referenceNode.
    range.selectNode(document.body); // seems optional?


    // range.createContextualFragment() creates a new document fragment (DocumentFragment) object. The document fragment is a lightweight container for creating HTML elements, an alternative to directly inserting elements into the DOM.
    // range.createContextualFragment().children[0] is the HTMLDivElement object
    return range.createContextualFragment(`
            <div class="kanban__column">
                <div class="kanban__column-title"></div>
                <div class="kanban__column-items"></div>
                <button class="kanban__add-item" type="button">+ Add</button>
            </div>
            
        `).children[0]
  }

  renderItem(data) {
    // newItem object with a random id and '' content
    console.log(data.id, data.content);
    // create instance of Item class
    const item = new Item(data.id, data.content);
    // append item's html element to items div
    this.elements.items.appendChild(item.elements.root);
  }
}