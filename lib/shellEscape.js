module.exports = function(shell) {
  return function(code) {
    let escapedCode;

    switch (shell) {
      case "bash": {
        escapedCode = `\u0001${code}\u0002`;
        break;
      }

      default: {
        escapedCode = code;
      }
    }

    return escapedCode;
  };
};
