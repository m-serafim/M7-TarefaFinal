# GitHub Copilot Instructions for M7-TarefaFinal

## Project Overview

This is a React application built with TypeScript and Vite. It uses modern React features and follows strict TypeScript configuration.

## Technology Stack

- **React**: 19.2.0 (latest version with modern features)
- **TypeScript**: ~5.9.3
- **Build Tool**: Vite 7.2.4
- **Package Manager**: npm
- **Node Types**: @types/node ^24.10.1

## Development Commands

- `npm run dev` - Start the development server with HMR (Hot Module Replacement)
- `npm run build` - Build the project (runs TypeScript compiler and Vite build)
- `npm run lint` - Run ESLint to check code quality
- `npm run preview` - Preview the production build locally

## Code Style and Standards

### TypeScript Configuration

- **Target**: ES2022
- **JSX**: react-jsx (modern JSX transform)
- **Strict Mode**: Enabled
- **Module Resolution**: bundler
- Use strict TypeScript settings including:
  - `noUnusedLocals: true`
  - `noUnusedParameters: true`
  - `noFallthroughCasesInSwitch: true`
  - `noUncheckedSideEffectImports: true`

### ESLint Rules

- Follow ESLint recommended configuration
- Use TypeScript ESLint recommended rules
- React Hooks rules are enforced (eslint-plugin-react-hooks)
- React Refresh rules for Vite (eslint-plugin-react-refresh)
- Always run `npm run lint` before committing changes

### Code Conventions

- Use functional components with hooks (not class components)
- Use TypeScript for all new files (.ts, .tsx extensions)
- Use modern ES2022+ features
- Follow React 19 best practices
- Use arrow functions for components when appropriate
- Import React hooks from 'react' (e.g., `import { useState } from 'react'`)

## Project Structure

```
src/
  ├── assets/        # Static assets (images, icons, etc.)
  ├── App.tsx        # Main application component
  ├── App.css        # Application styles
  ├── main.tsx       # Application entry point
  └── index.css      # Global styles
```

## File Naming Conventions

- React components: PascalCase with .tsx extension (e.g., `App.tsx`, `MyComponent.tsx`)
- TypeScript utilities: camelCase with .ts extension
- CSS files: Match component names with .css extension
- Use descriptive, clear names that reflect the component's purpose

## React Component Guidelines

- Use functional components with hooks
- Use `useState` for local state management
- Follow React 19 conventions and features
- Keep components focused and single-responsibility
- Export components as default when they are the primary export of a file

## Build and Deployment

- The build process compiles TypeScript first (`tsc -b`), then runs Vite build
- Build output goes to the `dist/` directory (which is git-ignored)
- Vite handles bundling, optimization, and asset management

## Testing

- No test framework is currently configured
- When adding tests, consider using Vitest (Vite's testing framework) for consistency

## Important Notes

- Always ensure TypeScript compilation succeeds before committing
- Run ESLint and fix any linting errors
- The project uses React 19, so be aware of any breaking changes from earlier versions
- HMR (Hot Module Replacement) is configured for a smooth development experience
- Do not commit the `dist/` or `node_modules/` directories

## Dependencies Management

- Use `npm install` to install dependencies
- Keep dependencies up to date, but test thoroughly after updates
- The project uses exact versions for React (^19.2.0) and dev dependencies

## Code Quality Checklist

Before submitting code, ensure:
- [ ] TypeScript compiles without errors (`npm run build`)
- [ ] ESLint passes without errors (`npm run lint`)
- [ ] Code follows project conventions
- [ ] No console.log statements in production code (unless intentional)
- [ ] Components are properly typed
- [ ] Imports are organized and clean
