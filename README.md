# Color Forge

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB) ![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)

Gerador de paletas de cores moderno inspirado no Coolors.co — construído do zero com React + Vite.

## Funcionalidades

- **Gerar paleta** de 5 cores com um clique ou pressionando `Space`
- **Travar cores** para mantê-las ao regenerar a paleta
- **Copiar HEX** com feedback visual ao clicar
- **Seletor de cores** — clique no ícone de edição em qualquer swatch para ajustar a cor manualmente
- **Indicador de contraste** — classificação WCAG AA/AAA por swatch
- **Salvar paletas** no `localStorage` (até 50 paletas)
- **Compartilhar via URL** — paleta codificada no hash da URL
- **Exportar** nos formatos JSON, variáveis CSS e configuração Tailwind
- **Copiar todos** os códigos HEX de uma vez
- **Carregar paletas salvas** de volta no gerador
- **Arrastar e soltar** para reordenar os swatches
- **Desfazer / Refazer** — histórico completo da paleta (`Ctrl+Z` / `Ctrl+Shift+Z`)
- **Modo escuro / claro** — preferência salva no `localStorage`

## Tecnologias

| Tecnologia                     | Uso                                        |
| ------------------------------ | ------------------------------------------ |
| [React 18](https://react.dev/) | Biblioteca de UI e gerenciamento de estado |
| [Vite 5](https://vitejs.dev/)  | Bundler e servidor de desenvolvimento      |
| CSS Modules                    | Estilização com escopo por componente      |
| CSS Custom Properties          | Design tokens e tema claro/escuro          |
| localStorage API               | Persistência de paletas e preferências     |
| Web Clipboard API              | Cópia de HEX para a área de transferência  |
| Drag and Drop API nativa       | Reordenação dos swatches                   |
| URL Hash (`window.location`)   | Compartilhamento de paletas via link       |

## Como rodar

```bash
npm install
npm run dev
```

Acesse [http://localhost:5173](http://localhost:5173) no navegador.

## Build

```bash
npm run build
npm run preview
```

## Estrutura do projeto

```text
src/
  components/
    ColorSwatch/      # Swatch individual com trava, cópia, picker e drag
    ExportModal/      # Modal de exportação (JSON / CSS / Tailwind)
    Header/           # Barra de navegação com toggle de tema
  hooks/
    usePalette.js     # Estado da paleta, histórico (undo/redo), sync com URL e reordenação
    useKeyboard.js    # Atalhos Space / Ctrl+Z / Ctrl+Shift+Z
    useCopyFeedback.js# Cópia para clipboard com feedback temporário
    useTheme.js       # Modo claro/escuro com persistência no localStorage
  pages/
    PaletteGenerator/ # View principal do gerador
    SavedPalettes/    # Grade de paletas salvas
  utils/
    colorUtils.js     # Funções de cor (contraste, HSL, formatadores de exportação)
    storage.js        # Helpers de localStorage
    downloadUtils.js  # Utilitários de download de arquivos
  styles/
    global.css        # Design tokens, reset e overrides do tema claro
```
