// Tiny React app (no build). Uses global React and ReactDOM from CDN.
(function () {
  const e = React.createElement;
  const { useState, useEffect } = React;

  function Home() {
    const [joke, setJoke] = useState(null);
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState(null);

    async function fetchJoke() {
      setErr(null);
      setLoading(true);
      try {
        const res = await fetch('/api/joke', { method: 'POST' });
        if (!res.ok) throw new Error('Network response not ok');
        const data = await res.json();
        setJoke(data.joke);
      } catch (e) {
        setErr('Failed to fetch joke');
      } finally {
        setLoading(false);
      }
    }

    return e('div', null,
      e('h1', null, 'Random Joke'),
      e('p', null, 'Press the button to get a new joke.'),
      e('div', { className: 'actions' },
        e('button', { className: 'btn', onClick: fetchJoke, disabled: loading }, loading ? 'Loading…' : 'Tell me a joke'),
        e('a', { className: 'btn', href: '/history' }, 'View History')
      ),
      err && e('div', { style: { color: 'crimson', marginTop: '0.5rem' } }, err),
      joke && e('div', { className: 'joke', 'aria-live': 'polite' }, joke)
    );
  }

  function HistoryPage() {
    const [history, setHistory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState(null);

    useEffect(() => {
      let mounted = true;
      fetch('/api/history')
        .then(r => {
          if (!r.ok) throw new Error('Network response not ok');
          return r.json();
        })
        .then(data => { if (mounted) setHistory(data.history || []); })
        .catch(() => { if (mounted) setErr('Failed to load history'); })
        .finally(() => { if (mounted) setLoading(false); });
      return () => { mounted = false; };
    }, []);

    return e('div', null,
      e('h1', null, 'Joke History'),
      loading && e('p', null, 'Loading…'),
      err && e('div', { style: { color: 'crimson' } }, err),
      !loading && (!history || history.length === 0) && e('p', { className: 'empty' }, 'No jokes yet.'),
      !loading && history && history.length > 0 && e('ol', null, history.map((j, i) => e('li', { key: i }, j))),
      e('div', { className: 'actions' },
        e('a', { className: 'btn', href: '/' }, 'Back Home')
      )
    );
  }

  // Mount correct component based on path
  const path = window.location.pathname || '/';
  const root = document.getElementById('root');
  if (!root) {
    console.error('Root element not found; cannot mount React app.');
  } else if (path.startsWith('/history')) {
    ReactDOM.createRoot(root).render(e(HistoryPage));
  } else {
    ReactDOM.createRoot(root).render(e(Home));
  }
})();