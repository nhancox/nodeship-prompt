# Development Plans

## Features

- Some sort of config validation using a command line option (silent failures
  otherwise).

## Plugins

### Existing

General:

- "wrapper" config option to define what goes "before" and "after" a value

#### Git

- Toggle counts of each type of status flag
- Stash status (in a TODO)
- Custom status flags (in a TODO)
- Show SHA shorthand if detached (in a TODO)

### Proposed

#### Jobs

#### Execution time

#### Date and time

#### Environment Variable

`environmentVariable`

Allow tracking of as many environment variables as you'd like.

Might just have to be an object and you read `Object.keys` with the key being
the actual variable name (like `APP_ENV`).
