import * as dotEnv from 'dotenv';
import { uWave } from 'u-wave-nodejs-client';

dotEnv.config();

const credentials = {
  email: process.env.U_WAVE_EMAIL || '',
  password: process.env.U_WAVE_PASSWORD || '',
};

const uw = new uWave({
  authImmediately: false,
  apiBaseUrl: process.env.API_BASE_URL || '',
  wsConnectionString: process.env.WEBSOCKET_CONNECTION_STRING || '',
  // credentials,
});

let isShuttingDown = false;

uw.socket.on('disconnected', () => {
  console.info('disconnected');

  if (isShuttingDown) return;

  // implement retry

  uw.socket.connect();
});

uw.socket.on('error', (err) => {
  console.error('error', err);
});

uw.socket.on('login', () => {
  console.info('logged in');
});

uw.socket.on('connected', () => {
  console.info('connected');
});

uw.socket.on('authenticated', () => {
  console.info('authenticated');

  uw.sendChat('hello world');
});

process.on('SIGINT', () => {
  console.log('\nshutting down');

  isShuttingDown = true;

  uw.socket.disconnect();
});

uw.auth
  .login(credentials.email, credentials.password)
  .then(() => uw.socket.connect());
