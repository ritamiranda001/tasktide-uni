## Alterar cor do menu lateral

Mudar o fundo da sidebar esquerda (`CourseSidebar`) para um amarelo claro suave, mantendo a estética minimalista "Structural archivist".

### Mudanças

- **`src/styles.css`**: adicionar token `--color-sidebar` em `@theme inline` com valor amarelo claro (ex.: `oklch(0.97 0.05 95)` — um amarelo manteiga subtil que contrasta bem com texto escuro e mantém legibilidade).
- **`src/components/CourseSidebar.tsx`**: aplicar `bg-sidebar` ao `<aside>`. Ajustar o hover dos items inactivos de `hover:bg-black/5` para `hover:bg-black/10` para continuar visível sobre o amarelo.

O resto da paleta (texto, bordas, item activo a preto) mantém-se inalterado para preservar o contraste e a identidade do design.

### Nota

Para mudanças visuais simples como esta (cores, texto, fontes), podes usar **Visual Edits** no preview — é grátis e instantâneo.
<presentation-actions>
<presentation-link url="https://docs.lovable.dev/features/visual-edit">Saber mais sobre Visual Edits</presentation-link>
</presentation-actions>
