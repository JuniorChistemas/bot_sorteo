import Database from 'better-sqlite3';
import path from 'path';
import { generateNumber } from './raffleService';

const dbPath = path.resolve('db/participation.db');
const db = new Database(dbPath);

db.prepare(
  `CREATE TABLE IF NOT EXISTS participation (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  phone_number TEXT NOT NULL,
  number INTEGER NOT NULL,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(phone_number, number)
)`
).run();

export function today() {
  return new Date().toISOString().split('T')[0];
}

// function for verify if the user has already participated with the same phone number
export function hasParticipated(phoneNumber: string): boolean {
  const row = db
    .prepare(
      `
        SELECT id FROM participation 
        WHERE phone_number = ?
    `
    )
    .get(phoneNumber);
  return !!row;
}

// function for register the participation of the user with the phone number and the number they chose
export function registerParticipation(phoneNumber: string, number: number) {
  db.prepare('INSERT INTO participation (phone_number, number, timestamp) VALUES (?, ?, ?)').run(
    phoneNumber,
    number,
    today()
  );
}

// function to check if a number already exists in the database
export function numberExists(number: number): boolean {
  const row = db.prepare('SELECT id FROM participation WHERE number = ?').get(number);
  return !!row;
}

// function to generate a unique number that doesn't exist in the database
export function generateUniqueNumber(): number {
  let number = generateNumber();
  let attempts = 0;
  const maxAttempts = 100; // Prevenir bucle infinito

  while (numberExists(number) && attempts < maxAttempts) {
    number = generateNumber();
    attempts++;
  }

  if (attempts >= maxAttempts) {
    throw new Error('No se pudo generar un número único. Todos los números están ocupados.');
  }

  return number;
}

// fuction to get all the participants from the database
export function getParticipants() {
  return db.prepare('SELECT * FROM participation').all();
}
