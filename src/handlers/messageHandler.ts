import { Message, MessageMedia } from 'whatsapp-web.js';
import { normalizeText } from '../utils/normalizeText';
import { isValidKeyword } from '../services/keywordService';
import {
  hasParticipated,
  registerParticipation,
  generateUniqueNumber,
  getParticipants,
} from '../services/participationService';
import { isSpamming, clearAttempts } from '../services/antiSpamService';
import { logger } from '../utils/logger';
import { exportData } from '../services/exportData';

export async function handleMessage(message: Message) {
  
  if (message.from.endsWith('@g.us')) return; // ignore group messages
  if (message.type !== 'chat') return; // ignore non-text messages
  if (!message.body) return; // ignore empty messages
  // Si el mensaje es del propio bot y contiene la palabra clave de exportación
  if (message.fromMe && message.body) {
    const text = normalizeText(message.body);
    const exportKeyword = process.env.KEY_EXPORT || 'datos';
    
    if (text === exportKeyword) {
      const participants = getParticipants();
      const dbPath = process.env.DATABASE_PATH || './db/participation.db';
      const csvFilePath = dbPath.replace('participation.db', 'participantes.csv');
      
      exportData(participants as any[], csvFilePath);
      logger.info('CSV exportado para administrador');
      
      const media = MessageMedia.fromFilePath(csvFilePath);
      await message.reply(media, undefined, { 
        caption: `📊 Lista de participantes\nTotal: ${participants.length}` 
      });
      
      logger.info('CSV enviado al administrador');
    }
    return;
  }

  const phoneNumber = message.from.replace('@c.us', '');

  // verificar si el usuario está haciendo spam
  if (isSpamming(phoneNumber)) {
    logger.warn({ phoneNumber }, 'Mensaje bloqueado por spam');
    return;
  }

  const text = normalizeText(message.body);
  if (!isValidKeyword(text)) return; // ignore messages that do not match the keyword

  const chat = await message.getChat();
  await chat.sendStateTyping(); // show typing indicator while processing the message

  if (hasParticipated(phoneNumber)) {
    await chat.clearState(); // stop typing indicator if the user has already participated
    await message.reply('Ya has participado en el sorteo. ¡Gracias por tu interés!');
    logger.info({ phoneNumber }, 'Usuario ya participó previamente');
    return; // ignore if the user has already participated
  }

  const number = generateUniqueNumber();
  // register the participation of the user with the phone number and the number they chose
  registerParticipation(phoneNumber, number);
  clearAttempts(phoneNumber); // limpiar intentos después de registro exitoso

  await chat.clearState(); // stop typing indicator after processing the message
  await message.reply(
    `🎉 ¡Participación confirmada!\n\n` +
      `Tu número es: *${number}*\n\n` +
      `El resultado será publicado únicamente en nuestros Estados.\n\n` +
      `Canal informativo (opcional):\n${process.env.CHANNEL_LINK}`
  );

  logger.info({ phoneNumber, number }, 'Participación registrada exitosamente');
}
