const itemForm = document.querySelector("form");
const itemInput = document.querySelector("#item-text");
const itemFilter = document.querySelector("#item-filter");
const itemList = document.querySelector(".list-group");
const clearBtn = document.querySelector("#clear-btn");
const items = itemList.querySelectorAll("li");
let isEditMode = false;

/**
 *  generate element
 *
 */

// create error message text
function createErrorAlert(message) {
  const p = document.createElement("p");
  p.setAttribute("class", "text-danger");
  p.setAttribute("id", "error-msg");
  p.appendChild(document.createTextNode(message));
  return p;
}

// Create button
function createButton() {
  const button = document.createElement("button");
  button.setAttribute("class", "btn remove-btn");
  button.setAttribute("type", "button");

  const icon = document.createElement("i");
  icon.setAttribute("class", "bi-x-circle text-danger");

  button.appendChild(icon);
  return button;
}

function addItem(e) {
  e.preventDefault();
  let itemFieldValue = itemInput.value;

  if (!itemFieldValue) {
    itemInput.insertAdjacentElement(
      "afterend",
      createErrorAlert("Please enter your item!")
    );
    return;
  }

  // remove error message when input field is not blank
  if (document.querySelector("#error-msg")) {
    document.querySelector("#error-msg").remove();
  }

  if (isEditMode) {
    updateItemToDom(itemFieldValue);
  } else {
    const item = {
      name: itemInput.value,
      id: Math.floor(Math.random() * 1000 + 1),
    };
    addItemToDOM(item);
    addItemToLocalStorage(item);
  }
  checkUI();
}

function updateItemToDom(itemFieldValue) {
  const editItem = JSON.parse(
    itemForm.querySelector("#item-text-hidden").getAttribute("value")
  );
  const updatedData = getItemFromLocalStorage().map((item) =>
    item.id == editItem.id ? { ...item, name: itemFieldValue } : item
  );
  setItemsToLocalStorage(updatedData);
  location.reload();
}

function addItemToDOM(item) {
  const listItems = addItemToList(item);
  itemList.appendChild(listItems);
  checkUI();
}

function addItemToList(item) {
  const li = document.createElement("li");
  li.setAttribute("item", item.id);
  const span = document.createElement("span");
  const cancelButton = createButton();
  span.innerText = item.name;
  li.setAttribute(
    "class",
    "list-group-item  list-group-item-action d-flex justify-content-between rounded-0 my-1 border"
  );
  li.appendChild(span);
  li.appendChild(cancelButton);
  return li;
}

function itemFilterHandler(e) {
  const items = itemList.querySelectorAll("li");
  items.forEach((item) => {
    const listItem = item.childNodes[0].textContent.toLowerCase();
    if (listItem.indexOf(e.target.value.toLowerCase()) !== -1) {
      item.style.setProperty("display", "flex", "important");
    } else {
      item.style.setProperty("display", "none", "important");
    }
  });
}

function clearAllHandler() {
  while (itemList.firstChild) {
    itemList.removeChild(itemList.firstChild);
  }
  itemInput.value = "";
  checkUI();
}

function checkUI() {
  document.querySelector("#app-title").innerText = "Shopping Lists";
  const items = itemList.querySelectorAll("li");
  if (items.length === 0) {
    itemFilter.style.setProperty("display", "none", "important");
    clearBtn.style.setProperty("display", "none", "important");
  } else {
    itemFilter.style.setProperty("display", "flex", "important");
    clearBtn.style.setProperty("display", "flex", "important");
  }
}

function onClickItems(e) {
  if (e.target.parentElement.classList.contains("remove-btn")) {
    removeItem(e);
  } else {
    setItemToEdit(e);
  }
}

function setItemToEdit(e) {
  isEditMode = true;
  const id = e.target.getAttribute("item");
  itemInput.value = e.target.firstChild.innerText;
  itemForm.querySelector("#item-btn").classList.add("d-none");
  itemForm.querySelector("#item-update-btn").classList.remove("d-none");
  itemForm.querySelector("#item-update-btn").classList.add("d-flex");

  itemForm
    .querySelector("#item-text-hidden")
    .setAttribute("value", JSON.stringify({ id: id, name: itemInput.value }));
}

function removeItem(e) {
  if (confirm("Are you sure?")) {
    e.target.parentElement.parentElement.remove();
    const id = e.target.parentElement.parentElement.getAttribute("item");
    removeItemFromLocalStorage(id);
    checkUI();
  }
}

function displayItems() {
  const items = getItemFromLocalStorage();
  items.forEach((item) => addItemToDOM(item));
}

// Update item's information
function updateItemInfo() {
  const editItem = JSON.parse(
    itemForm.querySelector("#item-text-hidden").getAttribute("value")
  );
  const updatedData = getItemFromLocalStorage().map((item) =>
    item.id == editItem.id ? { ...item, name: itemFieldValue } : item
  );
  setItemsToLocalStorage(updatedData);
}

/**
 *  Database (Local Storage)
 */

// add item from storage
function addItemToLocalStorage(item) {
  let itemFromStorage;
  if (localStorage.getItem("ShoppingListItems") == null) {
    itemFromStorage = [];
  } else {
    itemFromStorage = getItemFromLocalStorage();
  }

  const result = itemFromStorage.filter((i) => i.name == item.name);
  if (result.length > 0) {
    itemInput.insertAdjacentElement(
      "afterend",
      createErrorAlert(`${itemInput.value} is already exist!`)
    );
    return;
  } else {
    itemFromStorage.push(item);
    setItemsToLocalStorage(itemFromStorage);
  }
  itemInput.value = "";
}

// remove item from storage
function removeItemFromLocalStorage(id) {
  const storageItems = getItemFromLocalStorage();
  const updatedItem = storageItems.filter((item) => item.id != id);
  setItemsToLocalStorage(updatedItem);
}

// get item from storage
function getItemFromLocalStorage() {
  return JSON.parse(localStorage.getItem("ShoppingListItems"));
}

// add item to local storage
function setItemsToLocalStorage(items) {
  localStorage.setItem("ShoppingListItems", JSON.stringify(items));
}

// initializer
function init() {
  // event listener
  itemForm.addEventListener("submit", addItem);
  itemList.addEventListener("click", onClickItems);
  itemFilter.addEventListener("input", itemFilterHandler);
  clearBtn.addEventListener("click", clearAllHandler);
  document.addEventListener("DOMContentLoaded", displayItems);

  checkUI();
}

init();
