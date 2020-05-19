module.exports = function(shell) {
  return function(code) {
    let escapedCode;

    switch (shell) {
      case "bash": {
        // TODO: This octal literal violates strict mode and fails the lint
        // tests, but other formats don't appear to correctly affect the output.
        // Look for a better way.
        escapedCode = "\001" + code + "\002";
        break;
      }

      default: {
        escapedCode = code;
      }
    }

    return escapedCode;
  }
}
