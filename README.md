# [Draftail Playground](https://playground.draftail.org/) [![Build status](https://github.com/thibaudcolas/draftail-playground/workflows/CI/badge.svg)](https://github.com/thibaudcolas/draftail-playground/actions)

> Try [Draftail](https://www.draftail.org/) in a full-fledged [preview environment](https://playground.draftail.org/).

[![Screenshot of the playground](https://playground.draftail.org/static/draftail-playground-screenshot.png)](https://playground.draftail.org/)

## Install

From the command-line:

```sh
git clone git@github.com:thibaudcolas/draftail-playground.git
cd draftail-playground
python -m venv .venv
source ./.venv/bin/activate
pip install -r requirements.txt
nvm install
# Then, install all project dependencies.
npm install
npm run start
./.githooks/deploy.sh
```

## Working on the project

> Everything mentioned in the installation process should already be done.

```sh
# Make sure you use the right node version.
nvm use
# Start the server and the development tools.
npm run start
# Builds frontend assets.
npm run build
# View other available commands with:
npm run
```

## Deployment

> The demo is [on Vercel](https://playground.draftail.org/).
