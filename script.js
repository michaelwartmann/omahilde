// Memorial Website JavaScript for Oma Hilde

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('condolenceForm');
    const messagesList = document.getElementById('messagesList');
    
    // Load existing messages from localStorage
    loadMessages();
    
    // Handle form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('name').value.trim();
        const message = document.getElementById('message').value.trim();
        
        if (name && message) {
            // Create message object
            const newMessage = {
                id: Date.now(),
                name: name,
                message: message,
                date: new Date().toLocaleDateString('de-DE', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                })
            };
            
            // Save message
            saveMessage(newMessage);
            
            // Clear form
            form.reset();
            
            // Show success message
            showSuccessMessage();
            
            // Reload messages
            loadMessages();
        }
    });
    
    function saveMessage(message) {
        let messages = getMessages();
        messages.unshift(message); // Add to beginning of array
        localStorage.setItem('omaHildeMessages', JSON.stringify(messages));
    }
    
    function getMessages() {
        const stored = localStorage.getItem('omaHildeMessages');
        return stored ? JSON.parse(stored) : [];
    }
    
    function loadMessages() {
        const messages = getMessages();
        
        if (messages.length === 0) {
            messagesList.innerHTML = '<div class="no-messages">Noch keine Nachrichten. Seien Sie der Erste, der eine liebevolle Erinnerung teilt.</div>';
            return;
        }
        
        messagesList.innerHTML = messages.map(message => `
            <div class="message-item">
                <div class="message-header">
                    <span class="message-name">${escapeHtml(message.name)}</span>
                    <span class="message-date">${message.date}</span>
                </div>
                <div class="message-text">${escapeHtml(message.message).replace(/\n/g, '<br>')}</div>
            </div>
        `).join('');
    }
    
    function showSuccessMessage() {
        // Create temporary success message
        const successDiv = document.createElement('div');
        successDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #4CAF50;
            color: white;
            padding: 15px 20px;
            border-radius: 5px;
            z-index: 1000;
            box-shadow: 0 4px 8px rgba(0,0,0,0.2);
            transition: opacity 0.3s;
        `;
        successDiv.textContent = 'Ihre Nachricht wurde hinzugefügt. Vielen Dank.';
        
        document.body.appendChild(successDiv);
        
        // Remove after 3 seconds
        setTimeout(() => {
            successDiv.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(successDiv);
            }, 300);
        }, 3000);
    }
    
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
});

// GitHub Pages compatibility - export messages function for potential backup
window.exportMessages = function() {
    const messages = JSON.parse(localStorage.getItem('omaHildeMessages') || '[]');
    const dataStr = JSON.stringify(messages, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = 'oma-hilde-messages-backup.json';
    link.click();
};