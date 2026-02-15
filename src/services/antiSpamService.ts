import { logger } from '../utils/logger';

interface UserAttempt {
  count: number;
  firstAttempt: number;
  blocked: boolean;
  blockedUntil?: number;
}

const userAttempts = new Map<string, UserAttempt>();

const MAX_ATTEMPTS = 5; // five attempts allowed within the time window before blocking
const TIME_WINDOW = 60 * 1000; // time window in ms (1 minute)
const BLOCK_DURATION = 5 * 60 * 1000; // block duration in ms (5 minutes)

export function isSpamming(phoneNumber: string): boolean {
  const now = Date.now();
  const userAttempt = userAttempts.get(phoneNumber);

  if (!userAttempt) {
    userAttempts.set(phoneNumber, {
      count: 1,
      firstAttempt: now,
      blocked: false,
    });
    return false;
  }

  // check if the user is blocked
  if (userAttempt.blocked) {
    if (userAttempt.blockedUntil && now < userAttempt.blockedUntil) {
      logger.warn({ phoneNumber }, 'Usuario bloqueado por spam');
      return true;
    } else {
      // desbloquear usuario
      userAttempt.blocked = false;
      userAttempt.count = 1;
      userAttempt.firstAttempt = now;
      delete userAttempt.blockedUntil;
      logger.info({ phoneNumber }, 'Usuario desbloqueado');
      return false;
    }
  }

  // yes, check if the time window has passed since the first attempt
  if (now - userAttempt.firstAttempt > TIME_WINDOW) {
    userAttempt.count = 1;
    userAttempt.firstAttempt = now;
    return false;
  }

  // incremet the attempt count
  userAttempt.count++;

  // block the user if they exceed the maximum attempts
  if (userAttempt.count > MAX_ATTEMPTS) {
    userAttempt.blocked = true;
    userAttempt.blockedUntil = now + BLOCK_DURATION;
    logger.warn(
      { phoneNumber, attempts: userAttempt.count },
      'Usuario bloqueado por exceder límite de intentos'
    );
    return true;
  }

  return false;
}

export function clearAttempts(phoneNumber: string): void {
  userAttempts.delete(phoneNumber);
  logger.debug({ phoneNumber }, 'Intentos limpiados');
}

// clear old attempts every 10 minutes to prevent memory leaks
setInterval(
  () => {
    const now = Date.now();
    let cleaned = 0;

    for (const [phoneNumber, attempt] of userAttempts.entries()) {
      if (!attempt.blocked && now - attempt.firstAttempt > TIME_WINDOW * 2) {
        userAttempts.delete(phoneNumber);
        cleaned++;
      }
    }

    if (cleaned > 0) {
      logger.debug({ cleaned }, 'Limpieza de intentos antiguos');
    }
  },
  10 * 60 * 1000
);
