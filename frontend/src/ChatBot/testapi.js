const axios = require('axios');

const testChatbotApi = async () => {
  const openaiApiKey = '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';
  
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: 'Hello!' }],
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openaiApiKey}`,
        },
      }
    );
    console.log('API response:', response.data);
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
  }
};

testChatbotApi();
