const fs = require('fs');
const path = require('path');
const { parse, stringify } = require('csv/sync');
const { v4: uuidv4 } = require('uuid');

// Configuration for CSV directory
const CSV_DATA_DIR = path.join(process.cwd(), 'data');

// Simple file locking mechanism
const fileLocks = new Map();

function acquireLock(filename) {
  return new Promise((resolve) => {
    const checkLock = () => {
      if (!fileLocks.has(filename)) {
        fileLocks.set(filename, true);
        resolve();
      } else {
        // Wait and try again
        setTimeout(checkLock, 10);
      }
    };
    checkLock();
  });
}

function releaseLock(filename) {
  fileLocks.delete(filename);
}

/**
 * Ensure the data directory exists
 */
function ensureDataDirectory() {
  if (!fs.existsSync(CSV_DATA_DIR)) {
    fs.mkdirSync(CSV_DATA_DIR, { recursive: true });
  }
}

/**
 * Get the full path for a CSV file
 * @param filename The name of the CSV file
 * @returns The full path to the CSV file
 */
function getCSVFilePath(filename) {
  return path.join(CSV_DATA_DIR, filename);
}

/**
 * Read data from a CSV file
 * @param filename The name of the CSV file
 * @returns Array of objects representing the CSV data
 */
async function readCSV(filename) {
  // Acquire lock before reading
  await acquireLock(filename);
  
  try {
    const filePath = getCSVFilePath(filename);
    
    // If file doesn't exist, return empty array
    if (!fs.existsSync(filePath)) {
      return [];
    }
    
    const fileContent = fs.readFileSync(filePath, 'utf8');
    if (!fileContent.trim()) {
      return [];
    }
    
    const data = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true
    });
    
    // Convert string values back to appropriate types
    return data.map((row) => {
      const convertedRow = {};
      for (const [key, value] of Object.entries(row)) {
        // Handle special cases for data types
        if (value === '') {
          convertedRow[key] = null;
        } else if (value === 'true') {
          convertedRow[key] = true;
        } else if (value === 'false') {
          convertedRow[key] = false;
        } else if (typeof value === 'string' && !isNaN(Number(value))) {
          convertedRow[key] = Number(value);
        } else if (typeof value === 'string' && !isNaN(Date.parse(value))) {
          // Check if it's an ISO date string
          if (value.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)) {
            convertedRow[key] = new Date(value);
          } else {
            convertedRow[key] = value;
          }
        } else {
          // Try to parse JSON strings
          if (typeof value === 'string' && (value.startsWith('[') || value.startsWith('{'))) {
            try {
              convertedRow[key] = JSON.parse(value);
            } catch {
              convertedRow[key] = value;
            }
          } else {
            convertedRow[key] = value;
          }
        }
      }
      return convertedRow;
    });
  } catch (error) {
    console.error(`Error reading CSV file ${filename}:`, error);
    return [];
  } finally {
    // Release lock after reading
    releaseLock(filename);
  }
}

/**
 * Write data to a CSV file
 * @param filename The name of the CSV file
 * @param data Array of objects to write to the CSV
 */
async function writeCSV(filename, data) {
  // Acquire lock before writing
  await acquireLock(filename);
  
  try {
    // Convert data to CSV format
    const csvData = stringify(data, {
      header: true,
      quoted: true,
      quoted_empty: true
    });
    
    const filePath = getCSVFilePath(filename);
    
    // Write to file
    fs.writeFileSync(filePath, csvData, 'utf8');
  } catch (error) {
    console.error(`Error writing CSV file ${filename}:`, error);
    throw error;
  } finally {
    // Release lock after writing
    releaseLock(filename);
  }
}

/**
 * Initialize a CSV file with headers if it doesn't exist
 * @param filename The name of the CSV file
 * @param headers Array of header names
 */
function initializeCSV(filename, headers) {
  const filePath = getCSVFilePath(filename);
  
  // If file doesn't exist, create it with headers
  if (!fs.existsSync(filePath)) {
    const headerRow = headers.join(',') + '\n';
    fs.writeFileSync(filePath, headerRow, 'utf8');
  }
}

/**
 * Generate a unique ID
 * @returns A unique UUID
 */
function generateId() {
  return uuidv4();
}

/**
 * Clean up all CSV files (delete them)
 */
function cleanupCSVFiles() {
  if (fs.existsSync(CSV_DATA_DIR)) {
    const files = fs.readdirSync(CSV_DATA_DIR);
    files.forEach(file => {
      if (file.endsWith('.csv')) {
        const filePath = getCSVFilePath(file);
        fs.unlinkSync(filePath);
      }
    });
  }
}

module.exports = {
  ensureDataDirectory,
  getCSVFilePath,
  readCSV,
  writeCSV,
  initializeCSV,
  generateId,
  cleanupCSVFiles
};