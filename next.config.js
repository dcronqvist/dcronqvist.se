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
    "micromark-extension-directive",
    "micromark-factory-space",
    "micromark-util-character",
    "micromark-factory-whitespace",
    "mdast-util-directive",
    "character-entities-legacy",
    "unist-util-visit-parents",
    "property-information",
    "space-separated-tokens",
    "comma-separated-tokens",
    "parse-entities"
]); // pass the modules you would like to see transpiled
  
module.exports = withTM({
    
});