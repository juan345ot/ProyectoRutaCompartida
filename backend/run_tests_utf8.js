const { execSync } = require('child_process');
const fs = require('fs');

try {
  const output = execSync('npx jest --no-colors --detectOpenHandles --forceExit', {
    env: { ...process.env, NODE_ENV: 'test' },
    encoding: 'utf8',
    stdio: 'pipe'
  });
  fs.writeFileSync('output.txt', output);
} catch (error) {
  fs.writeFileSync('output.txt', (error.stdout || '') + '\n' + (error.stderr || ''));
}
console.log('Final attempt finished. Check output.txt');
