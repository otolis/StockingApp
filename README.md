# Nexus Stock

Nexus Stock is a high-performance inventory management system built with a "Tactile-Industrial" aesthetic. **[Live Demo](https://nexus-stock-a2dba.web.app/)**

![Version](https://img.shields.io/badge/version-0.1.0-amber)
![License](https://img.shields.io/badge/license-MIT-white)
![Platform](https://img.shields.io/badge/platform-Web%20%2F%20Mobile-00FFC2)

---

## Experience the Edge
Nexus Stock isn't just a database; it's a workflow optimizer. From intelligent low-stock alerts to a fully responsive, card-based mobile experience, every pixel is engineered for utility.

### Key Features
- Real-time Inventory: Powered by Firebase Firestore for instant synchronization across all devices.
- Admin Control: Robust management tools for adding, editing, and deleting assets.
- Critical Alerts: Intelligent low-stock monitoring with collapsible status boards.
- Mobile First: Adaptive layouts that switch between high-density tables (Desktop) and fluid cards (Mobile).
- Cinematic UI: Smooth micro-animations powered by Anime.js.

---

## Tech Stack

### Core Architecture
- Framework: [Next.js 16 (App Router)](https://nextjs.org/)
- Language: [TypeScript](https://www.typescriptlang.org/)
- Backend / DB: [Firebase (Firestore & Auth)](https://firebase.google.com/)

### Design & Experience
- Styling: [Tailwind CSS v4](https://tailwindcss.com/)
- Icons: [Lucide React](https://lucide.dev/)
- Animations: [Anime.js v4](https://animejs.com/)
- Color Palette: Cyber-Black, High-Contrast White, and "Warning Amber" (#FFB800).

---

## Quick Start

Follow these steps to get Nexus Stock running on your local machine.

### 1. Prerequisites
Ensure you have the following installed:
- [Node.js (LTS)](https://nodejs.org/)
- [Git](https://git-scm.com/)
- A Firebase Project (for the database)

### 2. Installation
Clone the repository and install dependencies:
```bash
git clone https://github.com/otolis/StockingApp.git
cd StockingApp
npm install
```

### 3. Environment Setup
Create a `.env.local` file in the root directory and add your Firebase credentials:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 4. Run Development Server
```bash
npm run dev
```
Navigate to [http://localhost:3000](http://localhost:3000) to see the app in action.

---

## Project Structure

```text
src/
├── app/          # Next.js Pages & Routes
├── components/   # Reusable UI Patterns (Sidebar, Modals, etc.)
├── hooks/        # Custom React Hooks (Auth, Inventory)
├── lib/          # Utilities & Firebase Configuration
└── types/        # TypeScript Interfaces & Segmas
```

---

## Deployment
The app is configured for Firebase Hosting. To deploy:

1. Build the project: `npm run build`
2. Deploy: `firebase deploy --only hosting`

---

## Contributing
This project is currently in invite-only beta. For major changes, please open an issue first to discuss what you would like to change.

---

Designed with efficiency by otolis
