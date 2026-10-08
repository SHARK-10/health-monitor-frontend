# Health Monitor Frontend

React frontend for the **AI-Based Smart Health Monitoring Application**.

## Tech Stack

- **React 19** — UI library
- **Vite** — Build tool
- **Tailwind CSS** — Styling
- **React Router** — Routing
- **Axios** — API requests
- **Recharts** — Progress charts

## Setup

### 1. Clone the repo

```bash
git clone https://github.com/SHARK-10/health-monitor-frontend.git
cd health-monitor-frontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create `.env` in the root

```
VITE_API_URL=http://localhost:5000/api
```

### 4. Run the dev server

```bash
npm run dev
```

## Project Structure

```
src/
├── components/      # Reusable UI components
├── context/         # React Context (auth)
├── pages/           # Page components
├── services/        # API service layer
├── utils/           # Helper functions
├── App.jsx          # Root component
└── main.jsx         # Entry point
```

## Scripts

| Command           | Description                  |
| ----------------- | ---------------------------- |
| `npm run dev`     | Start dev server (port 5173) |
| `npm run build`   | Production build             |
| `npm run preview` | Preview production build     |

## Runs on

`http://localhost:5173`

## Author

**Shamanth Kumar S** — [GitHub](https://github.com/SHARK-10)
