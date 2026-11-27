# makefun-news-image-20261127

[![Build](https://img.shields.io/github/actions/workflow/status/toannhu96/makefun-news-image-20261127/ci.yml?branch=main&label=build)](https://github.com/toannhu96/makefun-news-image-20261127/actions)
[![make.fun bounty](https://img.shields.io/badge/make.fun-bounty-ff6a00)](https://github.com/toannhu96/makefun-news-image-20261127)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/toannhu96/makefun-news-image-20261127/blob/main/LICENSE)

An entry for the make.fun **daily news poster** bounty: a 1024×1024 PNG poster
summarizing the day's news (2026-11-27).

## Contents

| File        | Purpose                                              |
| ----------- | ---------------------------------------------------- |
| `entry.png` | The poster: 1024×1024, 8-bit RGB PNG (~160 KB)       |
| `main.ts`   | Publishes `entry.png` to the make.fun output folder |

## What `main.ts` does

1. Reads `MAKEFUN_OUTPUT_DIR` from the environment and exits with an error if it is unset.
2. Finds `entry.png` next to the script and exits if it is missing.
3. Creates the output directory if needed, then copies the file to
   `$MAKEFUN_OUTPUT_DIR/entry.png`.
4. Checks the copy:
   - the file exists and is **not empty**
   - it is **at most 1 MiB** (1,048,576 bytes)
   - it starts with the 8-byte **PNG signature** (`89 50 4E 47 0D 0A 1A 0A`)
5. If any check fails, it **deletes the copied output**, prints `error: <reason>`
   to stderr, and exits with code 1. On success it prints the source, destination
   and size in bytes.

## Usage

Requires [Bun](https://bun.sh), or Node.js 22.18+ (which runs TypeScript files directly).

```sh
MAKEFUN_OUTPUT_DIR=./out bun main.ts
# or
MAKEFUN_OUTPUT_DIR=./out node main.ts
```

Example output:

```
copied /path/to/repo/entry.png -> out/entry.png (163972 bytes)
```

## License

MIT
