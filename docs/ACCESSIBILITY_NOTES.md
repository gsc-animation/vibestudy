# Accessibility (A11y) Notes

## Audit Summary
- **Date:** 2026-01-03
- **Focus:** Compliance with WCAG AA standards and improved screen reader support.
- **Tools Used:** `eslint-plugin-jsx-a11y`

## Key Improvements

### General
- Installed and configured `eslint-plugin-jsx-a11y` to prevent future accessibility regressions.
- Added `aria-label` to interactive elements that lack visible text.
- Ensured decorative icons are hidden from screen readers using `aria-hidden="true"`.
- Improved focus indicators on form elements (via Tailwind classes).

### Dashboard Components
- **DashboardLayout:**
  - Added `role="navigation"` to the sidebar.
  - Added `aria-label` to navigation links.
  - Added `aria-current="page"` to the active link.
  - Added `aria-expanded` state to the mobile menu button.
- **QuestCard:**
  - Added `role="article"` to the card container.
  - Added descriptive `aria-label`s for difficulty and type badges.
  - Hid decorative icons (Sword, Book, etc.) from screen readers.
- **KanbanBoard:**
  - **Keyboard Navigation:** Added `KeyboardSensor` to `@dnd-kit/core` to allow moving items with the keyboard (Space to pick up, Arrows to move, Space to drop).
  - Added screen reader instructions for drag-and-drop operations.
  - Added `role="region"` and `aria-label="Quest Board"`.
- **KanbanColumn:**
  - Added `role="region"` and `aria-labelledby` to associate the column with its title.
  - Added `role="list"` to the quest container.

### Lab Components
- **LabLayout:**
  - **Skip Link:** Added a "Skip to main content" link that becomes visible on focus.
  - Added `role="banner"` for the header.
  - Added `role="main"` for the simulation area.
  - Added `role="complementary"` for the notebook sidebar.
  - Improved button labels (e.g., "Toggle Notebook").
- **LabNotebook:**
  - Semantic HTML: Changed the phase indicator to a `<nav>` with an `<ol>` list.
  - Added `aria-current="step"` to the active phase.
  - Added `aria-live="polite"` to the main content area to announce phase changes.
  - Added `role="alert"` for error messages.
  - Hid decorative emojis from screen readers.

### Login Page
- Added `autoComplete` attributes to inputs (email, current-password).
- Added `aria-invalid` to inputs when validation fails.
- Added `aria-live="polite"` to the error message container so errors are announced immediately.
- Hid decorative emoji in the title.

## Future Recommendations
1.  **Color Contrast:** Conduct a full color contrast audit using an automated tool (e.g., Lighthouse or axe DevTools) to ensure all text meets AA standards (4.5:1 ratio).
2.  **Focus Management:** Ensure focus is programmatically moved to the modal when opened and trapped within it until closed.
3.  **User Testing:** Conduct usability testing with screen reader users to verify the drag-and-drop and simulation interactions.
4.  **Simulation Canvas:** The simulation canvas itself is likely opaque to screen readers. Consider adding a text-based alternative or a robust Live Region that describes the physics state in real-time (as done in the "Forces" overlay concept).