function chunkArray(array, size) {
  const chunks = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function printSummary(stats) {
  const duration = Date.now() - stats.startTime;
  console.log('\n=== Summary ===');
  console.log(`Folders removed: ${stats.removedFolders}`);
  console.log(`Total size freed: ${formatBytes(stats.totalSize)}`);
  console.log(`Duration: ${(duration / 1000).toFixed(2)}s`);
  if (stats.errors.length > 0) {
    console.log(`Errors: ${stats.errors.length}`);
  }
}

module.exports = { 
  chunkArray, 
  formatBytes, 
  printSummary 
};