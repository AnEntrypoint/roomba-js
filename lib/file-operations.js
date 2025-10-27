const fs = require('fs').promises;
const path = require('path');

async function removeFolder(folderPath, force = false) {
  try {
    await fs.rm(folderPath, { 
      recursive: true, 
      force: force,
      maxRetries: 3,
      retryDelay: 100
    });
  } catch (error) {
    if (error.code !== 'ENOENT') {
      throw error;
    }
  }
}

async function calculateSize(folderPath) {
  let totalSize = 0;
  
  async function calculateSizeRecursive(dir) {
    try {
      const entries = await fs.readdir(dir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        
        if (entry.isDirectory()) {
          await calculateSizeRecursive(fullPath);
        } else if (entry.isFile()) {
          try {
            const stats = await fs.stat(fullPath);
            totalSize += stats.size;
          } catch (error) {
            continue;
          }
        }
      }
    } catch (error) {
      return;
    }
  }
  
  await calculateSizeRecursive(folderPath);
  return totalSize;
}

module.exports = { removeFolder, calculateSize };