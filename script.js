const jokesKey = 'jokeHubData';
const defaultJokes = [
  { setup: 'Why don’t skeletons fight each other?', punchline: 'They don’t have the guts.' },
  { setup: 'What do you call fake spaghetti?', punchline: 'An impasta.' },
  { setup: 'Why did the math book look sad?', punchline: 'It had too many problems.' },
  { setup: 'I asked my bank teller to check my balance...', punchline: 'She said it was so low it needed a flashlight.' }
];

const featuredJoke = document.getElementById('featuredJoke');
const jokeList = document.getElementById('jokeList');
const jokeCount = document.getElementById('jokeCount');
const randomBtn = document.getElementById('randomBtn');
const jokeForm = document.getElementById('jokeForm');

function loadJokes() {
  const stored = localStorage.getItem(jokesKey);
  if (!stored) {
    localStorage.setItem(jokesKey, JSON.stringify(defaultJokes));
    return defaultJokes;
  }

  try {
    return JSON.parse(stored) || defaultJokes;
  } catch (error) {
    console.error('Error parsing stored jokes:', error);
    localStorage.removeItem(jokesKey);
    return defaultJokes;
  }
}

function saveJokes(jokes) {
  localStorage.setItem(jokesKey, JSON.stringify(jokes));
}

function renderFeaturedJoke(jokes) {
  if (!jokes.length) {
    featuredJoke.innerHTML = '<p>No jokes available yet. Add one above!</p>';
    return;
  }

  const joke = jokes[Math.floor(Math.random() * jokes.length)];
  featuredJoke.innerHTML = `
    <p><strong>${escapeHtml(joke.setup)}</strong></p>
    <p>${escapeHtml(joke.punchline)}</p>
  `;
}

function renderJokeList(jokes) {
  jokeList.innerHTML = '';

  if (!jokes.length) {
    jokeList.innerHTML = '<p>No jokes yet. Add your first joke.</p>';
    jokeCount.textContent = '0 jokes';
    return;
  }

  jokes.forEach((joke, index) => {
    const item = document.createElement('article');
    item.className = 'joke-item';
    item.innerHTML = `
      <p><strong>${index + 1}. ${escapeHtml(joke.setup)}</strong></p>
      <p>${escapeHtml(joke.punchline)}</p>
      <span class="joke-meta">Joke #${index + 1}</span>
    `;
    jokeList.appendChild(item);
  });

  jokeCount.textContent = `${jokes.length} joke${jokes.length === 1 ? '' : 's'}`;
}

function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function refresh() {
  const jokes = loadJokes();
  renderFeaturedJoke(jokes);
  renderJokeList(jokes);
}

randomBtn.addEventListener('click', () => {
  const jokes = loadJokes();
  renderFeaturedJoke(jokes);
});

jokeForm.addEventListener('submit', event => {
  event.preventDefault();

  const setupInput = document.getElementById('setup');
  const punchlineInput = document.getElementById('punchline');
  const setup = setupInput.value.trim();
  const punchline = punchlineInput.value.trim();

  if (!setup || !punchline) {
    return;
  }

  const jokes = loadJokes();
  jokes.unshift({ setup, punchline });
  saveJokes(jokes);
  refresh();

  setupInput.value = '';
  punchlineInput.value = '';
  setupInput.focus();
});

refresh();
