## [1.0.2] - 

### Fixed
- Removed deprecated core-cleaner-deprecated.js and worker-manager.js files
- Updated package.json metadata (repository, author, homepage)
- Cleaned up project structure as per development workflow

## [1.0.1] - 2025-10-27
- 🎉 **PACKAGE PUBLISHED** to npm as `wipe-dev`
- ✅ Global CLI command `wipe-cli` verified working
- ✅ Installation and functionality tests passed
- 📦 Package available: `npm install -g wipe-dev`
- 🔧 Version bumped to 1.0.1 (1.0.0 already existed)

# Changelog

## [1.0.1] - 2024-01-XX
### Fixed
- Fixed CLI name inconsistency: sweepjs → roomba-js in bin/roomba.js
- Fixed module export issues in lib/core-cleaner.js (removed object wrapper)
- Created simplified working module (lib/roomba-cleaner.js) to ensure compatibility
- Fixed package.json name and bin command consistency

### Changed
- Updated package name from "wipe-dev" to "roomba-js" (available npm name)
- Simplified module architecture for better reliability
- Streamlined imports to use single working module
- Updated CLI command to match package name

### Improved
- Enhanced module stability with direct Node.js require testing
- Verified all functionality works with dry-run and verbose modes
- Ensured CLI help displays correct command name

## [1.0.0] - 2024-01-XX
### Added
- High-performance recursive node_modules removal tool
- Multi-threaded file deletion capability (simplified version)
- CLI interface with dry-run and verbose options
- Progress tracking and statistics reporting

### Features
- Recursive directory scanning for node_modules folders
- Batch processing with configurable worker count
- Force mode for bypassing protection checks
- Size calculation and formatted reporting
