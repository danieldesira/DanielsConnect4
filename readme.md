Port of old Connect4 project of mine (pre-2013) to TypeScript for much better code readability and future extension

Link to original project: https://github.com/dannydes/blu4

## Debugging
To start building and minifying the TypeScript files, enter `npm start`.

To serve the files from a local server, enter `npm run serve` and you will be able to access the webpages on `http://localhost:5000/`.
Launching `index.html` through the file system also works fine.

In order to take advantage of source map during debugging, do the following in the Chrome devtools:
- Click the Sources tab.
- Then click the Filesystem tab within Sources and click "Add folder to workspace".
- Navigate to the src folder on your environment.
- Reload the page and feel free to set breakpoints in the code.

## Libraries
- FontAwesome SVG