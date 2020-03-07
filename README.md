# Nodeship Prompt

Pilot your shell prompt with Node.js.

## Installation

1. `git clone https://github.com/nhancox/nodeship-prompt.git`
2. `npm install`
3. `npm run build`
4. `source` `adapters/adapter.bash` at the end of your Bash config (e.g.,
   `.bashrc`)

That's it! The Bash adapter will modify your path for you while preserving any
existing `PROMPT_COMMAND`.

`npm run build` creates a binary using the `pkg` module, allowing for easy
distribution and avoiding conflicts with system Node.js versions and version
managers. `nodeship-prompt` currently requires Node.js v12 (the most recent
LTS).

## Plugins

### Proposed

- Git
- Languages (Node.js)
- Jobs
- Execution time
- Date
- Exit code

### Completed

- User
- Host
- Directory

## Methodology

TDD with Jest.

End game for plugins like `git` is to spin up the test files every time as
opposed to saving them in the actual project repository.

## Current Issues and Tasks

- Have `pkg` automatically build for Node.js v12 without the user requiring it
- JSON schema for checking the config? Or just throw errors? Maybe just a way to
  test a config to make sure it's valid and then throw in production?

## License

Copyright (c) 2020-present Nicholas Hancox

Licensed under the GNU General Public License v3.0
