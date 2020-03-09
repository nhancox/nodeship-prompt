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
    preposition: "in",
    prepositionColor: {
      modifier: "bold",
      type: "keyword",
      value: "white"
    }
  },
  host: {
    color: {
      modifier: "bold",
      type: "hex",
      value: "#00afaf"
    },
    preposition: "at",
    prepositionColor: {
      modifier: "bold",
      type: "keyword",
      value: "white"
    }
  },
  newline: true,
  prompt: ["user", "host", "directory"],
  symbol: "$",
  symbolColor: {
    modifier: "bold",
    type: "keyword",
    value: "white"
  },
  user: {
    color: {
      modifier: "bold",
      type: "hex",
      value: "#0087ff"
    }
  }
};
