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

If you would like to get rid of the repository and/or organize on your own, copy
the binary to a location on your path, remove the lines in the adapter that
modify the path (lines 2-10) and then `source` the adapter (which can be placed
wherever you like).

`npm run build` creates a binary using the `pkg` module, allowing for easy
distribution and avoiding conflicts with system Node.js versions and version
managers.

## Current Features

- Truecolor support
- Plugins:
  - User
  - Host
  - Directory
  - Git
  - Languages
    - Node.js
    - PHP
    - Python
    - Ruby
    - Rust
  - Previous Exit Code

## Proposed Plugins

- Jobs
- Execution time
- Date

## Current Issues and Tasks

- JSON schema for checking the config? Or just throw errors? Maybe just a way to
  test a config to make sure it's valid and then throw in production?
- Documentation
- Add more to the initial about

## License

Copyright (c) 2020-present Nicholas Hancox

Licensed under the GNU General Public License v3.0
