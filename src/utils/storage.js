const STORAGE_KEY = 'colorforge_palettes'

export function getSavedPalettes() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []
  } catch {
    return []
  }
}

export function savePalette(colors) {
  const palettes = getSavedPalettes()
  const newPalette = {
    id: Date.now().toString(),
    colors,
    createdAt: new Date().toISOString(),
  }
  const updated = [newPalette, ...palettes].slice(0, 50) // cap at 50
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  return newPalette
}

export function deletePalette(id) {
  const palettes = getSavedPalettes().filter(p => p.id !== id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(palettes))
}

export function clearAllPalettes() {
  localStorage.removeItem(STORAGE_KEY)
}
