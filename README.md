# Dr. McNulty's Website

Next.js App Router, Nextra MDX, React, and TypeScript. The site runs locally on `127.0.0.1` by default.

## Local development

Use Node 24 LTS (`nvm use` if available), then:

```sh
npm ci
npm run dev
```

Open [localhost:3000](http://localhost:3000). Pass another port with `npm run dev -- --port 3030`.

```sh
npm run check
npm run build
npm start
```

`check` runs TypeScript and the routing, search, and content checks. `build` produces a local production build. These commands do not publish the site.

## Editing

- `content/`: existing MDX articles, organized by route.
- `data/site.json`: navigation, page definitions, old URL redirects, and homepage text.
- `data/resources.json`: resource links and their existing categories.
- `components/`: shared layouts, search, media, tabs, code copying, and resource filtering.
- `app/globals.css`: layout and light/dark palette.
- `public/images/`: existing images.

The development server regenerates search and image metadata when content, resource data, or images change. Generated files under `lib/generated/` and `public/search-index.json` are ignored by Git and rebuilt before checks and production builds.

Old article URLs redirect to their new locations. Existing section IDs, including `parity` and `scp_2`, remain available.

This overhaul preserves article wording and resource labels. The existing Website Maintenance article is retained for the later content pass; this README describes the current structure.

## Dependencies

Use npm and the checked-in `package-lock.json`. Package versions are pinned. The overrides for `js-yaml`, `minimatch`, and KaTeX patch transitive dependencies; review them when upgrading Nextra.
