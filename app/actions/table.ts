'use server';

import {ServerError} from '@/utils/server/CustomErrors';

/**
 * Get all objects from the database as a CSV
 * @param model
 */
export const asCsv = (objects: Record<string, unknown>[]) => {
  if (!objects.length) {
    throw new ServerError('nothingToExport');
  }

  // Create CSV file
  let csv = '';

  // Add headers
  const headers = Object.keys(objects[0]);
  csv += `${headers.join(';')}\n`;

  // Add rows
  objects.forEach(object => {
    const row = headers.map(header => object[header]);
    csv += `${row.join(';')}\n`;
  });

  // Send CSV data
  return csv;
};
