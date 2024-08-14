require('dotenv').config();
const http = require('http');
const exec = require('child_process').exec;
const fs = require('fs');

// Load environment variables
const projectPath = process.env.PROJECT_PATH;
const gitBranch = process.env.GIT_BRANCH;
const postPullCommands = process.env.POST_PULL_COMMANDS;
const logFile = process.env.LOG_FILE;

const executeCommand = (command) => {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      const logStream = fs.createWriteStream(logFile, { flags: 'a' });
      const timestamp = new Date().toISOString();
      logStream.write(`[${timestamp}] Command executed: ${command}\n`);
      if (error) {
        logStream.write(`[${timestamp}] Error: ${stderr}\n`);
        console.error(`Error: ${stderr}`);
        logStream.end();
        reject(stderr);
      } else {
        logStream.write(`[${timestamp}] Output: ${stdout}\n`);
        console.log(`Output: ${stdout}`);
        logStream.end();
        resolve(stdout);
      }
    });
  });
};

const server = http.createServer(async (req, res) => {
  if (req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', async () => {
      try {
        const payload = JSON.parse(body);

        // Check if the push event is from the correct branch
        if (payload.ref === `refs/heads/${gitBranch}`) {
          // Prepare the command to execute
          const command = `cd ${projectPath} && git pull origin ${gitBranch} && ${postPullCommands}`;

          try {
            // Execute the command and wait for it to finish
            await executeCommand(command);
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(JSON.stringify({status: 'success'}));
          } catch (error) {
            res.writeHead(500, {'Content-Type': 'application/json'});
            res.end(JSON.stringify({status: 'failure', error: error}));
          }
        } else {
          res.writeHead(400, {'Content-Type': 'application/json'});
          res.end(JSON.stringify({status: 'failure', reason: 'Branch does not match'}));
        }
      } catch (err) {
        console.error('Error parsing JSON:', err);
        res.writeHead(400, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({status: 'failure', reason: 'Invalid JSON'}));
      }
    });
  } else {
    res.writeHead(405, {'Content-Type': 'application/json'});
    res.end(JSON.stringify({status: 'failure', reason: 'Only POST requests are accepted'}));
  }
});

const PORT = 39000
server.listen(PORT, () => {
  console.log(`Webhook server is listening on port ${PORT}`);
});
