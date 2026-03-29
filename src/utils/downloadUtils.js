import { hexToRgb, hexToHsl } from './colorUtils.js'

function triggerDownload(url, filename) {
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}

function buildCanvas(colors) {
  const SW = 160
  const SH = 300
  const LH = 70
  const canvas = document.createElement('canvas')
  canvas.width = SW * colors.length
  canvas.height = SH + LH
  const ctx = canvas.getContext('2d')

  // Label area background
  ctx.fillStyle = '#18181c'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  colors.forEach((color, i) => {
    const x = i * SW

    // Color block
    ctx.fillStyle = color
    ctx.fillRect(x, 0, SW, SH)

    // Subtle divider between swatches
    if (i > 0) {
      ctx.fillStyle = 'rgba(0,0,0,0.15)'
      ctx.fillRect(x, 0, 1, SH)
    }

    // HEX label
    const rgb = hexToRgb(color)
    ctx.fillStyle = '#f0f0f4'
    ctx.font = 'bold 13px "Courier New", monospace'
    ctx.textAlign = 'center'
    ctx.fillText(color, x + SW / 2, SH + 28)

    // RGB label
    if (rgb) {
      ctx.fillStyle = '#888896'
      ctx.font = '11px "Courier New", monospace'
      ctx.fillText(`${rgb.r}, ${rgb.g}, ${rgb.b}`, x + SW / 2, SH + 50)
    }
  })

  // Branding
  ctx.fillStyle = '#444455'
  ctx.font = '10px sans-serif'
  ctx.textAlign = 'right'
  ctx.fillText('Color Forge', canvas.width - 8, SH + LH - 6)

  return canvas
}

export function downloadPNG(colors) {
  const canvas = buildCanvas(colors)
  triggerDownload(canvas.toDataURL('image/png'), 'colorforge-palette.png')
}

export function downloadJPG(colors) {
  const canvas = buildCanvas(colors)
  triggerDownload(canvas.toDataURL('image/jpeg', 0.95), 'colorforge-palette.jpg')
}

export function downloadTXT(colors) {
  const lines = [
    'Color Forge — Palette',
    '='.repeat(36),
    '',
    ...colors.map((hex, i) => {
      const rgb = hexToRgb(hex)
      const hsl = hexToHsl(hex)
      const rgbStr = rgb ? `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` : ''
      return `${String(i + 1).padStart(2)}. ${hex}   ${rgbStr.padEnd(20)}  ${hsl}`
    }),
    '',
    `Generated on ${new Date().toLocaleString()}`,
    'https://github.com/colorforge',
  ]
  const blob = new Blob([lines.join('\n')], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  triggerDownload(url, 'colorforge-palette.txt')
  URL.revokeObjectURL(url)
}
