# Console Log Helper

This VS Code extension allows developers to quickly insert `console.log` statements for selected variables. It even auto-increments log count for the same variable to make debugging easier.

## Features

- Insert `console.log("variable------> (1)", variable)` format.
- Automatically detects if same variable has been logged before.
- Multi-cursor support: insert log for multiple variables at once.
- Custom keybinding (default: `Alt+Q`).

## Usage

1. Select a variable name (or just place the cursor on it).
2. Press `Alt+Q`.
3. A `console.log` will be inserted on the next line.

## Requirements

No dependencies required.

## Release Notes

### 0.0.1

- Initial release.
