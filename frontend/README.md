# Galaxy View -- Frontend

Frontend of Galaxy View

# Features

* Mock API module (now it reads static data from `/public`)

* MobX for frontend data processing

* Prettier for automatic code formatting

    * It is recommended to install `Prettier` plugin for `vscode` and enable formatting on save.

```json
  "editor.formatOnSave": false,
  "[json]": {
    "editor.tabSize": 2,
    "editor.insertSpaces": true,
    "editor.formatOnSave": true,
  },
  "[javascript]": {
    "editor.tabSize": 2,
    "editor.insertSpaces": true,
    "editor.formatOnSave": true,
  },
  "[css]": {
    "editor.tabSize": 2,
    "editor.insertSpaces": true,
    "editor.formatOnSave": true,
  },
  "[javascriptreact]": {
    "editor.tabSize": 2,
    "editor.insertSpaces": true,
    "editor.formatOnSave": true,
  },
  "[typescript]": {
    "editor.tabSize": 2,
    "editor.insertSpaces": true,
    "editor.formatOnSave": true,
  },
  "[typescriptreact]": {
    "editor.tabSize": 2,
    "editor.insertSpaces": true,
    "editor.formatOnSave": true,
  },
```

# Run

* Configure backend url in `/src/consts.js`

* Run `yarn install`

* Run `yarn start`

# Deploy

See project root of `galaxy-view`.
