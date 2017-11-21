# [draftjs_exporter_demo](https://draftjs-exporter.herokuapp.com/) [![Build Status](https://travis-ci.org/springload/draftjs_exporter_demo.svg?branch=master)](https://travis-ci.org/springload/draftjs_exporter_demo)

> A [demo](https://draftjs-exporter.herokuapp.com/) of [draftjs_exporter](https://github.com/springload/draftjs_exporter) and [Draftail](https://github.com/springload/draftail) used together.

## Install

From the command-line:

```sh
git clone git@github.com:springload/draftjs_exporter_demo.git
cd draftjs_exporter_demo
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

> The demo is [on Heroku](https://draftjs-exporter.herokuapp.com/).

It uses two buildpacks: `heroku/nodejs` and `heroku/python`, and is configured to automatically deploy after each push on `master`.
