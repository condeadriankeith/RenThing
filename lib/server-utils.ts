import fs from 'fs';
import path from 'path';

// Track server startup time
const serverStartTime = new Date().toISOString();
const restartFile = path.join(process.cwd(), '.server-restart');

// Save server startup time to file on module load
try {
  fs.writeFileSync(restartFile, serverStartTime + '\n', 'utf8');
  console.log(`Server startup time saved: ${serverStartTime}`);
} catch (error) {
  console.error('Error saving server startup time:', error);
}

/**
 * Check if the server has been restarted since last check
 * @returns Object containing restart status and timestamps
 */
export function checkServerRestart() {
  try {
    // Read the last startup time from file
    if (fs.existsSync(restartFile)) {
      const fileContent = fs.readFileSync(restartFile, 'utf8').trim();
      const lastStartupTime = fileContent.split('\n')[0]; // Get first line only
      const restarted = lastStartupTime !== serverStartTime;
      
      // If server was restarted, update the file with current time
      if (restarted) {
        try {
          fs.writeFileSync(restartFile, serverStartTime + '\n', 'utf8');
          console.log(`Server restart detected and timestamp updated: ${serverStartTime}`);
        } catch (writeError) {
          console.error('Error updating server restart timestamp:', writeError);
        }
      }
      
      return { 
        restarted,
        currentStartupTime: serverStartTime,
        lastStartupTime: lastStartupTime
      };
    } else {
      // If file doesn't exist, this is the first run
      try {
        fs.writeFileSync(restartFile, serverStartTime + '\n', 'utf8');
        console.log(`Server restart file created with timestamp: ${serverStartTime}`);
      } catch (writeError) {
        console.error('Error creating server restart file:', writeError);
      }
      
      return { 
        restarted: false, // First run is not considered a restart
        currentStartupTime: serverStartTime,
        lastStartupTime: null
      };
    }
  } catch (error) {
    console.error('Error reading server status:', error);
    return { 
      error: 'Failed to check server status',
      restarted: false,
      currentStartupTime: serverStartTime,
      lastStartupTime: null
    };
  }
}