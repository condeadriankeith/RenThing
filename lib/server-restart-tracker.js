const fs = require('fs');
const path = require('path');

class ServerRestartTracker {
  constructor() {
    this.restartFile = path.join(process.cwd(), '.server-restart');
    this.currentStartupTime = new Date().toISOString();
  }

  /**
   * Get the last startup time from the restart file
   * @returns {string|null} The last startup time or null if file doesn't exist
   */
  getLastStartupTime() {
    try {
      if (fs.existsSync(this.restartFile)) {
        return fs.readFileSync(this.restartFile, 'utf8').trim();
      }
      return null;
    } catch (error) {
      console.error('Error reading restart file:', error);
      return null;
    }
  }

  /**
   * Save the current startup time to the restart file
   */
  saveCurrentStartupTime() {
    try {
      fs.writeFileSync(this.restartFile, this.currentStartupTime, 'utf8');
    } catch (error) {
      console.error('Error writing restart file:', error);
    }
  }

  /**
   * Check if the server has been restarted since last check
   * @returns {boolean} True if server was restarted, false otherwise
   */
  wasServerRestarted() {
    const lastStartupTime = this.getLastStartupTime();
    // Save current startup time for next check
    this.saveCurrentStartupTime();
    
    // If there was no previous startup time, this is the first run
    if (!lastStartupTime) {
      return false;
    }
    
    // Compare timestamps
    return lastStartupTime !== this.currentStartupTime;
  }
}

module.exports = { ServerRestartTracker };