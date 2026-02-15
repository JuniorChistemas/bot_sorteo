import { Client, LocalAuth } from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal';
import { logger } from './utils/logger';

export const client = new Client({
  authStrategy: new LocalAuth({
    dataPath: './data',
  }),
  puppeteer: {
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--no-first-run',
      '--no-zygote',
      '--single-process', // <- this one doesn't works in Windows
      '--disable-gpu',
    ],
  },
});

client.on('qr', (qr) => {
  logger.info('QR Code generado');
  qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
  logger.info('✅ Cliente listo');
});

client.on('disconnected', (reason) => {
  logger.warn({ reason }, 'Cliente desconectado');
});
