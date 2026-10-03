# Task runner: https://just.systems
set positional-arguments

# List available commands.
help:
    @"{{just_executable()}}" --list --list-prefix 'just '

# Install dependencies and Git hooks (requires uv, Node, and Vite+).
init:
    uv sync --locked
    vp install --frozen-lockfile
    uv run prek install

# Start the frontend; run `just dev-api` in a second terminal.
dev:
    npm run dev

# Serve the Python export handler on the port used by Vite's /api proxy.
dev-api:
    uv run python -c 'from http.server import HTTPServer; from api.export import handler; HTTPServer(("127.0.0.1", 5000), handler).serve_forever()'

# Check frontend types, including tests.
typecheck:
    npm run typecheck

# Check formatting, lint, and types for the whole project.
lint:
    npm run lint
    uv run ruff format --check .
    uv run ruff check .

# Format project files and fix Python lint violations where possible.
format:
    npm exec -- vp fmt --write .
    uv run ruff check --fix .
    uv run ruff format .

# Run frontend tests; additional arguments are passed to Vitest.
test *args:
    npm test -- "$@"

# Run tests with coverage, as in CI.
test-coverage:
    npm test -- --coverage

# Build production assets.
build:
    npm run build

# Preview the production frontend (does not run the API).
preview:
    npm run preview

# Run every pre-commit hook against all files.
pre-commit:
    uv run prek run --all-files

# Run the same checks as CI.
check: lint pre-commit test-coverage build
