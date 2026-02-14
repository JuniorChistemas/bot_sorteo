import 'dotenv/config';
import { handleMessage } from './handlers/messageHandler';
import { client } from './cliente';

client.on('message_create', async (message) => {
    try {
        await handleMessage(message);
    } catch (error) {
        console.error('Error:', error);
    }
});

client.initialize();
