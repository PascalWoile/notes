let titlesActive = [];
let contentActive = [];
let titlesArchived = [];
let contentArchived = [];
let titlesDeleted = [];
let contentDeleted = [];
let userInput;
let noteField;
load();


function renderNotes(origin) {
  userInput = document.getElementById("user-input");
  noteField = document.getElementById("noteField");
  clearBeforeRendering();
  if (titlesActive && contentActive == false && origin === 'active') {
    showEmpty(origin);
  } 
  if (titlesArchived && contentArchived == false && origin === 'archived') {
    showEmpty(origin);
  }
  if (titlesDeleted && contentDeleted == false && origin === 'deleted') {
    showEmpty(origin);
  } 
  else {
    checkType(origin);
  }
}

function checkType(origin) {
  if (origin === 'active') { //Zeige AKTIV Notizen
    startRendering(titlesActive, contentActive, origin);
  }
  if (origin === 'archived') { //Zeige ARCHIVIERTE Notizen
    userInput.classList.add("d-none");
    startRendering(titlesArchived, contentArchived, origin);
  }
  if (origin === 'deleted') { //Zeige GELÖSCHTE Notizen
    userInput.classList.add("d-none");
    startRendering(titlesDeleted, contentDeleted, origin);
  }
}

function clearBeforeRendering() {
  document.getElementById("newTitle").value = "";
  document.getElementById("newContent").value = "";
  noteField.innerHTML = "";
  userInput.classList.remove("d-none");
}


function startRendering(titles, content, origin) {
  for (i = 0; i < titles.length; i++) {
    const noteTitle = titles[i];
    const noteContent = content[i];
    insertHTML(noteField, noteTitle, noteContent, origin);
    showCorrectButtons(origin);
  }
}


function showEmpty(origin) {
  if (origin === 'active') {        //Wenn AKTIV leer
    noteField.innerHTML = `<div><br> <br>Derzeit sind keine Notizen vermerkt!</div>`;
  }
  if (origin === 'archived') {      //Wenn ARCHIVIERT leer
    userInput.classList.add("d-none");
    noteField.innerHTML = `<div>Das Archiv ist leer!</div>`;
  }
  if (origin === 'deleted') {       //Wenn GELÖSCHT leer
    userInput.classList.add("d-none");
    noteField.innerHTML = `<div>Der Papierkorb ist leer!</div>`;
  }
}



function addNote() {
  let titleInput = document.getElementById("newTitle").value;
  let contentInput = document.getElementById("newContent").value;
  if (titleInput && contentInput) {
    titlesActive.push(titleInput);
    contentActive.push(contentInput);
    renderNotes('active');
    save();
  } else {
    alert("Bitte alle felder füllen!");
  }
}


function showCorrectButtons(type) {
  if(type === 'active') {
    document.getElementById(`deletebutton${i}`).classList.toggle('d-none');
    document.getElementById(`pinbutton${i}`).classList.toggle('d-none');
  }
  if(type === 'archived') {
    document.getElementById(`archivebutton${i}`).classList.toggle('d-none');
    document.getElementById(`deletebutton${i}`).classList.toggle('d-none');
  }
  if(type === 'deleted') {
    document.getElementById(`archivebutton${i}`).classList.toggle('d-none');
    document.getElementById(`trashbutton${i}`).classList.toggle('d-none');
  }
}

function sendTo(i, target, origin) {
  increaseTargetArrayFromOrigin(i, target, origin)
  decreaseOriginArray(i, origin);
  renderNotes(origin);
  save();
}

function decreaseOriginArray(i, origin) {
  if(origin === 'active') {
    titlesActive.splice(i, 1);
    contentActive.splice(i, 1);
  }
  if(origin === 'archived') {
    titlesArchived.splice(i, 1);
    contentArchived.splice(i, 1);
  }
  if(origin === 'deleted') {
    titlesDeleted.splice(i, 1);
    contentDeleted.splice(i, 1);
  }
}

function increaseTargetArrayFromOrigin(i, target, origin) {
  if(origin === 'active') { //von AKTIV zu ARCHIVIERT
    checkTarget(i, target, origin);
  }
  if(origin === 'archived') { //von ARCHIVIERT zu AKTIV
    checkTarget(i, target, origin);
  }
 if(origin === 'deleted') { //von GELÖSCHT zu AKTIV
    checkTarget(i, target, origin);
 }
}

function checkTarget(i, target, origin) {
  if (target === 'archived' && origin === 'active') {
    titlesArchived.push(titlesActive[i]);
    contentArchived.push(contentActive[i]);
  }else if(target === 'deleted' && origin === 'active'){
    titlesDeleted.push(titlesActive[i]); 
    contentDeleted.push(contentActive[i]);
  }else if (target === 'active' && origin === 'archived'){
    titlesActive.push(titlesArchived[i]);
    contentActive.push(contentArchived[i]);
  }else if (target === 'deleted' && origin === 'archived'){                     
    titlesDeleted.push(titlesArchived[i]);
    contentDeleted.push(contentArchived[i]);
  }else if (target === 'active' && origin === 'deleted') {
    titlesActive.push(titlesDeleted[i]);
    contentActive.push(contentDeleted[i]);
  }
}


function eraseNote(i, origin) {
  decreaseOriginArray(i, origin);
  renderNotes('deleted');
  save();
}


//local Storage

function save() {
  let titlesActiveAsText = JSON.stringify(titlesActive);
  let contentActiveAsText = JSON.stringify(contentActive);
  let titlesArchivedAsText = JSON.stringify(titlesArchived);
  let contentArchivedAsText = JSON.stringify(contentArchived);
  let titlesDeletedAsText = JSON.stringify(titlesDeleted);
  let contentDeletedAsText = JSON.stringify(contentDeleted);
  localStorage.setItem("activeTitles", titlesActiveAsText);
  localStorage.setItem("activeContent", contentActiveAsText);
  localStorage.setItem("archivedTitles", titlesArchivedAsText);
  localStorage.setItem("archivedContent", contentArchivedAsText);
  localStorage.setItem("deletedTitles", titlesDeletedAsText);
  localStorage.setItem("deletedContent", contentDeletedAsText);
}

function load() {
  let titlesActiveAsText = localStorage.getItem("activeTitles");
  let contentActiveAsText = localStorage.getItem("activeContent");
  let titlesArchivedAsText = localStorage.getItem("archivedTitles");
  let contentArchivedAsText = localStorage.getItem("archivedContent");
  let titlesDeletedAsText = localStorage.getItem("deletedTitles");
  let contentDeletedAsText = localStorage.getItem("deletedContent");
  if (titlesActiveAsText && contentActiveAsText) {
    titlesActive = JSON.parse(titlesActiveAsText);
    contentActive = JSON.parse(contentActiveAsText);
  }
  if (titlesArchivedAsText && contentArchivedAsText) {
    titlesArchived = JSON.parse(titlesArchivedAsText);
    contentArchived = JSON.parse(contentArchivedAsText);
  }
  if (titlesDeletedAsText && contentDeletedAsText) {
    titlesDeleted = JSON.parse(titlesDeletedAsText);
    contentDeleted = JSON.parse(contentDeletedAsText);
  }
}

//insert HTML

function insertHTML(noteField, noteTitle, noteContent, origin) {
  noteField.innerHTML += `
    <div class="single-note-container" id="single-note${i}">
    <div>
      <h4 id="noteTitle${i}">${noteTitle}</h4>
      <span id="noteContent${i}" class="noteContent">${noteContent}</span>
    </div>
    <div id="noteIcons${i}" class="note-icons-container">
      <img id="archivebutton${i}" onclick="sendTo(${i}, 'archived', '${origin}')"
        class="note-icons"
        src="./img/box-archive-solid.svg" 
        alt="archiv"
      />
      <img id="trashbutton${i}" onclick="sendTo(${i}, 'deleted', '${origin}' )"
        class="note-icons"
        src="./img/trash-can-regular.svg"
        alt="papierkorb"
      />
      <img id="pinbutton${i}" onclick="sendTo(${i}, 'active', '${origin}')"
        class="note-icons"
        src="./img/thumbtack-solid.svg"
        alt="archiv"
      />
      <img id="deletebutton${i}" onclick="eraseNote(${i}, 'deleted')"
        class="note-icons"
        src="./img/xmark-solid.svg"
        alt="X"
      />
    </div>
  </div>
    `;
    }


