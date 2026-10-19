# Persistent Search Filters for Indeed

Browser extension that keeps a saved list of excluded words for Indeed job searches and re-runs searches without dropping the pay, radius and other filters in the URL.

## Building from source

Requires Node 22 and Yarn 1.22.

```sh
yarn install --frozen-lockfile
yarn build
```

The extension is written to `dist/`. `src/` is TypeScript bundled by esbuild (`build.mjs`, not minified); `static/` is copied into `dist/` as is.
