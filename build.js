const { execSync } = require('child_process');
const path = require('path');

try {
  console.log('Starting build process...');
  
  // Install dependencies if needed
  console.log('Installing dependencies...');
  execSync('npm install', { stdio: 'inherit' });
  
  // Run vite build
  console.log('Running vite build...');
  execSync('npx vite build', { stdio: 'inherit' });
  
  console.log('Build completed successfully!');
} catch (error) {
  console.error('Build failed:', error.message);
  process.exit(1);
}
