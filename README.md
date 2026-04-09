# 🗓️ Interactive Wall Calendar Component

A polished, high-fidelity React calendar component designed with a physical "wall calendar" aesthetic. Built as a technical challenge to demonstrate complex state management, responsive UI design, and interactive UX.

## ✨ Key Features
- **Physical Aesthetic:** Includes a spiral binding design, hero imagery with dynamic gradients per month, and a serif-heavy "stationary" feel.
- **Intelligent Range Selection:** Multi-click date range selection with real-time hover previews and duration calculation.
- **Dual-Context Notes:** A persistent notes system that toggles between "Month-wide" memos and "Selection-specific" notes using a localized key-value store.
- **Dynamic Theming:** Seamless Light/Dark mode transition that adapts the "paper" and "ink" colors while maintaining the vibrant hero gradients.
- **State-Driven Animations:** Simulated "page flip" logic that triggers directional CSS transitions when navigating months.

## 🛠️ Technical Choices
- **Vanilla React & CSS Modules:** I chose to avoid heavy UI libraries (like Material UI) to demonstrate the ability to build complex components from scratch with clean, semantic HTML and efficient CSS.
- **Date Arithmetic:** Implemented manual date calculation logic (`getDaysInMonth`, `getFirstDayOfMonth`) to keep the bundle size small and avoid unnecessary dependencies.
- **State Management:** Used a unified state approach for range selection and hover effects, ensuring the UI remains performant even when calculating range overlaps in real-time.
- **Persistence:** The notes system is designed to be easily extensible to a backend or `localStorage` by utilizing a unique `noteKey` pattern (`YYYY-MM-DD`).

## 🚀 Getting Started
1. **Clone the repo:** `git clone <your-repo-link>`
2. **Install dependencies:** `npm install`
3. **Run development server:** `npm run dev`
4. **Build for production:** `npm run build`

## 📱 Responsiveness
The component utilizes a Flexbox-based layout that automatically transitions from a side-by-side "Open Book" view on desktop to a stacked "Vertical Wall" view on mobile devices, ensuring the range selection remains accessible on touch screens.
