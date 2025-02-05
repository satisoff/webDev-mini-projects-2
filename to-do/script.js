const addBtn = document.getElementById("next-item");
const addSec = document.querySelector(".add-section");
const homeSec = document.querySelector(".main-box");
const addSecAddBtn = document.getElementById("insert-task");
const addInput = document.querySelector(".add-input");
const searchInput = document.querySelector(".search-input");
const allCheckBox = document.querySelectorAll("#item-check");

function addItem(curItemNum, newTaskContent) {
    addInput.value = "";            //clear old value
    const newItemLi = document.createElement("li");
    const newItemDiv = document.createElement("div");
    newItemDiv.classList.add("item-text", `item-${curItemNum}`);
    const newItemNum = document.createElement("num");
    newItemNum.innerText = `${curItemNum}. `;
    const newItemPara = document.createElement("p");
    newItemPara.innerText = `${newTaskContent}`;
    const newItemBtn = document.createElement("button");
    newItemBtn.setAttribute('id', 'item-check');
    newItemDiv.appendChild(newItemNum);
    newItemDiv.appendChild(newItemPara);
    newItemLi.appendChild(newItemDiv);
    newItemLi.appendChild(newItemBtn)
    document.querySelector(".all-items").appendChild(newItemLi);
}

function addItemLocal(itemNo, itemName) {
    localStorage.setItem(itemNo, itemName);
}

function defineItem() {
    homeSec.style.display = "none";
    addSec.style.display = "block";
    addSec.firstElementChild.firstElementChild.focus();
}

function loadLocalData() {
    let localCounter = 0;    
    while(localCounter < localStorage.length) {
        if (parseInt(localStorage.key(localCounter)) == localStorage.key(localCounter)) {           //key must be integer
            let key = localStorage.key(localCounter);
            let value = localStorage.getItem(key);
            addItem(key, value);
        }
        localCounter++;
    }
}

function setNewTask() {
    let nextItemNum = 1;
    if (localStorage.getItem('localCounter')) {
    nextItemNum = parseInt(localStorage.getItem('localCounter'))+1;             //next avail key
    }
    if (addInput.value) {
        addItemLocal(nextItemNum, addInput.value);
        addItem(nextItemNum, addInput.value);
        localStorage.setItem("localCounter", nextItemNum);
        homeSec.style.display = "block";
        addSec.style.display = "none";
    } else {
        alert("Task field can't be Empty");
    }
}

addBtn.addEventListener("click", defineItem);
addSecAddBtn.addEventListener("click", setNewTask);
addSec.firstElementChild.firstElementChild.addEventListener("keydown", (key) => {       //triggering input field
    if (key.keyCode === 13) {               //key code for "Enter" key
        setNewTask();
    }
})

// Add event listner on the main-box which isn't dynamically created
homeSec.addEventListener('click', (event) => {
    if (event.target && event.target.matches("button#item-check")) {
        event.target.style.backgroundImage = "url('resources/checkMark.png')";
        event.target.previousSibling.lastElementChild.style.textDecoration = "line-through";
        event.target.disabled = 'true';
        let idToRem = parseInt(event.target.previousSibling.firstElementChild.innerText[0]);
        localStorage.removeItem(idToRem);
    }
})

window.addEventListener("load", () => {
    if (!localStorage.getItem('localcounter')) {      //if no items present
        addSec.style.display = "block";
        homeSec.style.display = "none";
    } else {
        loadLocalData();
    }
})

// Search Task
function searchTask() {
    if (searchInput.value) {
        let curWord = searchInput.value;
        homeSec.firstElementChild.replaceChildren();           //remove all child
        let localCounter = 0;    
        while(localCounter < localStorage.length) {
            if (parseInt(localStorage.key(localCounter)) == localStorage.key(localCounter)) {       //checking if key is an integer
                let key = localStorage.key(localCounter);
                let value = localStorage.getItem(key);
                if (value.toLowerCase().includes(curWord.toLowerCase())) {
                    addItem(key, value);
                }
            }
            localCounter++;
        }
    } else {
        homeSec.firstElementChild.replaceChildren();           //remove all child
        loadLocalData();
    }
}

searchInput.addEventListener("input", searchTask);