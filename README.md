# 🎪 Festify

**Your Spotify listening history, transformed into a personalized music festival.**

Festify analyzes your Spotify data to generate a custom three-day festival experience—complete with stage lineups, headliners, and a shareable poster that looks like it belongs on your bedroom wall.

---

## ✨ Features

- 🎵 **Personalized Lineup** – Your top artists become festival headliners
- 🎨 **Custom Poster** – Downloadable, shareable festival artwork
- 📅 **Multi-Day Schedule** – Friday favorites, Saturday discoveries, Sunday chill vibes
- 🎭 **Multiple Stages** – Main Stage, Sunset Stage, Discovery Tent, and more
- 🔒 **Privacy First** – No data stored on servers, session-only authentication
- 📱 **Mobile Responsive** – Looks great on any device

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- A Spotify account
- A [Spotify Developer](https://developer.spotify.com/dashboard) application

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/bandicoutts/festify.git
   cd festify
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_SPOTIFY_CLIENT_ID=your_client_id_here
   SPOTIFY_CLIENT_SECRET=your_client_secret_here
   NEXT_PUBLIC_REDIRECT_URI=http://localhost:3000/callback
   ```

4. **Configure Spotify Developer App**
   
   In your [Spotify Dashboard](https://developer.spotify.com/dashboard):
   - Add `http://localhost:3000/callback` to Redirect URIs
   - Note your Client ID and Client Secret

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open [http://localhost:3000](http://localhost:3000)**

---

## 🛠️ Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Animation:** Framer Motion
- **UI Components:** Headless UI
- **API:** Spotify Web API (OAuth 2.0 with PKCE)
- **Image Export:** html2canvas

---

## 📁 Project Structure

```
festify/
├── src/
│   ├── app/                    # Next.js app router pages
│   ├── components/             # React components
│   │   ├── auth/              # Authentication components
│   │   ├── festival/          # Festival UI components
│   │   └── layout/            # Layout components
│   ├── lib/                   # Utilities and API logic
│   │   ├── spotify/           # Spotify API wrapper
│   │   └── festival/          # Lineup generation logic
│   └── styles/                # Global styles
└── public/                    # Static assets
```

---

## 🎨 Design Inspiration

Visual aesthetic inspired by:
- Rhythm and Vines (rhythmandvines.co.nz)
- Coachella
- Laneway Festival

---

## 🔒 Privacy & Data

- **No server-side storage** – Tokens stored in browser session only
- **User control** – Easy logout and data disconnection
- **Spotify compliance** – Follows Spotify Developer Terms of Service
- **Transparency** – Clear privacy notice on landing page

---

## 📸 Screenshots

*Coming soon!*

---

## 🤝 Contributing

This is a personal project, but suggestions and bug reports are welcome! Feel free to open an issue.

---

## ⚖️ Legal

- Not affiliated with Spotify or any actual music festival
- Uses Spotify Web API under their Terms of Service
- Artist data © respective copyright holders
- Project code is MIT licensed (see LICENSE file)

---

## 🙏 Acknowledgments

Built with ❤️ using:
- [Spotify Web API](https://developer.spotify.com/documentation/web-api)
- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)

---

**Powered by Spotify** 🎵