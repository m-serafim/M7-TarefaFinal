# Contributing Guidelines

## Development Workflow

### Setup
```bash
# Clone repository
git clone https://github.com/m-serafim/M7-TarefaFinal.git
cd M7-TarefaFinal

# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env with your Steam API key
```

### Development
```bash
# Start development server
npm run dev

# In another terminal, run type checking
npx tsc --watch --noEmit
```

### Code Quality
```bash
# Run linter
npm run lint

# Check TypeScript types
npx tsc --noEmit

# Build for production
npm run build
```

## Code Standards

### TypeScript
- Use explicit types where beneficial
- Prefer interfaces over types for objects
- Use type imports: `import type { ... }`
- Document complex functions with JSDoc

### React
- Use functional components with hooks
- Prefer named exports over default exports for components
- Keep components small and focused
- Use proper prop types

### CSS
- Use CSS variables for theming
- Follow BEM-like naming for component styles
- Keep styles co-located with components
- Mobile-first responsive design

### Accessibility
- Use semantic HTML
- Include ARIA attributes where appropriate
- Ensure keyboard navigation works
- Test with screen readers

### Git Commits
- Write clear, descriptive commit messages
- Keep commits small and focused
- Use conventional commit format when possible
- Reference issues in commit messages

## File Structure

```
src/
├── components/
│   ├── features/     # Feature-specific components
│   └── ui/           # Reusable UI components
├── constants/        # Configuration constants
├── hooks/            # Custom React hooks
├── services/         # API and storage services
├── types/            # TypeScript type definitions
├── utils/            # Utility functions
├── App.tsx           # Main app component
└── main.tsx          # Entry point
```

## Adding New Features

1. **Plan**: Discuss feature in an issue first
2. **Branch**: Create feature branch from main
3. **Develop**: Write code following standards
4. **Test**: Manual testing of all paths
5. **Document**: Update README if needed
6. **PR**: Create pull request with description
7. **Review**: Address review feedback
8. **Merge**: Squash and merge when approved

## Testing

### Manual Testing Checklist
- [ ] Search functionality (debounce + Enter)
- [ ] Filters work correctly
- [ ] Sorting works (all fields, both directions)
- [ ] Pagination navigation
- [ ] Favorites persist across reloads
- [ ] Error states display correctly
- [ ] Loading states work
- [ ] Empty states show appropriately
- [ ] Responsive on mobile/tablet/desktop
- [ ] Keyboard navigation works
- [ ] Screen reader compatible

## Common Tasks

### Adding a New Component
1. Create component file in appropriate directory
2. Create corresponding CSS file
3. Export from index.ts
4. Add to storybook if applicable
5. Document props with JSDoc

### Adding a New API Endpoint
1. Add type definitions in `src/types/`
2. Add endpoint to `src/constants/config.ts`
3. Implement service in `src/services/`
4. Create hook if needed
5. Update API_CONTRACT.md

### Adding a New Utility
1. Add function to appropriate utils file
2. Document with JSDoc
3. Export from index.ts
4. Add unit tests if complex

## Questions?

Open an issue or contact the maintainers.
