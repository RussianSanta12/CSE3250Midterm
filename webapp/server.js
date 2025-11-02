const express = require('express');
const path = require('path');
const { execFile } = require('child_process');

const app = express();
const port = process.env.PORT || 8080;

// serve static JS/CSS from /static
app.use('/static', express.static(path.join(__dirname, 'static')));

// Serve index and history pages (support both / and /index.html, /history and /history.html)
app.get(['/', '/index.html'], (req, res) => {
  res.sendFile(path.join(__dirname, 'templates', 'Index.html'));
});
app.get(['/history', '/history.html'], (req, res) => {
  res.sendFile(path.join(__dirname, 'templates', 'history.html'));
});

// in-memory history of jokes (keeps while server runs)
const history = [];

app.post('/api/joke', (req, res) => {
  // Run the provided Python joke.py which prints JSON {"joke": "..."}
  const scriptPath = path.join(__dirname, 'joke.py');
  execFile('python3', [scriptPath], { maxBuffer: 1024 * 1024 }, (err, stdout, stderr) => {
    if (err) {
      console.error('Python script error:', err, stderr);
      return res.status(500).json({ error: 'Failed to run joke generator', details: stderr || err.message });
    }
    let jokeText;
    try {
      const parsed = JSON.parse(stdout);
      jokeText = parsed.joke || String(stdout).trim();
    } catch (e) {
      // If not valid JSON, use raw stdout
      jokeText = String(stdout).trim();
    }
    history.push(jokeText);
    res.json({ joke: jokeText });
  });
});

app.get('/api/history', (req, res) => {
  res.json({ history });
});

app.listen(port, () => {
  console.log(`Static React + pyjokes server listening: http://localhost:${port}`);
});