const fs = require('fs');
const path = require('path');
const { Worker } = require('worker_threads');

class RoombaCleaner {
  constructor(options = {}) {
    this.options = {
      maxWorkers: options.maxWorkers || require('os').cpus().length,
      batchSize: options.batchSize || 100,
      force: options.force || false,
      dryRun: options.dryRun || false,
      verbose: options.verbose || false,
      ...options
    };
    this.stats = {
      totalSize: 0,
      removedFolders: 0,
      errors: [],
      startTime: Date.now()
    };
  }

  formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  async findNodeModules(startPath) {
    const nodeModulesPaths = [];
    
    async function scanDirectory(dir) {
      try {
        const items = await fs.promises.readdir(dir);
        
        for (const item of items) {
          if (item === 'node_modules') {
            const fullPath = path.join(dir, item);
            try {
              const stat = await fs.promises.stat(fullPath);
              if (stat.isDirectory()) {
                nodeModulesPaths.push(fullPath);
              }
            } catch (error) {
              // Skip if we can't stat
            }
          } else if (!item.startsWith('.') && item !== 'node_modules') {
            const fullPath = path.join(dir, item);
            try {
              const stat = await fs.promises.stat(fullPath);
              if (stat.isDirectory()) {
                await scanDirectory(fullPath);
              }
            } catch (error) {
              // Skip if we can't stat
            }
          }
        }
      } catch (error) {
        // Skip if we can't read directory
      }
    }
    
    await scanDirectory(startPath);
    return nodeModulesPaths;
  }

  async calculateSize(folderPath) {
    let totalSize = 0;
    
    async function calculate(dir) {
      try {
        const items = await fs.promises.readdir(dir);
        for (const item of items) {
          const fullPath = path.join(dir, item);
          const stat = await fs.promises.stat(fullPath);
          if (stat.isDirectory()) {
            await calculate(fullPath);
          } else {
            totalSize += stat.size;
          }
        }
      } catch (error) {
        // Skip if we can't read
      }
    }
    
    await calculate(folderPath);
    return totalSize;
  }

  async removeFolder(folderPath) {
    try {
      if (!this.options.dryRun) {
        await fs.promises.rm(folderPath, { 
          recursive: true, 
          force: this.options.force 
        });
      }
      return { success: true, path: folderPath };
    } catch (error) {
      return { success: false, path: folderPath, error: error.message };
    }
  }

  async clean(startPath) {
    const absolutePath = path.resolve(startPath);
    
    if (!fs.existsSync(absolutePath)) {
      throw new Error(`Path not found: ${absolutePath}`);
    }

    console.log(`🔍 Scanning for node_modules folders in: ${absolutePath}`);
    
    const nodeModulesPaths = await this.findNodeModules(absolutePath);
    
    if (nodeModulesPaths.length === 0) {
      console.log('✅ No node_modules folders found');
      return this.stats;
    }

    console.log(`📁 Found ${nodeModulesPaths.length} node_modules folders`);

    if (this.options.dryRun) {
      console.log('🔍 DRY RUN - Showing what would be removed:');
    }

    for (const folderPath of nodeModulesPaths) {
      if (this.options.verbose) {
        console.log(`📂 Processing: ${folderPath}`);
      }

      const size = await this.calculateSize(folderPath);
      this.stats.totalSize += size;

      if (this.options.dryRun) {
        console.log(`🗑️  Would remove: ${folderPath} (${this.formatBytes(size)})`);
      } else {
        console.log(`🗑️  Removing: ${folderPath} (${this.formatBytes(size)})`);
        const result = await this.removeFolder(folderPath);
        
        if (result.success) {
          this.stats.removedFolders++;
          console.log(`✅ Removed: ${result.path}`);
        } else {
          this.stats.errors.push(result.error);
          console.error(`❌ Failed to remove: ${result.path} - ${result.error}`);
        }
      }
    }

    this.printSummary();
    return this.stats;
  }

  printSummary() {
    const duration = Date.now() - this.stats.startTime;
    console.log('\n=== Summary ===');
    console.log(`Folders found: ${this.stats.removedFolders || (this.options.dryRun ? 'N/A (dry run)' : '0')}`);
    console.log(`Total size: ${this.formatBytes(this.stats.totalSize)}`);
    console.log(`Duration: ${(duration / 1000).toFixed(2)}s`);
    if (this.stats.errors.length > 0) {
      console.log(`Errors: ${this.stats.errors.length}`);
    }
  }
}

module.exports = RoombaCleaner;