# Plugin Brainstorming

## Environment Variable

`environmentVariable`

An improvement over `starship` by allowing as many as you want!

Might just have to be an object and you read `Object.keys` with the key being
the actual variable name (like `APP_ENV`).

## Languages

Rule proposals are pulled from `starship/starship`

All of these will need a directory listing, so that should probably get put into
the environment by default so that there don't have to be repeated operations.
But should this be by default or only enabled when something that requires it is
present (which could be pretty tricky to implement)? Leaning towards the default
option.

### nodejs

- Current directory contains `package.json`, `node_modules` or `.js`

### php

- Current directory contains `composer.json` or `.php`

### python

- Current directory contains `.python-version`, `requirements.txt`,
  `pyproject.toml`, `.py`, `Pipfile` or `tox.ini`
- There is a virtual environment currently activated

### ruby

- Current directory contains `Gemfile` or `.rb`

### rust

- Current directory contains `Cargo.toml` or `.rs`
