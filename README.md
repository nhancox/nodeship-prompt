# Nodeship Prompt

Pilot your shell prompt with Node.js.

## Installation

1. `git clone https://github.com/nhancox/nodeship-prompt.git`
2. `npm ci`
3. `npm run build`
4. `source` [`adapters/adapter.bash`](adapters/adapter.bash) at the end of your
   Bash config (e.g., `.bashrc`)

That's it! The Bash adapter will modify your path for you while preserving any
existing `PROMPT_COMMAND`.

If you would like to get rid of the repository and/or organize on your own, copy
the binary to a location on your path, remove the lines in the adapter that
modify the path (lines 2-10) and then `source` the adapter (which can be placed
wherever you like).

A default configuration is included, but you can customize by creating a
`nodeship-prompt.json` file in `$XDG_CONFIG_HOME` (`$HOME/.config` when not
set).

## Build Notes

`npm run build` creates a binary using the `pkg` library, allowing for easy
distribution while avoiding conflicts with system Node.js versions and version
managers. For more information about this choice, read
[Packaging Choices](#packaging-choices) below.

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
- Date and time

For more development plans, see [`development-plans.md`](development-plans.md).

## Packaging Choices

`nodeship` was originally written to run in interpreted form. However, this can
make it hard to ensure proper function depending on what version of Node.js a
given operating system is currently running.

This was compounded by the initial choice of `nodegit` for Git operations. It's
use of `libgit2` required native module installation, which can be unpredictable
on some systems.

`pkg` was then chosen to remove system libraries from the equation, and
`isomorphic-git` picked for easier compilation that results in only a single
binary.

I have compared `pkg` and `isomorphic-git` versus native Node.js and `nodegit`,
and the `pkg` version comes out ahead, especially with the choice to shell out
to the system's version of Git for otherwise long operations.

Roughly:

- Native execution takes 3 times longer than `pkg`. This is probably because
  it's a program with very short execution time and Node.js has to "warm up" and
  compile to bytecode. Example: 200ms versus 70ms.
- `isomorphic-git` takes at least 7 times longer than `nodegit`, but for simple
  operations this is a very small difference (around 35ms versus 5ms for simple
  operations like checkouts). For longer operations like checking status,
  shelling out is slightly faster than `nodegit` (and it takes only a modest
  repo for `isomorphic-git` to take longer than the entire rest of the program).

Conclusion: sticking with `pkg` until given a very good reason. Given this is a
developer tool, shelling out for significant performance gains is okay, but
should not be the first approach.

## License

Copyright (c) 2020-present Nicholas Hancox

Licensed under the GNU General Public License v3.0
