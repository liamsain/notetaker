let notes = [];
let activeNote = null;
let tags = [];

class Note {
  constructor(config) {
    this.value = config.value || '';
    this.dateCreated = new Date();
    this.id = `note-${this.dateCreated.getTime()}`;
    this.tags = [];
  }

  get timeCreated() {
    const year = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(this.dateCreated)
    const month = new Intl.DateTimeFormat('en', { month: 'short' }).format(this.dateCreated)
    const day = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(this.dateCreated)
    return `${day}-${month}-${year}`;
  }
};


function onSaveNote() {
  const textarea = document.querySelector('#noteTextArea');
  if (textarea.value.trim().length === 0) {
    return;
  }
  if (activeNote) {
    activeNote.value = textarea.value;
    const noteIsAlreadySaved = notes.find(note => note.id === activeNote.id);
    if (!noteIsAlreadySaved) {
      notes.push(activeNote);
    }
    activeNote = null;
  } else {
    notes.push(new Note({
      value: textarea.value
    }));
  }
  textarea.value = '';
  renderNotes();
}

function deleteNoteById(id) {
  notes = notes.filter(note => note.id !== id);
  renderNotes();
}

function editNoteById(id) {
  activeNote = notes.find(note => note.id === id);
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
    activeNote.tags.push(noteTagsInputValue);
    renderTags();
  }

  noteTagsInput.value = '';
}

function renderNotes() {
  const container = document.querySelector('#savedNotesContainer');
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }
  const getNoteHtml = note => `
    <div id="\`${note.id}\`" class="notes__note-container">
      <p>${note.value}</p>
      <p class="notes__date-created">${note.timeCreated}</p>
      <button onclick="deleteNoteById(\`${note.id}\`)">Delete</button>
      <button onclick="editNoteById(\`${note.id}\`)">Edit</button>

    </div>
  `;
  notes.forEach(note => {
    const div = document.createElement('div');
    div.innerHTML = getNoteHtml(note);
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
    container.appendChild(p);
  });
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
};
