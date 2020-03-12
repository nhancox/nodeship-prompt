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

- Languages (Node.js)
- Jobs
- Execution time
- Date
- Exit code

### Completed

(At least at an MVP level)

- User
- Host
- Directory
- Git

## Current Features

- Truecolor support
- User plugin
- Host plugin
- Directory plugin

## Current Issues and Tasks

- Make sure that the executable works correctly with `nodegit`. Discussion in
  `pkg` makes it sound like the team has accounted for it and tests against the
  module, but running the build brings up an error about having to include the
  addon with the distributed executable. Everything is currently running
  correctly on my machine with no extra steps, though.
- Optional newline printed between last output and the new prompt (restructure
  `symbol` settings to accomodate)
- JSON schema for checking the config? Or just throw errors? Maybe just a way to
  test a config to make sure it's valid and then throw in production?
- Documentation
- Add more to the initial about
- Separate things like planned features and plugins into another file?

## License

Copyright (c) 2020-present Nicholas Hancox

Licensed under the GNU General Public License v3.0
