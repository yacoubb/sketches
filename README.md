# sketches

All of my p5.js sketches and gifs.

## Architecture

Sketches are created in `editor`, a super barebones next app used to demo how the sketch will look in real time. Sketches (when in development) are saved in `editor` and when they are complete get moved to the `interactive` folder. Keeping up to date copies of sketches in the interactive folder is handled by `pre-commit.py` and git hooks.

The `sketch-index` and `gif-index` json files are how my website knows which gifs/sketches to load and include in the webpack build.
