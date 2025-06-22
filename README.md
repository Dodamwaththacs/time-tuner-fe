# Time Tuner - React Vite Project with Protected Routes

A modern React application built with Vite, TypeScript, Tailwind CSS, and protected routes authentication system.

## Features

- ⚡ **Fast Development** - Built with Vite for lightning-fast development and hot module replacement
- 🎨 **Beautiful UI** - Styled with Tailwind CSS for rapid and consistent UI development
- 🔒 **Protected Routes** - Authentication context with route guards
- 📱 **Responsive Design** - Mobile-first responsive design
- 🔑 **TypeScript** - Full TypeScript support for type safety
- 🧭 **React Router** - Client-side routing with React Router DOM

## Technology Stack

- **Frontend Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **CSS Framework**: Tailwind CSS
- **Routing**: React Router DOM
- **Authentication**: Custom Context-based authentication

## Project Structure

```
src/
├── components/
│   ├── Dashboard.tsx     # Protected dashboard component
│   ├── Home.tsx         # Public home page
│   ├── Login.tsx        # Login component
│   └── ProtectedRoute.tsx # Route protection wrapper
├── contexts/
│   └── AuthContext.tsx  # Authentication context
├── assets/
│   └── react.svg
├── App.tsx             # Main app component with routing
├── main.tsx           # Application entry point
└── index.css          # Global styles with Tailwind

```

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository (if applicable) or use the project in the current directory
2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Authentication

The project includes a demo authentication system:

- **Demo Credentials**: 
  - Email: `admin@example.com`
  - Password: `password`

- **Features**:
  - Token-based authentication with localStorage persistence
  - Protected route implementation
  - Automatic redirects for authenticated/unauthenticated users
  - Loading states and error handling

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Routes

- `/` - Public home page
- `/login` - Login page (redirects to dashboard if already authenticated)
- `/dashboard` - Protected dashboard (requires authentication)

## Development Guidelines

- Use functional components with hooks
- Follow TypeScript best practices
- Use Tailwind CSS for styling
- Implement proper error handling
- Follow React Router patterns for navigation

## Deployment

Build the project for production:

```bash
npm run build
```

The built files will be in the `dist` directory, ready for deployment to any static hosting service.
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```
