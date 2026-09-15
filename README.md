# ✝️ VerseUp Arena

### Arabic Bible Verses • Games • Learning • Faith

**VerseUp Arena** is a modular Arabic Bible web application that combines **Scripture exploration, verse image generation, and interactive Bible games** in one lightweight, mobile-friendly experience.

The project is designed to make engaging with the Bible more interactive — whether you're looking for a verse to share, memorizing Scripture, testing your Bible knowledge, or simply playing a quick game.

🌐 **Live Website:** https://verse-up-arena.vercel.app
📦 **Repository:** https://github.com/MichaelMansour256/bible-quote-generator

---

## ✨ Features

### 📖 Verse Explorer & Image Generator

Search and explore the Arabic Bible, then turn any verse into a shareable image.

* Browse by **Book → Chapter → Verse**
* Search by:

  * Exact verse reference
  * Book name
  * Book + chapter
  * Free-text search
* Generate **1080 × 1080** verse images
* Choose from **12 Arabic fonts**
* Choose from multiple background styles
* Optional logo overlay
* Automatic light/dark logo contrast
* Download generated verses as PNG
* Arabic Bible references are included in downloaded filenames

### 🔎 Smart Bible Search

VerseUp Arena supports multiple search patterns and automatically determines the most appropriate search mode.

| Search       | Result                               |
| ------------ | ------------------------------------ |
| `يوحنا 3:16` | Exact verse                          |
| `يوحنا 3`    | Chapters matching the chapter number |
| `يوحنا`      | Chapters from the selected book      |
| `الرب راعي`  | Full-text Bible search               |

Search results can be navigated using the keyboard, expanded to reveal verses, and selected directly to generate a verse image.

---

# 🎮 Bible Games

VerseUp Arena includes **six interactive Bible games**, designed around Scripture, Bible knowledge, memorization, and Arabic language interaction.

## 🧠 Memory

Test your ability to remember Scripture.

* Select a specific verse or generate a random one
* Hide a percentage of words based on difficulty
* Fill missing words by:

  * Typing
  * Tapping word-bank chips
* Automatic answer checking
* Timer and scoring
* High-score tracking
* Multiple difficulty levels
* Progress and preferences saved locally

Difficulty ranges from approximately **20% hidden words on Easy** to **60% on Expert**.

---

## 🔄 Reverse Words

Guess the original Bible term from its reversed characters.

Choose between:

* Books
* Names
* Places
* Random terms

The game features:

* Live answer checking
* Automatic progression after correct answers
* Timer-based scoring
* High scores
* Skip functionality
* Persistent game state

---

## 🔀 Scrambled Words

Unscramble Bible-related words and terms.

Players can solve words using either:

* The keyboard
* On-screen letter tiles

Features include:

* Live answer checking
* Automatic progression
* Category filtering
* Difficulty filtering
* Timer-based scoring
* Mobile-friendly input
* Persistent progress

---

## 🟩 HolyWordle

A Bible-themed Wordle-style game.

Guess the hidden Bible word within **six attempts**.

### Features

* 4–7 letter word lengths
* Bible-specific vocabulary
* Books, people, places, prophets, kings, women, tribes, feasts, artifacts, and more
* Arabic-aware letter matching
* Duplicate-letter handling
* On-screen Arabic keyboard
* Physical keyboard support
* Timer and scoring
* Haptic feedback where supported
* Persistent game state

The Arabic matching system normalizes common character variations so that equivalent forms such as:

`أ / ا`
`ة / ه`
`ى / ي`

can be handled consistently.

---

## 🃏 Who Am I?

A Bible character flash-card game.

Each card provides a clue about a person from the Bible. Flip the card to reveal the answer.

### Difficulty Levels

**سهل — Easy**
Well-known Biblical figures.

**متوسط — Medium**
Less obvious Old and New Testament figures.

**صعب — Hard**
More obscure Biblical characters.

The current dataset contains **114 curated Biblical characters**, organized by categories such as prophets, kings, apostles, women, and others.

Players can self-grade each card:

* ✓ عرفتها
* ✗ لم أعرفها

The game calculates the percentage of characters recognized by the player.

On mobile devices, flipped cards can also be graded using swipe gestures.

---

## 😀 EmojiVerse

Decode Bible stories, events, miracles, parables, visions, and verses using emojis.

For example:

> 🍎 🐍 🌳

Players flip the card to reveal the Biblical answer and a short explanation.

### Features

* Three difficulty levels
* Curated Bible stories and events
* Story categories
* Self-grading
* Score tracking
* Mobile swipe gestures
* Persistent difficulty selection

The current dataset contains **62 curated EmojiVerse cards**.

---

# 🏗️ Architecture

VerseUp Arena is intentionally built as a **modular static web application**.

The application does not require a backend server or build pipeline.

```text
bible-quote-generator/
│
├── index.html
├── styles.css
├── package.json
├── vercel.json
├── sitemap.xml
├── robots.txt
│
├── assets/
│   ├── logo.svg
│   ├── verseup_logo.png
│   └── og-image.png
│
├── js/
│   ├── main.js
│   │
│   ├── core/
│   │   ├── bible-api.js
│   │   ├── bible-database.js
│   │   └── i18n.js
│   │
│   └── features/
│       ├── quote-feature.js
│       │
│       └── games/
│           ├── memory-game.js
│           ├── reverse-game.js
│           ├── scramble-game.js
│           ├── whoami-game.js
│           ├── wordle-game.js
│           ├── emojiverse-game.js
│           └── game-utils.js
│
└── tests/
```

### Design Principles

The codebase separates the application into three main layers:

**Core**

Responsible for shared functionality such as Bible API communication, Bible metadata, and internationalization.

**Features**

Contains user-facing functionality such as the verse generator and games.

**Utilities**

Contains reusable logic such as Arabic normalization, word scrambling, reversing, term pools, and difficulty handling.

`main.js` acts primarily as the application shell responsible for initialization and event wiring, while feature-specific logic remains inside dedicated modules.

---

# 🌐 Technology

VerseUp Arena is intentionally lightweight and uses browser-native technologies.

| Technology              | Purpose                             |
| ----------------------- | ----------------------------------- |
| HTML5                   | Application structure               |
| CSS3                    | Responsive UI and visual design     |
| JavaScript (ES Modules) | Application logic                   |
| Canvas API              | Verse image generation              |
| LocalStorage            | Preferences, scores, and game state |
| Vercel                  | Static deployment                   |
| Bible API               | Arabic Scripture data               |

No frontend framework is required.

There is also **no build step** and no package installation required to run the application locally.

---

# 📚 Bible Data

The application currently uses the **Arabic Smith & Van Dyck Bible text** provided through:

`https://api.getbible.net/v2/arabicsv.json`

Bible book metadata is also maintained locally in:

```text
js/core/bible-database.js
```

This local database provides an offline metadata fallback used by the game systems.

The book names are aligned with the API naming conventions to keep live Bible data and local game datasets consistent.

---

# 💾 Local Storage

VerseUp Arena is designed to remember the player's experience without requiring an account or backend database.

Depending on the feature, `localStorage` is used for:

* Selected verses
* Game difficulty
* High scores
* Timers and game state
* HolyWordle progress
* Selected categories
* In-progress rounds
* User preferences

This allows players to leave the website and continue their experience later on the same browser.

---

# ⌨️ Keyboard & Mobile Interaction

VerseUp Arena is designed to work across desktop and mobile devices.

### Global

| Shortcut       | Action                   |
| -------------- | ------------------------ |
| `Ctrl + Enter` | Generate verse image     |
| `Ctrl + S`     | Download generated image |

### Search

| Shortcut | Action           |
| -------- | ---------------- |
| `↑ / ↓`  | Navigate results |
| `Enter`  | Select result    |
| `Escape` | Close results    |

### Games

| Shortcut    | Action                    |
| ----------- | ------------------------- |
| `Enter`     | Submit / interact         |
| `Space`     | Flip flash cards          |
| `Backspace` | Delete HolyWordle letters |
| Swipe Left  | Mark card as known        |
| Swipe Right | Mark card as unknown      |

HolyWordle also supports an on-screen Arabic keyboard for mobile users.

---

# 📱 Mobile-First Interaction

Several parts of VerseUp Arena are specifically designed for touch devices.

The games support:

* Large touch targets
* On-screen keyboards
* Tap-to-select word chips
* Swipe gestures
* Haptic feedback where supported
* Responsive layouts
* RTL Arabic interaction

The goal is to make the games playable without requiring a physical keyboard.

---

# 🔍 SEO & Sharing

VerseUp Arena includes metadata and assets for search engines and social sharing.

The project includes:

* `meta description`
* Canonical URL
* Open Graph metadata
* Twitter Card metadata
* `robots.txt`
* `sitemap.xml`
* JSON-LD structured data
* Branded Open Graph image

The website is designed so that links shared through platforms such as WhatsApp, Facebook, Instagram, and LinkedIn can display a branded preview card.

---

# 🚀 Running Locally

Because VerseUp Arena is a static website, no build process is required.

Clone the repository:

```bash
git clone https://github.com/MichaelMansour256/bible-quote-generator.git
cd bible-quote-generator
```

Start a local HTTP server:

```bash
python -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

> Opening `index.html` directly may cause browser restrictions with ES modules. Using a local HTTP server is recommended.

---

# ☁️ Deployment

VerseUp Arena can be deployed directly as a static site.

The production deployment currently runs on **Vercel**:

https://verse-up-arena.vercel.app

No backend server is required.

A deployment can be performed by connecting the GitHub repository to Vercel or by deploying the static project through the Vercel CLI.

---

# 🧩 Extending the Project

The modular architecture makes it straightforward to add new features.

### Adding a New Game

Create a new module under:

```text
js/features/games/
```

Then implement the game-specific logic without modifying unrelated games.

Shared functionality should be placed in:

```text
js/features/games/game-utils.js
```

This keeps common Arabic processing and game utilities centralized.

### Adding a New Verse Feature

Verse-related functionality belongs in:

```text
js/features/quote-feature.js
```

Core Bible API functionality belongs in:

```text
js/core/bible-api.js
```

This separation helps prevent API logic from becoming tightly coupled to the UI.

---

# 🧠 Arabic Text Handling

Arabic presents several challenges for word-based games, especially when comparing user input.

VerseUp Arena centralizes Arabic normalization to handle common differences such as:

* Arabic diacritics
* Alef variants
* Taa Marbuta
* Yaa / Alef Maqsura variants
* Other normalization requirements used by the games

The normalization logic is shared across games instead of being duplicated inside individual modules.

---

# 🧪 Project Structure Philosophy

VerseUp Arena follows a few simple principles:

* **Keep the application static whenever possible**
* **Separate core services from UI features**
* **Keep each game independent**
* **Reuse shared game utilities**
* **Centralize Arabic normalization**
* **Persist useful state locally**
* **Design interactions for both desktop and mobile**
* **Avoid unnecessary frameworks and infrastructure**

The result is a small, portable application that can be hosted almost anywhere.

---

# 🗺️ Roadmap

Possible future improvements include:

* [ ] More Bible games
* [ ] Additional Arabic Bible datasets / translations
* [ ] Expanded Bible character and story databases
* [ ] More verse image templates
* [ ] Custom image themes
* [ ] Improved accessibility
* [ ] More detailed game statistics
* [ ] Optional user accounts and cloud progress
* [ ] Multiplayer / competitive game modes
* [ ] PWA / installable mobile experience

---

# 🤝 Contributing

Contributions, suggestions, bug reports, and new game ideas are welcome.

If you would like to contribute:

1. Fork the repository
2. Create a feature branch

```bash
git checkout -b feature/my-new-feature
```

3. Make your changes
4. Test the application locally
5. Commit your changes

```bash
git commit -m "Add new feature"
```

6. Push your branch

```bash
git push origin feature/my-new-feature
```

7. Open a Pull Request

For larger changes, opening an issue first is recommended so the proposed direction can be discussed.

---

# 📄 License

This repository does not currently specify a formal open-source license.

Unless a license is added to the repository, the source code should be treated as **all rights reserved**.

If the project is intended to be open source, adding an explicit license such as MIT is recommended before accepting external contributions.

---

# 🙏 Purpose

VerseUp Arena was created with a simple idea:

> **Make engaging with Scripture more interactive.**

Whether someone is searching for a verse, creating an image to share, memorizing Scripture, or playing a Bible game with friends, VerseUp Arena brings these experiences together in one place.

---

## 👨‍💻 Author

**Michael Mansour**

AI Engineer & Software Developer

GitHub:
https://github.com/MichaelMansour256

---

## ⭐ Support the Project

If you find VerseUp Arena useful, consider giving the repository a ⭐ on GitHub.

It helps the project reach more people and encourages continued development.

**VerseUp Arena — Explore. Play. Remember. Share.**
