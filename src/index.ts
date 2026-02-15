import 'dotenv/config';
import { handleMessage } from './handlers/messageHandler';
import { client } from './cliente';
import { logger } from './utils/logger';

client.on('message_create', async (message) => {
  try {
    await handleMessage(message);
  } catch (error) {
    logger.error({ error }, 'Error al manejar mensaje');
  }
});

client.initialize();
