const axios = require('axios');

(async () => {
  const host = process.env.OLLAMA_HOST || 'http://localhost:11434';
  try {
    console.log('Checking Ollama at', host);
    const res = await axios.get(`${host}/api/models`, { timeout: 5000 });
    console.log('Ollama models:', res.data);
    process.exit(0);
  } catch (err) {
    console.error('Ollama connectivity check failed:', err.message || err);
    if (err.response) console.error('Response:', err.response.data);
    process.exit(2);
  }
})();