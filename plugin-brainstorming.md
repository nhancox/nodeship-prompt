# Plugin Brainstorming

## New Features for Existing Plugins

General:

- "wrapper" config option to define what goes "before" and "after" a value

### Git

- Toggle counts of each type of status flag
- Stash status (in a TODO)
- Custom stats flags (in a TODO)
- Show SHA shorthand if detached (in a TODO)

## Environment Variable

`environmentVariable`

An improvement over `starship` by allowing as many as you want!

Might just have to be an object and you read `Object.keys` with the key being
the actual variable name (like `APP_ENV`).
