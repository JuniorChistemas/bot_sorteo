import { Message } from "whatsapp-web.js";
import { normalizeText } from "../utils/normalizeText";
import { isValidKeyword } from "../services/keywordService";
import { hasParticipated, registerParticipation, generateUniqueNumber } from "../services/participationService";

export async function handleMessage(message: Message){
    if(message.fromMe) return; // ignore messages sent by the bot itself
    if(message.from.endsWith('@g.us')) return; // ignore group messages
    if(message.type !== 'chat') return; // ignore non-text messages
    if(!message.body) return; // ignore empty messages

    const text = normalizeText(message.body);
    if(!isValidKeyword(text)) return; // ignore messages that do not match the keyword

    const phoneNumber = message.from.replace('@c.us', ''); // extract phone number from the message sender
    if(hasParticipated(phoneNumber)) {
        await message.reply('Ya has participado en el sorteo. ¡Gracias por tu interés!');
        return; // ignore if the user has already participated
    }
    const number = generateUniqueNumber();
    // register the participation of the user with the phone number and the number they chose
    registerParticipation(phoneNumber, number);
    await message.reply(
        `🎉 ¡Participación confirmada!\n\n` +
        `Tu número es: *${number}*\n\n` +
        `El resultado será publicado únicamente en nuestros Estados.\n\n` +
        `Canal informativo (opcional):\n${process.env.CHANNEL_LINK}`
    );
}