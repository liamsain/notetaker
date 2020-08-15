const notes = [];

function onSaveNoteClick() {
  const textarea = document.querySelector('#noteTextArea');
  console.log(textarea.value);
  if (textarea.value.trim().length > 0) {
    notes.push(textarea.value);
  }
  textarea.value = '';
  renderNotes();
}

function renderNotes() {
  const container = document.querySelector('#savedNotesContainer');
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }
  notes.forEach(note => {
    const para = document.createElement('p');
    para.innerHTML = note;
    container.appendChild(para);
  });
  
}
