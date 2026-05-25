import './style.css'

// DOM Elements
const situationInput = document.getElementById('situation-input');
const findBtn = document.getElementById('find-btn');
const btnText = document.querySelector('.btn-text');
const loader = document.querySelector('.loader');
const resultContainer = document.getElementById('result-container');
const errorContainer = document.getElementById('error-container');
const wordEl = document.getElementById('result-word');
const phoneticEl = document.getElementById('result-phonetic');
const definitionEl = document.getElementById('result-definition');
const examplesEl = document.getElementById('result-examples');
const errorMessageEl = document.getElementById('error-message');

const setLoading = (isLoading) => {
  findBtn.disabled = isLoading;
  if (isLoading) {
    btnText.classList.add('hidden');
    loader.classList.remove('hidden');
    resultContainer.classList.add('hidden');
    errorContainer.classList.add('hidden');
  } else {
    btnText.classList.remove('hidden');
    loader.classList.add('hidden');
  }
};

const showError = (message) => {
  errorMessageEl.textContent = message;
  errorContainer.classList.remove('hidden');
  resultContainer.classList.add('hidden');
};

const displayResult = (data) => {
  wordEl.textContent = data.word;
  phoneticEl.textContent = data.phonetic || '';
  definitionEl.textContent = data.definition;
  
  examplesEl.innerHTML = '';
  if (data.examples && data.examples.length > 0) {
    data.examples.forEach(example => {
      const li = document.createElement('li');
      li.textContent = `"${example}"`;
      examplesEl.appendChild(li);
    });
  }
  
  // Reset animation
  resultContainer.classList.remove('reveal');
  // Trigger reflow to restart animation
  void resultContainer.offsetWidth;
  
  resultContainer.classList.remove('hidden');
  resultContainer.classList.add('reveal');
};

const findWord = async () => {
  const situation = situationInput.value.trim();
  if (!situation) return;

  setLoading(true);

  try {
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ situation }),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch from server');
    }

    const data = await response.json();
    displayResult(data);
  } catch (error) {
    console.error("Error finding word:", error);
    showError("Oops! Something went wrong while trying to find the word. Please try again.");
  } finally {
    setLoading(false);
  }
};

findBtn.addEventListener('click', findWord);
situationInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    findWord();
  }
});
