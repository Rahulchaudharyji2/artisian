# Qala Project Structure

This project is organized into a clean **Frontend-Backend** architecture to ensure scalability and a modular development workflow.

## 📂 Folder Structure

### 🎨 [frontend](file:///c:/Users/soura/OneDrive/Desktop/qala/frontend)
The user interface built with **Next.js 14**, **Tailwind CSS**, and **Framer Motion**.
- **`src/app`**: Contains the main application pages (Landing, Onboarding, Feed).
- **`src/lib`**: Utility functions, including the AI API client.

### ⚙️ [backend](file:///c:/Users/soura/OneDrive/Desktop/qala/backend)
The backend service built with **Node.js**, **Express**, and **TypeScript**.
- **`src/index.ts`**: Express server entry point.
- **`src/api`**: AI processing logic (Story Generation, Image Enhancement).

## 🚀 Getting Started

### 1. Start the Backend (Server)
```bash
cd backend
npm install
npm run dev
```

### 2. Start the Frontend (Client)
```bash
cd frontend
npm install
npm run dev
```

The application runs at `http://localhost:3000`, and the backend runs at `http://localhost:5000`.
