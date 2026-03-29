# Color Forge

A modern color palette generator inspired by Coolors.co — built with React + Vite.

## Features

- **Generate** a 5-color palette with one click or by pressing `Space`
- **Lock colors** to keep them when regenerating
- **Copy HEX** codes with visual feedback
- **Color picker** — click the edit icon on any swatch to fine-tune a color
- **Contrast indicator** — WCAG AA/AAA rating per swatch
- **Save palettes** to `localStorage` (up to 50)
- **Share via URL** — palette encoded in the URL hash
- **Export** in JSON, CSS variables, and Tailwind config formats
- **Copy all** HEX codes at once
- **Load saved palettes** back into the generator
- **Drag-and-drop** to reorder swatches
- **Undo / Redo** — full palette history (`Ctrl+Z` / `Ctrl+Shift+Z`)
- **Dark / Light mode** toggle — preference saved in `localStorage`

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Build

```bash
npm run build
npm run preview
```

## Project Structure

```text
src/
  components/
    ColorSwatch/      # Individual color swatch with lock, copy, picker, drag
    ExportModal/      # Export dialog (JSON / CSS / Tailwind)
    Header/           # Top navigation bar with theme toggle
  hooks/
    usePalette.js     # Palette state, history (undo/redo), URL sync, reorder
    useKeyboard.js    # Space / Ctrl+Z / Ctrl+Shift+Z shortcuts
    useCopyFeedback.js# Clipboard copy with timed feedback
    useTheme.js       # Dark/light mode with localStorage persistence
  pages/
    PaletteGenerator/ # Main generator view
    SavedPalettes/    # Saved palette grid
  utils/
    colorUtils.js     # Color math (contrast, HSL, export formatters)
    storage.js        # localStorage helpers
  styles/
    global.css        # Design tokens, reset, light theme overrides
```

## Roadmap

- [ ] Harmony modes (complementary, analogous, triadic, etc.)
- [ ] Import palette from image
- [ ] More export formats (SCSS, Android XML, iOS Swift)
- [ ] Color name lookup
- [ ] Gradient preview from palette
