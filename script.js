const notesLocalStorageKey = 'notes-saved';
const tagsLocalStorageKey = 'notes-tags';
let activeNote = null;
let tags = ['All'];


function getSavedNotes() {
  let notes = [];
  const rawNotes = localStorage.getItem(notesLocalStorageKey);
  if (rawNotes) {
    notes = JSON.parse(rawNotes).map(x => new Note(x));
  }
  return notes;
}

function saveNote(note) {
  const notes = getSavedNotes();
  let existingNoteIndex = notes.findIndex(x => x.id === note.id);
  if (existingNoteIndex !== -1) {
    notes[existingNoteIndex] = note;
  } else {
    notes.push(note);
  }
  localStorage.setItem(notesLocalStorageKey, JSON.stringify(notes));
}

class Note {
  constructor(config) {
    this.value = config.value || '';
    this.dateCreated = config.dateCreated ? new Date(config.dateCreated) : new Date();
    this.id = config.id || `note-${this.dateCreated.getTime()}`;
    this.tags = config.tags || ['All'];
    this.visible = config.visible === false ? false : true;
  }

  get timeCreated() {
    const year = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(this.dateCreated)
    const month = new Intl.DateTimeFormat('en', { month: 'short' }).format(this.dateCreated)
    const day = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(this.dateCreated)
    return `${day}-${month}-${year}`;
  }
  get html() {
    return `
        <div id="\`${this.id}\`" class="notes__note-container">
          <p style="margin-bottom: 12px;">${this.value}</p>
          <p class="notes__date-created">${this.timeCreated}</p>
          <p class="notes__note-tag">${this.tags.filter(x => x !== 'All').map(tag => tag + ', ')}</p>
          <button onclick="deleteNoteById(\`${this.id}\`)">Delete</button>
          <button onclick="editNoteById(\`${this.id}\`)">Edit</button>
        </div>
      `;
  }
};


function onSaveNote() {
  const textarea = document.querySelector('#noteTextArea');
  if (textarea.value.trim().length === 0) {
    return;
  }
  if (activeNote) {
    activeNote.value = textarea.value;
    saveNote(activeNote);
    activeNote = null;
  } else {
    saveNote(new Note({value: textarea.value}));
  }
  textarea.value = '';
  renderNotes();
}

function deleteNoteById(id) {
  let notes = getSavedNotes().filter(x => x.id !== id);

  localStorage.setItem(notesLocalStorageKey, JSON.stringify(notes));
  renderNotes();
}

function editNoteById(id) {
  activeNote = getSavedNotes().find(note => note.id === id);
  document.querySelector('#noteTextArea').value = activeNote.value;
}

function addTagToNote() {
  if (!activeNote) {
    activeNote = new Note({
      value: document.querySelector('#noteTextArea').value
    });
  }
  const noteTagsInput = document.querySelector('#noteTagsInput');
  const noteTagsInputValue = noteTagsInput.value.trim();
  if (noteTagsInputValue.length === 0) {
    return;
  }
  if (!tags.includes(noteTagsInputValue)) {
    tags.push(noteTagsInputValue);
    renderTags();
  }

  activeNote.tags.push(noteTagsInputValue);
  noteTagsInput.value = '';
}

function renderNotes() {
  const container = document.querySelector('#savedNotesContainer');
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }
  getSavedNotes().forEach(note => {
    console.log(note);
    if (!note.visible) {
      return;
    }
    const div = document.createElement('div');
    div.innerHTML = note.html;
    container.appendChild(div);
  });
}


function renderTags() {
  const container = document.querySelector('#tagsContainer');
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }
  tags.forEach(tag => {
    const p = document.createElement('p');
    p.innerHTML = tag;
    p.classList.add("notes__tag");
    p.onclick = () => filterNotesByTag(tag);
    container.appendChild(p);
  });
}

function filterNotesByTag(tag) {

  const notes = getSavedNotes().map(note => {
    note.visible = note.tags.includes(tag);
    return note;
  });
  console.log(notes);

  localStorage.setItem(notesLocalStorageKey, JSON.stringify(notes));
  renderNotes();
}

function keydownListener(ev) {
  const enterKeyCode = 13;
  if (ev.ctrlKey && ev.keyCode === enterKeyCode) {
    onSaveNote();
  }
};


window.addEventListener('keydown', keydownListener);
window.onload = () => {
  document.querySelector('#noteTextArea').focus();
  document.querySelector('#noteTagsInput').addEventListener('keyup', ev => {
    if (ev.key === 'Enter') {
      addTagToNote();
    }
  });
  tags = ['All'];
  getSavedNotes().forEach(note => {
    tags = tags.concat(note.tags);
  });
  tags = tags.filter((tag, index) => tags.indexOf(tag) === index);


  
  renderTags();
  renderNotes();
};
