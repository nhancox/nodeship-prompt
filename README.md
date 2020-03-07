# Nodeship Prompt

Pilot your shell prompt with Node.js.

## Installation

1. Clone repository
2. `source` `adapters/adapter.bash` at the end of your Bash config (e.g.,
   `.bashrc`)

That's it! The Bash adapter will modify your path for you while preserving any
existing `PROMPT_COMMAND`.

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

- Use `pkg` to build a binary to get around errors with version managers, etc.
  (will also really help with future `nodejs` plugin)
- JSON schema for checking the config? Or just throw errors? Maybe just a way to
  test a config to make sure it's valid and then throw in production?

## License

Copyright (c) 2020-present Nicholas Hancox

Licensed under the GNU General Public License v3.0
