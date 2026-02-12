# Specification

## Summary
**Goal:** Apply a consistent light-blue (#87ceeb) and black color palette across the app in both light and dark modes by updating the global theme tokens used by the imported stylesheet.

**Planned changes:**
- Update theme CSS variables in `frontend/src/index.css` (the stylesheet imported by the app) to use #87ceeb as the primary brand color and black/dark typography in light mode, including related tokens (e.g., `--primary`, `--primary-foreground`, `--background`, `--foreground`, `--ring`, `--accent`, `--muted`, `--border`).
- Remove the previous warm/terracotta/sage palette values from `frontend/src/index.css`.
- Update `.dark` theme tokens in `frontend/src/index.css` to use a near-black background, #87ceeb accents (or a consistent variant), and readable light foreground text while preserving the existing theme toggle behavior.

**User-visible outcome:** The app’s UI renders with #87ceeb accents and black/dark text in light mode, and a near-black dark mode with #87ceeb accents and readable light text; theme toggling continues to work as before.
