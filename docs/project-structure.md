# Структура проекта

```text
utilix/
├── public/
│   ├── favicon.svg
│   └── robots.txt
├── src/
│   ├── components/
│   │   ├── Header.astro
│   │   ├── Footer.astro
│   │   ├── ToolCard.astro
│   │   └── ToolRunner.astro
│   ├── data/
│   │   └── tools.ts
│   ├── layouts/
│   │   └── BaseLayout.astro
│   ├── pages/
│   │   ├── index.astro
│   │   ├── about.astro
│   │   ├── privacy.astro
│   │   ├── category/
│   │   │   └── [slug].astro
│   │   └── tools/
│   │       └── [slug].astro
│   ├── scripts/
│   │   └── tool-engine.ts
│   └── styles/
│       └── global.css
├── docs/
│   ├── technical-spec.md
│   └── project-structure.md
├── astro.config.mjs
├── package.json
├── tsconfig.json
└── README.md
```

## Ответственность модулей

- `data/tools.ts` — единый каталог инструментов, категории, описания и SEO-метаданные.
- `ToolCard.astro` — карточка инструмента.
- `ToolRunner.astro` — контейнер интерактивного инструмента.
- `tool-engine.ts` — клиентская логика инструментов.
- `BaseLayout.astro` — общий каркас, метаданные, тема и навигация.
- `pages/tools/[slug].astro` — статическая генерация страниц каждого инструмента.
- `pages/category/[slug].astro` — статические страницы категорий.
