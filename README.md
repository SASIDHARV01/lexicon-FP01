# Lexicon - Find The Right Word

                                                                have a look - https://lexicon-fp-01.vercel.app/
Lexicon is a premium, modern web application designed for English learners and anyone who frequently experiences "tip of the tongue" moments. You simply describe a situation, feeling, or action, and Lexicon uses Google's Gemini AI to find the exact English word that matches your description.

## Features
- **Situation-to-Word Translation:** Describe a feeling and get the exact word.
- **Premium Glassmorphism UI:** Built with modern CSS featuring smooth cubic-bezier animations, dark mode, and ambient glowing backgrounds.
- **AI-Powered:** Utilizes the official `@google/genai` SDK and Gemini 2.5 Flash for blazing fast and highly accurate responses.
- **Comprehensive Results:** Returns the word, phonetic spelling, a clear definition, and example sentences in context.

## Tech Stack
- **Frontend:** HTML5, CSS3, Vanilla JavaScript
- **Build Tool:** Vite
- **AI Integration:** Google Gemini API

## Local Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/SASIDHARV01/lexicon-FP1.git
   cd lexicon-FP1
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Setup:**
   Create a `.env` file in the root of the project and add your Gemini API Key:
   ```env
   VITE_GEMINI_API_KEY=your_api_key_here
   ```
   *(You can get a free key from [Google AI Studio](https://aistudio.google.com/app/apikey))*

4. **Run the Development Server:**
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

## Disclaimer
> **Security Note:** Never commit your `.env` file to version control. The `.gitignore` has been configured to exclude `.env` files to keep your API keys secure.
