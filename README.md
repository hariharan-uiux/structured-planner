# Structured — Visual Day Planner (Web, iOS, Android)

A visual day planner and timeline application reconstructed from the architecture of [Structured](https://structured.app/). Built with **React 19, TypeScript, Tailwind CSS, and Capacitor**, providing a single unified codebase that runs as a **Web application**, native **iOS app**, and native **Android app**.

---

## ✨ Features

- 📅 **Visual Timeline:** Continuous vertical timeline spine with live current-time tracking, time interval markers, and day progress tracking.
- ⚡ **Smart Task Icons:** Real-time natural language processing (NLP) engine that automatically detects keywords (e.g., *"Coffee"*, *"Deep work"*, *"Gym"*, *"Team sync"*) and assigns icons, colors, and durations.
- 🎨 **Signature 9-Color Theme Palette:** Exact Structured palette extracted from client tokens:
  - `Day` (Coral `#F88E87`), `Dawn` (Peach `#FF9E74`), `Sunshine` (Amber `#EAAA00`), `Nature` (Green `#91BF6C`), `Forest` (Emerald `#228564`), `Night` (Blue `#6185A8`), `Twilight` (Plum `#974767`), `Midnight` (Navy `#2C5073`), `Classic` (Charcoal `#141414`).
- 🔋 **Cognitive Energy Monitor:** Track and balance daily mental fatigue with **Recharging** (+1), **Neutral** (0), and **Draining** (-1) activity indicators and cognitive distribution curves.
- 📥 **Unscheduled Inbox Backlog:** Collect ideas and to-dos without time commitments, with one-click automated slot scheduling into the daily timeline.
- 🔊 **Acoustic Haptic Feedback:** Web Audio API synthesizer for tactile harmonic chimes when checking off tasks or subtasks.
- 🎉 **Celebration Confetti:** Particle burst animation when completing all scheduled goals for the day.
- 💾 **Local-First Architecture:** Instant load times, offline capability, and persistence via browser storage.
- 📱 **Multi-Platform Native Support:** Runs on Web browsers, iOS devices via Xcode/Capacitor, and Android devices via Android Studio/Capacitor.

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js** v18+ (tested on v26)
- **npm** v10+

### 2. Installation
```bash
git clone https://github.com/hariharan-uiux/structured-planner.git
cd structured-planner
npm install
```

### 3. Run Web App
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📱 Mobile Platforms

### iOS (Native App via Capacitor)
The native Xcode project is located in `ios/App`:
1. Build web assets:
   ```bash
   npm run build && npx cap sync ios
   ```
2. Open in Xcode:
   ```bash
   npx cap open ios
   ```
3. Connect your iPhone via USB, configure your free Apple ID under **Signing & Capabilities**, and click **Run** (Cmd + R) to install directly on your device.

#### Free iOS Safari PWA (Alternative)
On iOS Safari, visit `http://<YOUR_IP>:3000`, tap **Share** → **Add to Home Screen**. It installs immediately with the Structured icon and runs in full-screen standalone mode.

---

### Android (Native App via Capacitor)
The native Android project is located in `android/`:
1. Build and sync:
   ```bash
   npm run build && npx cap sync android
   ```
2. Open in Android Studio:
   ```bash
   npx cap open android
   ```
3. Or build the debug APK via CLI:
   ```bash
   cd android && ./gradlew assembleDebug
   ```
   The APK will be generated at `android/app/build/outputs/apk/debug/app-debug.apk`.

---

## 🏗️ Project Structure

```
├── android/                 # Native Android Studio project
├── ios/                     # Native Xcode project
├── public/                  # PWA manifest, Apple touch icons, and SVGs
├── src/
│   ├── components/
│   │   ├── AllDaySection.tsx  # Pinned all-day goals
│   │   ├── EnergyMonitor.tsx  # Daily energy & cognitive fatigue balance
│   │   ├── Header.tsx         # Date navigation & view switches
│   │   ├── InboxDrawer.tsx    # Backlog pool & quick scheduling
│   │   ├── SettingsModal.tsx  # Appearance, sound, & data settings
│   │   ├── TaskCard.tsx       # Timeline cards with checkboxes & subtasks
│   │   ├── TaskIcon.tsx       # Dynamic icon component
│   │   ├── TaskModal.tsx      # Task creation & editing dialog
│   │   └── Timeline.tsx       # Main vertical timeline & free-gap pills
│   ├── utils/
│   │   ├── audio.ts           # Web Audio API synthesizer
│   │   ├── colors.ts          # Structured 9-color tokens & palettes
│   │   ├── smartIcons.ts      # NLP keyword-to-icon matcher
│   │   ├── storage.ts         # Local-first persistence & demo fixtures
│   │   └── time.ts            # Timeline math & next-slot algorithm
│   ├── types.ts               # Core domain models
│   ├── App.tsx                # Application root & state coordination
│   ├── main.tsx               # DOM entry point
│   └── index.css              # Tailwind base & theme layers
├── capacitor.config.ts        # Capacitor cross-platform configuration
├── tailwind.config.js         # Theme tokens & typography configuration
└── vite.config.ts             # Vite build configuration
```

---

## 📄 License
MIT License
