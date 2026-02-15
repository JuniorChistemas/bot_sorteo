import { logger } from '../utils/logger';

/**
 * generate a random delay between min and max milliseconds
 */
export function randomDelay(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Wait for a specified amount of time (in milliseconds)
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Humanized delay to simulate someone typing
 * Default between 1.5 and 4 seconds
 */
export async function typingDelay(minMs: number = 1500, maxMs: number = 4000): Promise<void> {
  const delay = randomDelay(minMs, maxMs);
  logger.debug(`Esperando ${delay}ms (simulando escritura)`);
  await sleep(delay);
}

/**
 * Short delay for quick responses or simple confirmations
 */
export async function shortDelay(minMs: number = 500, maxMs: number = 1500): Promise<void> {
  const delay = randomDelay(minMs, maxMs);
  await sleep(delay);
}

/**
 * Medium delay for standard responses
 */
export async function mediumDelay(minMs: number = 2000, maxMs: number = 4000): Promise<void> {
  const delay = randomDelay(minMs, maxMs);
  await sleep(delay);
}

/**
 * Long delay for more complex messages or messages with files
 */
export async function longDelay(minMs: number = 3000, maxMs: number = 6000): Promise<void> {
  const delay = randomDelay(minMs, maxMs);
  await sleep(delay);
}
