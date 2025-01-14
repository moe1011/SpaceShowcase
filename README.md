# Space Showcase

**Space Showcase** is an engaging web application that highlights images and videos from NASA's Astronomy Picture of the Day (APOD) API. It enhances the user experience with audio-based expert explanations and interactive animations. Using OpenAI's GPT-4o for natural language processing and OpenAI's TTS for lifelike speech synthesis, users can enjoy seamless and immersive interactions with a cosmic-themed UI.

---

## Features

### 🌌 Explore Space Content
- Fetch daily astronomy images or videos from NASA's APOD API.
- Display media with detailed explanations and metadata (title, date).

### 🗣️ Expert Audio Explanations
- Rewrite image explanations into conversational text using OpenAI's GPT-4.
- Convert the rewritten text into lifelike speech with OpenAI's TTS API.

### 🤖 Interactive Expert Puppet
- A fun, animated puppet "expert" reacts in sync with the audio.
- The puppet "talks" by moving its head while audio is playing.

### 🎨 Modern UI and Visual Enhancements
- Gradient background with a cosmic theme.
- Special rainbow-animated buttons for interactive features.
- Responsive design optimized for various screen sizes.

---

## Demo

🚀 **Live Demo**: [Click Here](https://space-showcase.vercel.app/)

---

## Technologies Used

- **Frontend Framework**: React (with hooks)
- **Styling**: Tailwind CSS
- **Icons**: React Icons
- **APIs**:
  - **NASA's APOD API**: Fetches stunning images and videos of space.
  - **OpenAI GPT-4**: Rewrites technical explanations into natural, conversational text.
  - **OpenAI TTS API**: Generates lifelike audio for expert explanations.
- **Audio Handling**: Web Audio API for volume detection and animations.
- **Hosting**: Vercel

---

## Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/moe1011/space-showcase.git
cd space-showcase

2. Install Dependencies

npm install

3. Set Up Environment Variables
	•	Create a .env file in the root directory.
	•	Add your API keys:

NASA_API_KEY=your-nasa-api-key
OPENAI_API_KEY=your-openai-api-key



4. Install Vercel CLI for Local Testing
	•	Since the app is hosted on Vercel, use their CLI for local testing:

npm install -g vercel


	•	Use vercel dev to run the app locally instead of npm start:

vercel dev



5. Deploy to Vercel
	•	Run vercel to deploy your project:

vercel

File Structure

src/
├── components/
│   ├── NasaImage.jsx        # Main component for fetching and displaying space content
│   ├── Footer.jsx           # Footer with GitHub and portfolio links
│   ├── ExpertPuppet.jsx     # Animated puppet reacting to audio
│   └── hooks/
│       └── useAudioLogic.js # Custom hook for managing audio and animations
├── App.jsx                  # App container
├── App.css                  # App-level styles
└── index.js                 # Entry point

Key Features

1. Fetch and Display Space Content
	•	Randomly fetch images or videos from NASA’s APOD API.
	•	Display media with explanations, titles, and metadata.

2. Enhanced Audio Explanations
	•	Rewrite technical NASA explanations into conversational text with OpenAI’s GPT-4.
	•	Generate engaging, lifelike audio explanations using OpenAI’s TTS API.

3. Interactive Puppet Animation
	•	Reacts to audio by moving in sync with detected volume levels.
	•	Slides in when triggered, adding a fun, educational touch.

4. Responsive Design
	•	Fully responsive layout for mobile, tablet, and desktop screens.
	•	Gradient cosmic background adds to the space-themed aesthetic.

How It Works
	1.	Random NASA Media:
	•	Click the Next Image button to fetch a random image or video.
	•	View the media along with its explanation.
	2.	Expert Explanations:
	•	Click the Glowing Expert Explanation button to:
	1.	Rewrite the explanation using OpenAI GPT-4.
	2.	Generate an audio version using OpenAI TTS.
	•	Watch the puppet animate as it “speaks” the explanation.

Acknowledgments
	•	NASA APOD API: For providing stunning daily space content.
	•	OpenAI GPT-4: For rewriting technical explanations into conversational language.
	•	OpenAI TTS: For generating lifelike audio that complements the expert puppet.
	•	React Icons: For beautifully designed, lightweight icons.
	•	Tailwind CSS: For modern and responsive UI design.
	•	Web Audio API: For enabling dynamic volume-based animations.
	•	Vercel: For seamless deployment and local development support.


Developer Contact

💼 Portfolio: https://moe1011.github.io
🐙 GitHub: https://github.com/moe1011
📧 Email: moe.a1011@gmail.com

Feel free to reach out for collaboration or feedback! 🚀
