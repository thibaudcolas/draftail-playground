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

## Checks and common commands

Run `just` to list the available commands.

| Command              | Purpose                                                                           |
| -------------------- | --------------------------------------------------------------------------------- |
| `just lint`          | Check frontend formatting, lint, and TypeScript; check Python formatting and lint |
| `just typecheck`     | Check TypeScript source and test types                                            |
| `just format`        | Format files and apply available Python lint fixes                                |
| `just test`          | Run frontend tests                                                                |
| `just test --watch`  | Run tests in watch mode                                                           |
| `just test-coverage` | Run frontend tests with coverage                                                  |
| `just pre-commit`    | Run all prek hooks against the whole repository                                   |
| `just build`         | Build production frontend assets into `build/`                                    |
| `just preview`       | Preview the production frontend; does not run the API                             |
| `just check`         | Run the checks, hooks, coverage, and build used in CI                             |

Pre-commit hooks format changed files and run applicable checks, including mandatory frontend type checking. If a hook reformats a file, review and stage the changes before committing again. CI also runs type checking and catches changes that bypass local hooks.

## Dependency updates

Renovate follows the conventions in [Wagtail's draftjs_exporter](https://github.com/wagtail/draftjs_exporter): scheduled updates and lockfile maintenance, a seven-day release delay, and GitHub Actions pinned to commit digests. Compatible minor and patch dependency updates can automerge after checks pass. Existing editor dependency exclusions remain in `.github/renovate.json5`; review these together when upgrading the React 16 / Draft.js 0.10 stack.

Use `vp add` / `vp add -D` to update JavaScript dependencies and commit the resulting `pnpm-lock.yaml`. Use `uv add` / `uv add --dev` to update Python dependencies in `pyproject.toml` and commit the resulting `uv.lock`. CI uses `uv sync --locked` to reject an outdated lockfile.

## Deployment

The [live playground](https://playground.draftail.org/) is hosted on Vercel. The frontend build command is `npm run build`, with output in `build/`; `api/export.py` provides the Python export function. Vercel supports the Python dependencies in `pyproject.toml` and `uv.lock`. Keep Vercel's Node.js runtime aligned with `.nvmrc` and its Python runtime aligned with `.python-version`.
