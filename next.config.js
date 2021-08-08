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
    "ccount"
]); // pass the modules you would like to see transpiled
  
module.exports = withTM({
    
});