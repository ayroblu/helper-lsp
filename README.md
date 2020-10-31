# Helper LSP

A simple lsp to help perform basic linting rules on files

## LSP spec details

The point is to highlight mistakes and provide greater insight and rules for various docs.
See https://microsoft.github.io/language-server-protocol/specification "Language Features" for supported options like go to definition etc.

## Use with vim:

In your coc-settings you can add the following, uncomment the execArgv + `chrome://inspect` and make sure to tick "Discover network targets" which should show the option to step through the code.

Details can be found here: https://github.com/neoclide/coc.nvim/wiki/Debug-language-server

```json
{
  // LSPs
  "languageserver": {
    "helper": {
      "module": "/Users/blu/ws/helper-lsp/dist/server/index.js",
      "args": ["--node-ipc"],
      "filetypes": ["text"],
      "trace.server": "verbose",
      // "rootPatterns": ["root.yml"],
      // Used for debugging
      // "execArgv": ["--nolazy", "--inspect-brk=6045"],
      "initializationOptions": {},
      "settings": {
        "validate": true
      }
    }
  }
}
```

## Possible ideas?

- Reference points for documentation - hyperlinks with reference checks?
