import path from 'path';

// Configuration for CSV database
export const CSV_DATABASE_CONFIG = {
  // Directory where CSV files are stored
  DATA_DIR: path.join(process.cwd(), 'data'),
  
  // File extension for CSV files
  FILE_EXTENSION: '.csv',
  
  // Encoding for CSV files
  ENCODING: 'utf8',
  
  // Delimiter for CSV files
  DELIMITER: ',',
  
  // Whether to quote all fields
  QUOTE_ALL: true,
  
  // Whether to include headers in CSV files
  INCLUDE_HEADERS: true
};