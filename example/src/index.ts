import * as dotEnv from 'dotenv';
import { uWave } from 'u-wave-nodejs-client';

dotEnv.config();

const uw = new uWave({
  authImmediately: true,
  apiBaseUrl: process.env.API_BASE_URL || '',
  wsConnectionString: process.env.WEBSOCKET_CONNECTION_STRING || '',
  credentials: {
    email: process.env.U_WAVE_EMAIL || '',
    password: process.env.U_WAVE_PASSWORD || '',
  },
});

uw.on('disconnected', () => {
  console.info('disconnected');
});

uw.on('error', (err) => {
  console.error('error', err);
});

uw.on('login', () => {
  console.info('logged in');
});

uw.on('connected', () => {
  console.info('connected');

  uw.sendChat('hello world');
});
