# 🎮 Shaxsiy O'yin

**Shaxsiy O'yin** is a premium, real-time multiplayer quiz platform built with React Native and Expo. It offers a dynamic and competitive gaming experience where users can create private rooms, select categories, and compete in fast-paced quiz battles with live buzzer mechanics.

![Banner](https://github.com/founded-labs/react-native-reusables/raw/main/assets/react-native-reusables-dark.png)

## 🚀 Key Features

- **Real-time Multiplayer**: Powered by Socket.io for low-latency game interactions.
- **Buzzer Mechanics**: Competitive "first-to-buzz" system for answering questions.
- **Dynamic Game Loop**: Multiple phases including Scrambling, Answering, Grading, and Reveal.
- **Room Management**: Create, join, and manage private/public game rooms.
- **Live Standings**: Real-time scoreboard updates during gameplay.
- **Modern UI/UX**: Built with React Native Reusables and Tailwind CSS for a sleek, responsive design.
- **Secure Auth**: Integrated with Supabase for user authentication and session management.
- **Cross-Platform**: Seamlessly runs on iOS, Android, and Web.

## 🛠️ Tech Stack

- **Framework**: [Expo SDK 54](https://expo.dev/) & [Expo Router](https://docs.expo.dev/router/introduction/)
- **UI/Styling**: [React Native Reusables](https://reactnativereusables.com/), [Tailwind CSS](https://tailwindcss.com/) (via [Uniwind](https://uniwind.dev/)), [Lucide Icons](https://lucide.dev/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Networking**: [TanStack Query](https://tanstack.com/query/latest), [Socket.io-client](https://socket.io/)
- **Backend/DB**: [Supabase](https://supabase.com/), [Expo SQLite](https://docs.expo.dev/versions/latest/sdk/sqlite/)
- **Animations**: [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/)

## 📂 Project Structure

```text
├── app/                  # Expo Router routes (Game rooms, Auth, Tabs)
│   ├── (tabs)/           # Main application tabs
│   ├── auth/             # Authentication screens
│   └── game/             # Core game logic and room screens
├── components/           # Reusable UI components
│   ├── game/             # Game-specific components (Buzzer, Timer, Standings)
│   └── ui/               # Base UI primitives from React Native Reusables
├── hooks/                # Custom React hooks
├── providers/            # Context providers (Socket, Auth, Theme)
├── store/                # Zustand stores for state management
├── types/                # TypeScript interfaces and types
└── utils/                # Helper functions and utilities
```

## 🏎️ Getting Started

### Prerequisites

- [Bun](https://bun.sh/) (Recommended) or Node.js
- [Expo Go](https://expo.dev/go) app on your mobile device (optional)

### Installation

1. Clone the repository:

   ```bash
   git clone <repo-url>
   cd shaxsiy-oyin
   ```

2. Install dependencies:

   ```bash
   bun install
   ```

3. Start the development server:
   ```bash
   bun dev
   ```

This will start the Expo Dev Server. You can then:

- Press `i` for iOS simulator.
- Press `a` for Android emulator.
- Press `w` for Web browser.
- Scan the QR code with Expo Go.

## 🛠️ Adding Components

This project uses **React Native Reusables**. You can add more components via CLI:

```bash
npx react-native-reusables/cli@latest add
```

## 📄 License

Created by **estoyse**. All rights reserved.
