# Split Keyboard Frontend

React + TypeScript + Vite frontend for the split keyboard comparison website.

## Setup

### Install Dependencies

```bash
npm install
```

### Environment Configuration

The `.env` file is already configured with:

```env
VITE_API_BASE_URL=http://localhost:8000
```

### Run Development Server

```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

## Project Structure

```
frontend/
├── src/
│   ├── pages/              # Page components
│   │   └── MainPage.tsx    # Main page
│   ├── components/         # Reusable components
│   │   ├── common/         # Common components
│   │   ├── keyboard/       # Keyboard-related components
│   │   ├── comparison/     # Comparison components
│   │   └── admin/          # Admin components
│   ├── hooks/              # Custom React hooks
│   ├── services/           # API services
│   │   ├── api.ts          # Axios client
│   │   ├── keyboardService.ts
│   │   └── authService.ts
│   ├── types/              # TypeScript type definitions
│   │   ├── keyboard.ts
│   │   └── admin.ts
│   ├── context/            # React Context
│   ├── utils/              # Utility functions
│   ├── App.tsx             # Main App component
│   └── main.tsx            # Entry point
├── .env                    # Environment variables
├── tailwind.config.js      # Tailwind CSS config
├── vite.config.ts          # Vite config
└── package.json
```

## Tech Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **State Management**: React Context API (to be implemented)

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Phase 2 Completion

Phase 2 (프론트엔드 기초) has been completed:

- ✅ Vite + React + TypeScript project setup
- ✅ React Router configuration
- ✅ API client implementation
- ✅ Main page layout

## Next Steps (Phase 3)

- Implement keyboard listing with filters
- Add search functionality
- Add sorting functionality
- Implement comparison feature
