# [Draftail Playground](https://draftail-playground.herokuapp.com/) [![Build Status](https://travis-ci.org/thibaudcolas/draftail-playground.svg?branch=master)](https://travis-ci.org/thibaudcolas/draftail-playground)

> A [demo](https://draftail-playground.herokuapp.com/) of [Draftail](https://github.com/springload/draftail) and the [Draft.js exporter](https://github.com/springload/draftjs_exporter) used together.

## Install

From the command-line:

```sh
git clone git@github.com:thibaudcolas/draftail-playground.git
cd draftail-playground
virtualenv .venv
source ./.venv/bin/activate
pip install -r requirements.txt
nvm install
# Then, install all project dependencies.
npm install
npm run start
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

> The demo is [on Heroku](https://draftail-playground.herokuapp.com/).

It uses two buildpacks: `heroku/nodejs` and `heroku/python`, and is configured to automatically deploy after each push on `master`.
