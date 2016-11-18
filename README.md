# draftjs_exporter_demo

> A demo of [draftjs_exporter](https://github.com/springload/draftjs_exporter) and [draftail](https://github.com/springload/draftail) running together

## Install

From the command-line:

```sh
git clone git@github.com:springload/draftjs_exporter_demo.git
cd draftjs_exporter_demo
virtualenv .venv
source ./.venv/bin/activate
pip install flask draftjs_exporter
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
