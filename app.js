const express = require('express');
const multer = require('multer');
const fs = require('fs').promises;
const path = require('path');
const app = express();
const upload = multer({ dest: 'uploads/' });

app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <title>Chatbot HTML Generator</title>
            <style>
                body { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; }
                h1 { color: #333; }
                form { display: flex; flex-direction: column; gap: 10px; }
                input, button { padding: 10px; font-size: 16px; }
                button { background: #f86c30; color: white; border: none; cursor: pointer; }
                button:hover { background: #c2d5fd; }
            </style>
        </head>
        <body>
            <h1>Generate Chatbot HTML</h1>
            <form action="/generate" method="post" enctype="multipart/form-data">
                <label>Upload Flowise JSON:</label>
                <input type="file" name="flowiseJson" accept=".json" required>
                <button type="submit">Generate HTML</button>
            </form>
        </body>
        </html>
    `);
});

app.post('/generate', upload.single('flowiseJson'), async (req, res) => {
    try {
        const json = JSON.parse(await fs.readFile(req.file.path));
        const chatflowId = json.id || json.chatflowId || 'YOUR_CHATFLOW_ID';
        const apiHost = json.apiHost || 'https://cloud.flowiseai.com';
        const template = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Oil Spill Response Chat</title>
                <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&display=swap" rel="stylesheet">
                <style>
                    body { margin: 4px; padding: 0; font-family: 'DM Sans', sans-serif; height: 100vh; overflow: hidden; background: transparent; box-sizing: border-box; }
                    .chat-container { display: flex; flex-direction: column; height: calc(100% - 8px); width: calc(100% - 8px); background: #f6f6f6; box-shadow: 0 4px 12px rgba(0,0,0,0.15); border-radius: 8px; box-sizing: border-box; }
                    .chat-header { background: #f86c30; color: white; padding: 15px; text-align: center; font-weight: 700; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
                    .chat-messages { flex: 1; padding: 20px; overflow-y: auto; background: #f6f6f6; }
                    .chat-input-area { padding: 15px; background: #f6f6f6; border-top: 1px solid #dee2e6; }
                    .input-group { display: flex; gap: 10px; }
                    .chat-input { flex: 1; padding: 12px 16px; border: 1px solid #ddd; border-radius: 25px; outline: none; font-size: 14px; background: #ffffff; }
                    .send-button { background: #f86c30; color: white; border: none; border-radius: 50%; width: 45px; height: 45px; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 16px; }
                    .send-button:hover { background: #c2d5fd; }
                    .message { margin-bottom: 15px; display: flex; gap: 10px; }
                    .message.user { flex-direction: row-reverse; }
                    .message-content { max-width: 70%; padding: 12px 16px; border-radius: 18px; word-wrap: break-word; }
                    .message.bot .message-content { background: #ffffff; color: #333; }
                    .message.user .message-content { background: #ffd5fc; color: #333; }
                    .typing-indicator { display: none; margin-bottom: 15px; }
                    .typing-dots { display: flex; gap: 5px; }
                    .typing-dot { width: 8px; height: 8px; background: #6e0208; border-radius: 50%; animation: typing 1.4s infinite; }
                    .typing-dot:nth-child(2) { animation-delay: 0.2s; }
                    .typing-dot:nth-child(3) { animation-delay: 0.4s; }
                    @keyframes typing { 0%, 20% { transform: translateY(0); opacity: 1; } 40% { transform: translateY(-5px); opacity: 0.6; } 60%, 100% { transform: translateY(0); opacity: 1; } }
                    .welcome-message { text-align: center; color: #666; padding: 20px; background: #ffffff; border-radius: 10px; margin-bottom: 20px; }
                </style>
            </head>
            <body>
                <div class="chat-container">
                    <div class="chat-header">Ulaliz - Matchbox Smart Learning Assistant</div>
                    <div class="chat-messages" id="chatMessages">
                        <div class="welcome-message">Hi! I'm Ulaliz, your expert tutor for this course. I'm here to help you better understand and master the Oil Spill Response material. What would you like to explore or clarify today? 🌊</div>
                    </div>
                    <div class="typing-indicator" id="typingIndicator">
                        <div class="typing-dots">
                            <span class="typing-dot"></span>
                            <span class="typing-dot"></span>
                            <span class="typing-dot"></span>
                        </div>
                    </div>
                    <div class="chat-input-area">
                        <div class="input-group">
                            <input type="text" class="chat-input" id="chatInput" placeholder="Type your message..." autocomplete="off">
                            <button class="send-button" id="sendButton">➤</button>
                        </div>
                    </div>
                </div>
                <script>
                    class ChatWidget {
                        constructor() {
                            this.chatMessages = document.getElementById('chatMessages');
                            this.chatInput = document.getElementById('chatInput');
                            this.sendButton = document.getElementById('sendButton');
                            this.typingIndicator = document.getElementById('typingIndicator');
                            this.apiUrl = '${apiHost}/api/v1/prediction/${chatflowId}';
                            this.sessionId = this.generateSessionId();
                            this.bindEvents();
                        }
                        generateSessionId() {
                            return 'session_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
                        }
                        bindEvents() {
                            this.sendButton.addEventListener('click', () => this.sendMessage());
                            this.chatInput.addEventListener('keypress', (e) => {
                                if (e.key === 'Enter') this.sendMessage();
                            });
                            this.chatInput.focus();
                        }
                        addMessage(content, isUser = false) {
                            const messageDiv = document.createElement('div');
                            messageDiv.className = \`message \${isUser ? 'user' : 'bot'}\`;
                            const contentDiv = document.createElement('div');
                            contentDiv.className = 'message-content';
                            contentDiv.textContent = content;
                            messageDiv.appendChild(contentDiv);
                            this.chatMessages.appendChild(messageDiv);
                            this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
                        }
                        showTyping() {
                            this.typingIndicator.style.display = 'block';
                            this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
                        }
                        hideTyping() {
                            this.typingIndicator.style.display = 'none';
                        }
                        async sendMessage() {
                            const message = this.chatInput.value.trim();
                            if (!message) return;
                            this.addMessage(message, true);
                            this.chatInput.value = '';
                            this.chatInput.disabled = true;
                            this.sendButton.disabled = true;
                            this.showTyping();
                            try {
                                const response = await fetch(this.apiUrl, {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({
                                        question: message,
                                        sessionId: this.sessionId,
                                        chatId: this.sessionId
                                    })
                                });
                                if (!response.ok) throw new Error(\`HTTP error! status: \${response.status}\`);
                                const data = await response.json();
                                this.hideTyping();
                                const botMessage = data.text || data.answer || data.response || "I'm sorry, I couldn't process that request.";
                                this.addMessage(botMessage, false);
                            } catch (error) {
                                console.error('Chat error:', error);
                                this.hideTyping();
                                this.addMessage("I'm sorry, there was an error processing your message. Please try again.", false);
                            } finally {
                                this.chatInput.disabled = false;
                                this.sendButton.disabled = false;
                                this.chatInput.focus();
                            }
                        }
                    }
                    document.addEventListener('DOMContentLoaded', () => {
                        new ChatWidget();
                    });
                </script>
            </body>
            </html>
        `;
        res.set('Content-Disposition', 'attachment; filename=chatbot.html');
        res.send(template);
    } catch (error) {
        res.status(500).send('Error processing JSON. Ensure the Flowise JSON is valid.');
    } finally {
        await fs.unlink(req.file.path);
    }
});

app.listen(process.env.PORT || 3000, () => {
    console.log('Server running on port', process.env.PORT || 3000);
});
