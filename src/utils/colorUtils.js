/**
 * Generate a random hex color
 */
export function randomHex() {
  return '#' + Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, '0').toUpperCase()
}

/**
 * Parse URL hash into an array of hex colors
 */
export function parseColorsFromHash(hash) {
  if (!hash || hash.length < 2) return null
  const raw = hash.replace('#', '')
  const parts = raw.split('-')
  const valid = parts.filter(p => /^[0-9A-Fa-f]{6}$/.test(p))
  return valid.length === 5 ? valid.map(p => '#' + p.toUpperCase()) : null
}

/**
 * Serialize colors array into URL hash string
 */
export function colorsToHash(colors) {
  return colors.map(c => c.replace('#', '')).join('-')
}

/**
 * Convert hex to RGB object
 */
export function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) }
    : null
}

/**
 * Calculate relative luminance (WCAG formula)
 */
function relativeLuminance(r, g, b) {
  const toLinear = (c) => {
    const sRGB = c / 255
    return sRGB <= 0.03928 ? sRGB / 12.92 : Math.pow((sRGB + 0.055) / 1.055, 2.4)
  }
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b)
}

/**
 * Get contrast ratio between two hex colors
 */
export function getContrastRatio(hex1, hex2) {
  const c1 = hexToRgb(hex1)
  const c2 = hexToRgb(hex2)
  if (!c1 || !c2) return 1
  const L1 = relativeLuminance(c1.r, c1.g, c1.b)
  const L2 = relativeLuminance(c2.r, c2.g, c2.b)
  const lighter = Math.max(L1, L2)
  const darker = Math.min(L1, L2)
  return (lighter + 0.05) / (darker + 0.05)
}

/**
 * Determine if text on a color background should be dark or light
 */
export function getTextColor(hex) {
  const rgb = hexToRgb(hex)
  if (!rgb) return '#000000'
  const luminance = relativeLuminance(rgb.r, rgb.g, rgb.b)
  return luminance > 0.35 ? '#1a1a1a' : '#ffffff'
}

/**
 * Get WCAG contrast rating label
 */
export function getContrastRating(ratio) {
  if (ratio >= 7) return { label: 'AAA', level: 'excellent' }
  if (ratio >= 4.5) return { label: 'AA', level: 'good' }
  if (ratio >= 3) return { label: 'AA Large', level: 'moderate' }
  return { label: 'Fail', level: 'poor' }
}

/**
 * Convert hex to HSL string
 */
export function hexToHsl(hex) {
  const rgb = hexToRgb(hex)
  if (!rgb) return 'hsl(0, 0%, 0%)'
  let { r, g, b } = rgb
  r /= 255; g /= 255; b /= 255
  const max = Math.max(r, g, b), min = Math.min(r, g, b)
  let h, s, l = (max + min) / 2

  if (max === min) {
    h = s = 0
  } else {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break
      case g: h = ((b - r) / d + 2) / 6; break
      case b: h = ((r - g) / d + 4) / 6; break
    }
  }
  return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`
}

/**
 * Export palette as CSS variables string
 */
export function exportAsCSS(colors) {
  const vars = colors
    .map((c, i) => `  --color-${i + 1}: ${c};`)
    .join('\n')
  return `:root {\n${vars}\n}`
}

/**
 * Export palette as Tailwind config snippet
 */
export function exportAsTailwind(colors) {
  const entries = colors
    .map((c, i) => `      'forge-${i + 1}': '${c}',`)
    .join('\n')
  return `// tailwind.config.js\nmodule.exports = {\n  theme: {\n    extend: {\n      colors: {\n${entries}\n      },\n    },\n  },\n}`
}

/**
 * Export palette as JSON
 */
export function exportAsJSON(colors) {
  const palette = colors.map((hex, i) => {
    const rgb = hexToRgb(hex)
    return {
      index: i + 1,
      hex,
      rgb: rgb ? `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` : null,
      hsl: hexToHsl(hex),
    }
  })
  return JSON.stringify({ palette }, null, 2)
}
