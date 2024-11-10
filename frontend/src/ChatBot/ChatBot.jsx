import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './ChatBot.css';

const RecipeChatbot = () => {
  const [input, setInput] = useState('');
  const [chatLog, setChatLog] = useState([]);
  const [loading, setLoading] = useState(false);

  const cohereApiKey = 'PK3nO0NRN2vJgxbQp8xIFaljFceISpf5cRm5mLqN'; // Replace with your Cohere API key

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const chatWindowRef = useRef(null); // Reference for the chat window

  const handleSend = async () => {
    if (!input) return;

    const newChatLog = [...chatLog, { user: 'user', message: input }];
    setChatLog(newChatLog);
    setInput('');
    setLoading(true);

    try {
      const response = await axios.post(
        'https://api.cohere.ai/v1/generate', // Cohere's generation endpoint
        {
          model: 'command-xlarge-nightly', // Cohere’s conversational model
          prompt: `User: ${input}\nBot:`, // Setting up a conversational prompt
          max_tokens: 500, // Adjust token limit as needed
          temperature: 0.7,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${cohereApiKey}`,
          },
        }
      );
      // setChatLog([...newChatLog, { user: 'bot', message: response.data }]);
      const botMessage = response.data.generations[0].text.trim();
      setChatLog([...newChatLog, { sender: 'bot', message: botMessage }]);
    } catch (error) {
      console.error('Error:', error.response ? error.response.data : error.message);
      setChatLog([...newChatLog, { user: 'You', message: 'Server is busy, please try again later.' }]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [chatLog]);
  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && input) {
      handleSend();
    }
  };

  return (
    <div className="chatbot-container">
    <div className="chatbot-header">
      <h2 className="chatbot-headtext">Recipe Chatbot</h2>
    </div>
    <div className="chat-window" ref={chatWindowRef}>
      {chatLog.map((entry, index) => (
        <div key={index} className={`chat-message ${entry.sender}`}>
        <strong>{entry.sender === 'bot' ? 'Cheffi ' : 'You '}:</strong> {entry.message}
      </div>

      ))}
    </div>
    <div className="input-container">
      <input
        type="text"
        className="chat-input"
        value={input}
        onChange={handleInputChange}
        onKeyPress={handleKeyPress}
        placeholder="Type your message..."
      />
      <button onClick={handleSend} className="send-button" disabled={!input || loading}>
        {loading ? 'Loading...' : 'Send'}
      </button>
    </div>
  </div>
);
};
export default RecipeChatbot;
