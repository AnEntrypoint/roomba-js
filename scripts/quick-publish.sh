#!/bin/bash

# ⚡ roomba-js Quick Publish
# Simplified publish script for rapid iterations

set -e

PACKAGE_NAME=$(node -p "require('./package.json').name")
echo "⚡ Quick publishing $PACKAGE_NAME..."

# Quick checks
if ! npm whoami > /dev/null 2>&1; then
    echo "❌ Not logged in to npm"
    exit 1
fi

# Run basic test
npm test

# Check if package exists
if npm view "$PACKAGE_NAME" > /dev/null 2>&1; then
    echo "📦 Updating existing package..."
else
    echo "🆕 Publishing new package..."
fi

# Publish
npm publish

echo "✅ Published! https://www.npmjs.com/package/$PACKAGE_NAME"
