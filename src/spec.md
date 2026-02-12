# Specification

## Summary
**Goal:** Improve the authenticated Works management dashboard by grouping photography works into category sections and adding an on-hover information overlay for each work thumbnail.

**Planned changes:**
- Update Portfolio → Management → Works to render works grouped by category, with each category shown as a clearly labeled section (optionally showing the category description when available).
- Within each category section, list only works that match that category; show an explicit English empty-state message for categories with no works.
- Add a hover/focus interaction on each work thumbnail to reveal an info overlay/tooltip showing title and category name (and description when available, clamped/truncated as needed).
- Ensure hover/focus UI does not block existing actions (Add Work, Edit, Delete) and remains accessible via keyboard focus.

**User-visible outcome:** In the dashboard Works tab, users see photography works organized under category sections, and can hover (or focus via keyboard) on a work thumbnail to quickly view its details without clicking, while still being able to edit or delete works.
