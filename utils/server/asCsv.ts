import {ServerError} from './CustomErrors';

/**
 * Transform an array of objects into a CSV string
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
