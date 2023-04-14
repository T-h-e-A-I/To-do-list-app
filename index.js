//Importing From Firebass
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.19.1/firebase-app.js'
import { getDatabase, ref, push, onValue, remove } from 'https://www.gstatic.com/firebasejs/9.19.1/firebase-database.js'

//Firebase App Settings
const AppSettings = {
    databaseURL: "https://playground-fbb13-default-rtdb.asia-southeast1.firebasedatabase.app/"
}

//Initialising Firebase
const app = initializeApp(AppSettings)
const database = getDatabase(app)
const tasksInDB = ref(database, "tasks")

//Dom Elements
let input = document.getElementById("todo")
let list = document.getElementById("list")
//Function for appending items in ul
function addItem(current) {
    let currentItem = current[1]
    let currentId = current[0]
    let listItem = document.createElement('li')
    listItem.textContent = currentItem
    listItem.addEventListener("dblclick", function () {
        let entry = ref(database, `tasks/${currentId}`)
        remove(entry)
    })
    list.appendChild(listItem)
}
function claearUnorderedList(list) {
    list.innerHTML = ""
}
function initialiseList(existing) {
    claearUnorderedList(list)
    existing.forEach(task => {
        let currentItem = task[1]
        let currentId = task[0]
        addItem(task)
    });
}

//Fetching Data From Database
onValue(tasksInDB, function (snapshot) {
    if (snapshot.exists()) {
        let alreadyAddedTasks = Object.entries(snapshot.val());
        initialiseList(alreadyAddedTasks)
    } else {
        list.innerHTML = "No Items Here Yet"
    }

})


//Clears Input Field
function clearField(inputField) {
    inputField.value = ""
}
//Button click Tasks
document.getElementById("addList").onclick = function () { myFunction() };

function myFunction() {
    let inputValue = input.value
    if (inputValue != "") {
        push(tasksInDB, inputValue)
        console.log(`${inputValue} added to database`)
        //addItem(inputValue) is done in onvalue when database changes
    }
    clearField(input)
}

