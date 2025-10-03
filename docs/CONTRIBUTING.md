# Contributing to TTS Voice Studio

Thank you for your interest in contributing! This document provides guidelines for contributing to the project.

## Development Setup

1. Fork and clone the repository
2. Run `./setup.sh` to install dependencies
3. Create a new branch for your feature
4. Make your changes
5. Test thoroughly
6. Submit a pull request

## Code Style

### Python (Backend)
- Follow PEP 8
- Use type hints
- Add docstrings to functions
- Keep functions small and focused

### TypeScript (Frontend)
- Follow standard TypeScript conventions
- Use functional components with hooks
- Add proper TypeScript types
- Keep components modular

## Testing

### Backend
```bash
cd backend
pytest
```

### Frontend
```bash
cd frontend
npm test
```

## Pull Request Process

1. Update README.md with details of changes if needed
2. Update documentation
3. Ensure all tests pass
4. Request review from maintainers
5. Squash commits before merge

## Adding New Models

See `backend/README.md` for detailed instructions on adding new TTS models.

## Reporting Bugs

Use GitHub Issues and include:
- Description of the bug
- Steps to reproduce
- Expected behavior
- Actual behavior
- System information
- Logs if applicable

## Feature Requests

Open a GitHub Issue with:
- Clear description
- Use case
- Proposed solution
- Alternative solutions considered

## Questions

Use GitHub Discussions for general questions and community support.

