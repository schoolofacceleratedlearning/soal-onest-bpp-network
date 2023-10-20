import { spawn } from 'child_process';

// import 'dotenv/config';
import {
  SecretsManagerClient,
  GetSecretValueCommand,
} from '@aws-sdk/client-secrets-manager';

const { SECRET_NAME, ACCESS_KEY, SECRET_KEY } = process.env;
const secret_name = SECRET_NAME;

// Define the AWS region
const region = 'ap-south-1';

const credentials = {
  accessKeyId: ACCESS_KEY || '',
  secretAccessKey: SECRET_KEY || '',
};

async function check() {
  const client = new SecretsManagerClient({
    region,
    credentials,
  });
  const input = {
    // GetSecretValueRequest
    SecretId: secret_name,
  };
  const command = new GetSecretValueCommand(input);
  const response = await client.send(command);
  const secrets = JSON.parse(response.SecretString || '{}');
  Object.entries(secrets).forEach(([key, value]) => {
    if (!process.env[key]) {
      let val: string | boolean = (value as string)?.trim?.() ?? '';
      if (val === 'false') val = false;
      if (val === 'true') val = true;
      process.env[key] = val.toString();
      console.log(`Setting ${key} to ${process.env[key]}`);
    }
  });
}

check()
  .then(() => {
    const childProcess = spawn('npm', ['run', 'start']);
    childProcess.on('error', (err) => {
      console.error('Child process error:', err);
    });
    childProcess.on('close', (code) => {
      console.log(`Child process exited with code ${code}`);
    });
    // Listen for data events from the child process (stdout and stderr)
    childProcess.stdout.on('data', (data) => {
      console.log(`Child Process (stdout): ${data}`);
    });
    childProcess.stderr.on('data', (data) => {
      console.error(`Child Process (stderr): ${data}`);
    });
  })
  .catch((err) => {
    console.log('Error in check', err);
  });