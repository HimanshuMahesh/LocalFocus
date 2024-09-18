document.addEventListener('DOMContentLoaded', () => {
    const entryList = document.getElementById('journalEntries');
    const contextMenu = document.createElement('div');
    contextMenu.classList.add('context-menu');
    contextMenu.innerHTML = `<a href="#" id="deleteEntry">Remove Entry</a>`;
    document.body.appendChild(contextMenu);

    let currentEntryCard = null;

    function loadEntries() {
        const savedEntries = JSON.parse(localStorage.getItem('entries')) || [];
        savedEntries.forEach(entry => {
            addEntryToList(entry.text, entry.timestamp, false);
        });
    }

    function saveEntries() {
        const entries = [];
        document.querySelectorAll('.entry-card').forEach(card => {
            const timestamp = card.querySelector('.timestamp').textContent;
            const text = card.querySelector('.entry-content').textContent;
            entries.push({ text, timestamp });
        });
        localStorage.setItem('entries', JSON.stringify(entries));
    }

    function addEntryToList(text, timestamp, prepend = true) {
        const entryCard = document.createElement('li');
        entryCard.classList.add('entry-card');
        
        entryCard.innerHTML = `
            <div class="timestamp">${timestamp}</div>
            <p class="entry-summary">${text.slice(0, 100)}...</p>
            <div class="entry-content">${text}</div>
        `;
        
        entryCard.addEventListener('click', function() {
            entryCard.classList.toggle('expanded');
        });

        if (prepend) {
            entryList.prepend(entryCard);
        } else {
            entryList.appendChild(entryCard);
        }

        saveEntries();
    }

    entryList.addEventListener('contextmenu', function(event) {
        event.preventDefault();
        if (event.target.closest('.entry-card')) {
            currentEntryCard = event.target.closest('.entry-card');
            contextMenu.style.display = 'block';
            contextMenu.style.top = `${event.pageY}px`;
            contextMenu.style.left = `${event.pageX}px`;
        } else {
            contextMenu.style.display = 'none';
        }
    });

    document.addEventListener('click', function() {
        contextMenu.style.display = 'none';
    });

    document.getElementById('deleteEntry').addEventListener('click', function() {
        if (currentEntryCard) {
            currentEntryCard.remove();
            saveEntries();
            currentEntryCard = null;
        }
        contextMenu.style.display = 'none';
    });

    document.getElementById('addEntryButton').addEventListener('click', function() {
        const entryText = document.getElementById('journalEntry').value.trim();
        
        if (entryText === '') {
            alert('Please write something before adding an entry.');
            return;
        }

        const timestamp = new Date();
        const formattedTime = timestamp.toLocaleDateString() + ' ' + timestamp.toLocaleTimeString();
        
        addEntryToList(entryText, formattedTime);
        document.getElementById('journalEntry').value = '';
    });

    document.getElementById('journalEntry').addEventListener('keydown', function(event) {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            document.getElementById('addEntryButton').click();
        }
    });

    loadEntries();
});
