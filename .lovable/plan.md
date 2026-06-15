## Visão geral

Web app de gestão de tarefas focado em estudantes universitários, bilingue (PT/EN), com dados guardados localmente no navegador (sem login). Estética "Structural archivist": layout estruturado tipo arquivo académico, tipografia Inter + JetBrains Mono, paleta off-white/tinta com azul de destaque.

## Funcionalidades (MVP)

1. **Cadeiras (Courses)** — criar, renomear, apagar, com código curto (ex.: CALC, PROG) gerado a partir do nome.
2. **Tarefas (Tasks)** — título, cadeira associada, prazo (data), prioridade (Alta/Média/Baixa), estado (A fazer / Em curso / Concluído).
3. **Vista principal**: lista de tarefas ativas, agrupáveis/filtráveis por cadeira selecionada na sidebar.
4. **Próximas datas** — coluna à direita com prazos ordenados cronologicamente.
5. **Adicionar rápido** — input no header para criar tarefa imediatamente.
6. **Toggle PT/EN** — alterna toda a interface; preferência persistida.
7. **Persistência** — tudo em `localStorage` com seed inicial para a primeira visita não estar vazia.

## Estrutura

```text
src/
  routes/
    __root.tsx          (head + fontes Inter/JetBrains Mono via <link>)
    index.tsx           (dashboard único)
  components/
    CourseSidebar.tsx   (lista de cadeiras + toggle idioma)
    TopBar.tsx          (título contexto + input quick-add)
    TaskList.tsx        (linhas de tarefas, checkbox de estado, chips)
    TaskRow.tsx
    UpcomingPanel.tsx   (timeline de prazos)
    CourseDialog.tsx    (criar/editar cadeira)
    TaskDialog.tsx      (editar tarefa: prazo, prioridade, estado, cadeira)
  lib/
    storage.ts          (load/save de courses + tasks no localStorage)
    i18n.ts             (dicionário PT/EN + hook useT)
    seed.ts             (dados iniciais)
  styles.css            (tokens da direção escolhida)
```

## Detalhes técnicos

- **Tokens** copiados verbatim da prototype: `--background #fafaf9`, `--foreground #1c1917`, `--muted #78716c`, `--primary #2563eb`, `--border #e7e5e4`, mais mapeamento `@theme inline` para classes Tailwind v4.
- **Fontes** carregadas via `links` no `__root.tsx` (Inter + JetBrains Mono) — nunca `@import` URL em `styles.css`.
- **Estado** gerido com hook `useLocalStore<T>(key, initial)` simples (sem precisar de Zustand/Query).
- **i18n** com objeto plano `{ pt: {...}, en: {...} }` + `useT()` que lê o idioma de `localStorage` e força re-render via context.
- **IDs** com `crypto.randomUUID()`.
- **Prazos**: input `<Calendar>` shadcn em popover; ordenação por data ascendente; "Hoje", "Amanhã" calculados dinamicamente; restantes formatados `dd MMM` com `date-fns`.
- **Composição** mantém-se fiel à direção: sidebar fixa 18rem à esquerda, header sticky, coluna principal de tarefas + coluna direita de 20rem com próximas datas.

## Fora do âmbito (não fazer agora)

- Pomodoro / sessões de estudo (não foi pedido).
- Login / sincronização cloud (utilizador escolheu só local).
- Calendário mensal completo — apenas timeline "Próximas Datas" como na direção escolhida.
