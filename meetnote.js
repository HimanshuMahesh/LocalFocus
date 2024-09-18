document.addEventListener('DOMContentLoaded', () => {
  const noteInput = document.getElementById('noteInput');
  const addNoteButton = document.getElementById('addNoteButton');
  const noteWall = document.getElementById('noteWall');
  
  // Load notes from local storage
  loadNotes();

  // Event listener for adding note when "Add Note" button is clicked
  addNoteButton.addEventListener('click', () => {
      addNote();
  });

  // Event listener for triggering "Add Note" with Enter key
  noteInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
          e.preventDefault(); // Prevents adding a new line in the textarea
          addNoteButton.click(); // Simulate button click
      }
  });

  function addNote() {
      const noteText = noteInput.value.trim();
      if (noteText === '') return;

      const note = {
          text: noteText,
          timestamp: new Date().toLocaleString(),
      };

      addNoteToWall(note);
      saveNoteToLocalStorage(note);
      noteInput.value = ''; // Clear the input after adding note

      // Scroll to top after adding note
      noteWall.scrollTop = 0;
  }

  function addNoteToWall(note) {
      const noteElement = document.createElement('div');
      noteElement.classList.add('note');
      noteElement.setAttribute('draggable', 'true');

      const timestampElement = document.createElement('p');
      timestampElement.classList.add('timestamp');
      timestampElement.innerText = `Created on ${note.timestamp}`;

      const noteTextElement = document.createElement('p');
      noteTextElement.innerText = note.text;

      const removeButton = document.createElement('button');
      removeButton.classList.add('remove-btn');
      removeButton.innerText = 'x';
      removeButton.addEventListener('click', () => {
          removeNoteFromLocalStorage(note);
          noteElement.remove();
      });

      noteElement.appendChild(timestampElement);
      noteElement.appendChild(noteTextElement);
      noteElement.appendChild(removeButton);

      noteWall.appendChild(noteElement);

      // Add drag-and-drop functionality
      enableDragAndDrop(noteElement);
  }

  function saveNoteToLocalStorage(note) {
      const notes = JSON.parse(localStorage.getItem('notes')) || [];
      notes.push(note);
      localStorage.setItem('notes', JSON.stringify(notes));
  }

  function loadNotes() {
      const notes = JSON.parse(localStorage.getItem('notes')) || [];
      notes.forEach(note => addNoteToWall(note));
  }

  function removeNoteFromLocalStorage(noteToRemove) {
      const notes = JSON.parse(localStorage.getItem('notes')) || [];
      const updatedNotes = notes.filter(note => note.timestamp !== noteToRemove.timestamp);
      localStorage.setItem('notes', JSON.stringify(updatedNotes));
  }

  function enableDragAndDrop(noteElement) {
      noteElement.addEventListener('dragstart', () => {
          noteElement.classList.add('dragging');
      });

      noteElement.addEventListener('dragend', () => {
          noteElement.classList.remove('dragging');
      });

      noteWall.addEventListener('dragover', (e) => {
          e.preventDefault();
          const draggingElement = document.querySelector('.dragging');
          const afterElement = getDragAfterElement(noteWall, e.clientY);

          // Check if we're dragging over another note
          if (afterElement && draggingElement !== afterElement) {
              // Swap positions
              const parent = noteWall;
              const siblings = [...parent.querySelectorAll('.note')];
              const index1 = siblings.indexOf(draggingElement);
              const index2 = siblings.indexOf(afterElement);
              
              if (index1 > -1 && index2 > -1) {
                  // Swap notes in the DOM
                  if (index1 < index2) {
                      parent.insertBefore(draggingElement, afterElement.nextSibling);
                      parent.insertBefore(afterElement, draggingElement);
                  } else {
                      parent.insertBefore(afterElement, draggingElement.nextSibling);
                      parent.insertBefore(draggingElement, afterElement);
                  }
              }
          }
      });
  }

  function getDragAfterElement(container, y) {
      const draggableElements = [...container.querySelectorAll('.note:not(.dragging)')];

      return draggableElements.reduce((closest, child) => {
          const box = child.getBoundingClientRect();
          const offset = y - box.top - box.height / 2;
          if (offset < 0 && offset > closest.offset) {
              return { offset: offset, element: child };
          } else {
              return closest;
          }
      }, { offset: Number.NEGATIVE_INFINITY }).element;
  }
});
