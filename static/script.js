let currentMode = 'normal';

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('send-button').addEventListener('click', sendMessage);
    document.getElementById('user-input').addEventListener('keydown', function (e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    const darkModeToggle = document.getElementById('dark-mode-toggle');
    darkModeToggle.addEventListener('click', toggleDarkMode);

    if (localStorage.getItem('darkMode') === 'true') {
        document.body.setAttribute('data-theme', 'dark');
    }
});

function sendMessage() {
    const input = document.getElementById('user-input');
    const message = input.value.trim();

    if (message) {
        addMessageToChat(message, 'user');

        fetch('/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: message,
                mode: currentMode
            })
        })
        .then(response => response.json())
        .then(data => {
            addMessageToChat(data.response, 'bot');
            updateStats(data.stats);
        })
        .catch(error => {
            console.error('Error:', error);
            addMessageToChat('Sorry, there was an error processing your request.', 'bot');
        });

        input.value = '';
    }
}

function addMessageToChat(message, sender) {
    const chatContainer = document.getElementById('chat-container');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;

    if (sender === 'bot') {
        messageDiv.innerHTML = message;
    } else {
        messageDiv.textContent = message;
    }

    chatContainer.appendChild(messageDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

function updateStats(stats) {
    document.getElementById('xp-value').textContent = `${stats.experience_points} XP`;
    document.getElementById('level-value').textContent = stats.skill_level;
    document.getElementById('streak-value').textContent =
        `${stats.streak_days} day${stats.streak_days !== 1 ? 's' : ''}`;
}

function setMode(mode) {
    currentMode = mode;
    document.querySelectorAll('.mode-button').forEach(button => {
        button.classList.remove('active');
    });
    document.querySelector(`.mode-button[onclick="setMode('${mode}')"]`).classList.add('active');
}

function toggleDarkMode() {
    const body = document.body;
    const isDarkMode = body.getAttribute('data-theme') === 'dark';
    body.setAttribute('data-theme', isDarkMode ? 'light' : 'dark');
    localStorage.setItem('darkMode', !isDarkMode);
}