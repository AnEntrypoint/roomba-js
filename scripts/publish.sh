#!/bin/bash

# 🚀 roomba-js NPM Publish Workflow
# This script automates the complete npm package publishing process

set -e

echo "🔧 Starting roomba-js npm publish workflow..."

# 1. Check npm authentication
echo "📋 Checking npm authentication..."
if ! npm whoami > /dev/null 2>&1; then
    echo "❌ Not logged in to npm. Please run: npm login"
    exit 1
fi
echo "✅ Authenticated as: $(npm whoami)"

# 2. Run tests
echo "🧪 Running package tests..."
npm test

# 3. Check for uncommitted changes
echo "📝 Checking git status..."
if [ -n "$(git status --porcelain)" ]; then
    echo "⚠️  You have uncommitted changes. Please commit or stash them first."
    echo "Current status:"
    git status --short
    exit 1
fi
echo "✅ Working directory clean"

# 4. Check current branch
echo "🌿 Checking git branch..."
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
if [ "$CURRENT_BRANCH" != "main" ] && [ "$CURRENT_BRANCH" != "master" ]; then
    echo "⚠️  You're on branch '$CURRENT_BRANCH'. Consider switching to main/master"
    read -p "Continue anyway? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# 5. Check package name availability
echo "🔍 Checking package availability..."
PACKAGE_NAME=$(node -p "require('./package.json').name")
if npm view "$PACKAGE_NAME" > /dev/null 2>&1; then
    CURRENT_VERSION=$(npm view "$PACKAGE_NAME" version)
    LOCAL_VERSION=$(node -p "require('./package.json').version")
    echo "📦 Package '$PACKAGE_NAME' exists (v$CURRENT_VERSION)"
    echo "📍 Local version: $LOCAL_VERSION"
    
    if [ "$CURRENT_VERSION" = "$LOCAL_VERSION" ]; then
        echo "❌ Version conflict! Package version $LOCAL_VERSION already published."
        echo "Please bump version with: npm version patch|minor|major"
        exit 1
    fi
else
    echo "🎉 Package '$PACKAGE_NAME' is available for publishing!"
fi

# 6. Dry run publish
echo "🔍 Testing package (dry run)..."
npm pack --dry-run

# 7. Show package preview
echo "📦 Package preview:"
PACK_NAME=$(npm pack | tail -n 1)
echo "Created: $PACK_NAME"
tar -tzf "$PACK_NAME" | sed 's/^/  /'
rm "$PACK_NAME"

# 8. Confirm publish
echo ""
echo "🚀 Ready to publish '$PACKAGE_NAME' to npm!"
read -p "Continue with publish? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Publish cancelled."
    exit 0
fi

# 9. Publish
echo "📤 Publishing to npm..."
if [ -n "$(npm view "$PACKAGE_NAME" 2>/dev/null)" ]; then
    echo "🔄 Updating existing package..."
    npm publish
else
    echo "🆕 Publishing new package..."
    npm publish
fi

echo "✅ Successfully published '$PACKAGE_NAME' to npm!"
echo "🌐 View at: https://www.npmjs.com/package/$PACKAGE_NAME"

# 10. Git tag push
echo "🏷️  Pushing git tags..."
git push --tags

echo "🎉 Publish workflow completed successfully!"
