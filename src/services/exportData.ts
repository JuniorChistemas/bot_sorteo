import fs from 'fs';

interface Participants {
  id: number;
  phone_number: string;
  number: number;
  timestamp: string;
}

export function exportData(participants: Participants[], filePath: string): void {
  const csvHeader = 'id,phone_number,number,timestamp\n';
  const csvRows = participants.map(
    (participant) =>
      `${participant.id},${participant.phone_number},${participant.number},${participant.timestamp}`
  );
  const csvContent = csvHeader + csvRows.join('\n');

  fs.writeFileSync(filePath, csvContent, 'utf-8');
}
