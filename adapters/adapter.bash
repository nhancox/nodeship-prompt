#!/usr/bin/env bash
NODESHIP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && cd .. && pwd)"
NODESHIP_BIN="$NODESHIP_DIR/bin"

PATH="$PATH:$NODESHIP_BIN"
export PATH

unset NODESHIP_DIR
unset NODESHIP_BIN

_nodeship_bash_adapter() {
    local -r previous_exit_code=$?
    nodeship-prompt $previous_exit_code
}

_set_prompt() {
    PS1="$(_nodeship_bash_adapter)"
    export PS1
}

# Make sure to put any existing `PROMPT_COMMAND` at the end so that those
# command's successes or failures don't impact the exit status the prompt shows
PROMPT_COMMAND="_set_prompt $PROMPT_COMMAND"
export PROMPT_COMMAND
