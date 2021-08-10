const withTM = require("next-transpile-modules")([
    "remark-highlight.js",
    "lowlight",
    "fault",
    "remark-html",
    "unist-util-is",
    "hast-util-to-html",
    "html-void-elements",
    "hast-util-is-element",
    "hast-util-whitespace",
    "stringify-entities",
    "character-entities-html4",
    "ccount",
    "hastscript",
    "hast-util-parse-selector",
    "remark-directive",
    "micromark-util-symbol/codes.js",
    "mdast-util-directive",
    "character-entities-legacy",
    "unist-util-visit-parents"
]); // pass the modules you would like to see transpiled
  
module.exports = withTM({
    
});