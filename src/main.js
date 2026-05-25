import './style.css'
import { GoogleGenAI } from '@google/genai';

// Initialize SDK.
// WARNING: In a production app, never expose your API key in client-side code.
// For this local fun project, we are loading it from a .env file.
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

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

  if (!apiKey) {
    showError("Missing Gemini API Key! Please create a .env file and add VITE_GEMINI_API_KEY=your_key");
    return;
  }

  setLoading(true);

  try {
    const ai = new GoogleGenAI({ apiKey: apiKey });
    
    const prompt = `
You are a vocabulary expert and a reverse dictionary.
The user will describe a situation, feeling, action, or concept.
You must find the most precise and accurate English word that matches their description.

Description: "${situation}"

Provide the output strictly in the following JSON format without any markdown blocks or additional text:
{
  "word": "The exact word",
  "phonetic": "/phonetic spelling/",
  "definition": "A clear, concise definition of the word",
  "examples": ["Example sentence 1", "Example sentence 2"]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const text = response.text;
    const data = JSON.parse(text);
    
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
