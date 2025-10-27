# wipe-cli

High-performance recursive node_modules removal tool.

## Installation

```bash
npm install -g wipe-cli
```

## Usage

```bash
# Dry run (see what would be removed)
wipe-cli --dry-run

# Clean current directory
wipe-cli

# Clean specific path
wipe-cli /path/to/project

# Verbose output
wipe-cli --verbose

# Force removal (skip protections)
wipe-cli --force

# Set concurrent workers
wipe-cli --concurrent 8
```

## Options

- `-d, --dry-run` - Show what would be removed without actually removing
- `-v, --verbose` - Verbose output
- `-f, --force` - Force removal without protection checks
- `-c, --concurrent <number>` - Number of concurrent workers
- `-V, --version` - Show version number
- `-h, --help` - Show help

## Features

- 🚀 High-performance parallel processing
- 📊 Real-time progress reporting
- 🔒 Built-in safety protections
- 💾 Accurate size calculation
- 🎯 Precise node_modules detection
