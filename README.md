# [Draftail Playground](http://playground.draftail.org/) [![Build Status](https://travis-ci.org/thibaudcolas/draftail-playground.svg?branch=master)](https://travis-ci.org/thibaudcolas/draftail-playground)

> Try [Draftail](https://www.draftail.org/) in a full-fledged [preview environment](http://playground.draftail.org/).

[![Screenshot of the playground](http://playground.draftail.org/static/draftail-playground-screenshot.png)](http://playground.draftail.org/)

## Install

From the command-line:

```sh
git clone git@github.com:thibaudcolas/draftail-playground.git
cd draftail-playground
virtualenv -p python3.7 .venv
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

> The demo is [on Heroku](http://playground.draftail.org/).

It uses two buildpacks: `heroku/nodejs` and `heroku/python`, and is configured to automatically deploy after each push on `master`.
