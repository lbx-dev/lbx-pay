const { spawn } = require('child_process');

function startIntegrationTest() {
  const child = spawn('mocha', [ '--max-old-space-size=12192', '-c', '-b', '--no-warnings', '--exit', 'integration/integration.test' ]);

  child.stdout.on('data', data => {
    process.stdout.write(data);
  });

  child.stderr.on('data', data => {
    process.stderr.write(data);
  });

  child.on('close', (code) => {
    process.exit(code);
  });
}

module.exports = { startIntegrationTest };