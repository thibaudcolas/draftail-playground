# [Draftail Playground](https://playground.draftail.org/) [![Build status](https://github.com/thibaudcolas/draftail-playground/workflows/CI/badge.svg)](https://github.com/thibaudcolas/draftail-playground/actions)

> Try [Draftail](https://www.draftail.org/) in a full-fledged preview environment.

[![Screenshot of the playground](https://playground.draftail.org/static/draftail-playground-screenshot.png)](https://playground.draftail.org/)

## Prerequisites

- Node.js at the version in `.nvmrc` (for example, select it with `nvm install`).
- [uv](https://docs.astral.sh/uv/getting-started/installation/) to manage Python and its dependencies. It selects the Python version in `.python-version` automatically.
- The [Vite+ CLI](https://viteplus.dev/guide/) (`vp`) for installing JavaScript dependencies using the committed pnpm lockfile.
- [just](https://just.systems/man/en/packages.html), the project task runner.

## Install

```sh
git clone git@github.com:thibaudcolas/draftail-playground.git
cd draftail-playground
nvm install
just init
```

`just init` uses `uv sync --locked` to create the Python environment from `uv.lock`, installs JavaScript dependencies, and installs the [prek](https://prek.j178.dev/) pre-commit hook. Recipes use `uv run`, so no environment activation is needed. If you have no standalone `just` installation, bootstrap with:

```sh
uv run just init
```

Use `uv run just` in place of `just` in the commands below if necessary.

For existing checkouts, the old `.githooks` scripts have been replaced by `prek.toml`. If you manually configured `core.hooksPath`, unset that repository setting before running `just init`. If prek reports an existing hook, inspect and back it up before replacing it with `uv run prek install --overwrite`.

## Development

Start the frontend:

```sh
just dev
```

In another terminal, start the Python export API:

```sh
just dev-api
```

Open the URL printed by Vite. Vite proxies `/api` requests to the API at `127.0.0.1:5000`. The frontend alone can render the editor, but server-side HTML and Markdown export needs both processes. The local API command uses Python's HTTP server and is for development only.

## Export engine

HTML and Markdown exports use `draftjs_exporter` 7.2.0. Markdown uses the library's built-in configuration, with an adapter for Draftail's image `altText` field; the standalone `draftjs_exporter_markdown` package is no longer needed.

Markdown export is experimental. Text and link destinations are escaped so literal Markdown punctuation stays literal, and image alternative text is included. The Configuration tab configures HTML output; Markdown uses its own defaults. See the [exporter configuration reference](https://wagtail.github.io/draftjs_exporter/reference/configuration/) and [Markdown documentation](https://wagtail.github.io/draftjs_exporter/markdown/).

### Markdown input

Open **Import Markdown**, enter your text, and choose **Replace editor content**. Importing replaces the editor document and updates the preview and exports; empty input clears the editor. Failed imports leave the current document intact.

The importer supports paragraphs, headings, lists, quotes, fenced code, emphasis, links, images, and horizontal rules. Headings 4–6 become heading 3, and list depth is limited to four. Unsupported Markdown stays as plain text. Image alternative text and formatting around emoji are preserved. Import and export use the same `/api/export` endpoint: send `markdown` instead of `contentState`, together with `exporterConfig`, to receive the imported `contentState` alongside the exports.

### Agent skill

The upstream [Draft.js exporter skill](.agents/skills/draftjs-exporter/SKILL.md) is installed in this project's `.agents/skills/` directory. It covers exporter configuration, Markdown import/export, and custom components.

## Checks and common commands

Run `just` to list the available commands.

| Command              | Purpose                                                                                   |
| -------------------- | ----------------------------------------------------------------------------------------- |
| `just lint`          | Check frontend formatting, lint, and TypeScript; check Python formatting, lint, and types |
| `just typecheck`     | Check TypeScript and Python source and test types                                         |
| `just typecheck-api` | Check Python types with ty                                                                |
| `just format`        | Format files and apply available Python lint fixes                                        |
| `just test`          | Run frontend tests                                                                        |
| `just test --watch`  | Run tests in watch mode                                                                   |
| `just test-api`      | Run Python export API regression tests                                                    |
| `just test-coverage` | Run frontend tests with coverage                                                          |
| `just pre-commit`    | Run all prek hooks against the whole repository                                           |
| `just build`         | Build production frontend assets into `build/`                                            |
| `just preview`       | Preview the production frontend; does not run the API                                     |
| `just check`         | Run the checks, hooks, coverage, and build used in CI                                     |

Pre-commit hooks format changed files and run applicable checks, including mandatory frontend and Python type checking. If a hook reformats a file, review and stage the changes before committing again. CI also runs type checking and catches changes that bypass local hooks.

Python type checking uses `ty`, with the same opt-in soundness rules as `draftjs_exporter`. It checks the API and its tests, runs in `just lint` and CI, and runs as a pre-commit hook when Python files or their dependency configuration change.

## Dependency updates

Renovate follows the conventions in [Wagtail's draftjs_exporter](https://github.com/wagtail/draftjs_exporter): scheduled updates and lockfile maintenance, a seven-day release delay, and GitHub Actions pinned to commit digests. Compatible minor and patch dependency updates can automerge after checks pass. Existing editor dependency exclusions remain in `.github/renovate.json5`; review these together when upgrading the React 16 / Draft.js 0.10 stack.

Use `vp add` / `vp add -D` to update JavaScript dependencies and commit the resulting `pnpm-lock.yaml`. Use `uv add` / `uv add --dev` to update Python dependencies in `pyproject.toml` and commit the resulting `uv.lock`. CI uses `uv sync --locked` to reject an outdated lockfile.

## Deployment

The [live playground](https://playground.draftail.org/) is hosted on Vercel. The frontend build command is `npm run build`, with output in `build/`; `api/export.py` provides the Python export function. Vercel supports the Python dependencies in `pyproject.toml` and `uv.lock`. Keep Vercel's Node.js runtime aligned with `.nvmrc` and its Python runtime aligned with `.python-version`.
