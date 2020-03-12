// Colors are from my current personal prompt written in Bash, which in turn are
// Solarized Dark, pulled from the "HEX" values on the official repo:
// https://github.com/altercation/solarized/tree/master/iterm2-colors-solarized#the-values
module.exports = {
  directory: {
    color: {
      modifier: "bold",
      type: "hex",
      value: "#5f8700"
    },
    homeSymbol: "~",
    preposition: {
      color: {
        modifier: "bold",
        type: "keyword",
        value: "white"
      },
      value: "in"
    }
  },
  git: {
    branch: {
      color: {
        modifier: "bold",
        type: "hex",
        value: "#5f5faf"
      },
      preposition: {
        color: {
          modifier: "bold",
          type: "keyword",
          value: "white"
        },
        value: "on"
      }
    },
    status: {
      color: {
        modifier: "bold",
        type: "hex",
        value: "#0087ff"
      }
    }
  },
  host: {
    color: {
      modifier: "bold",
      type: "hex",
      value: "#00afaf"
    },
    preposition: {
      color: {
        modifier: "bold",
        type: "keyword",
        value: "white"
      },
      value: "at"
    }
  },
  newline: true,
  prompt: ["user", "host", "directory", "git"],
  symbol: {
    color: {
      modifier: "bold",
      type: "keyword",
      value: "white"
    },
    newline: true,
    value: "$"
  },
  user: {
    color: {
      modifier: "bold",
      type: "hex",
      value: "#0087ff"
    }
  }
};
