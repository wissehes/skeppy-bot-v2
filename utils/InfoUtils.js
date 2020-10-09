const os = require("os");
const packageJSON = require("../package.json");

class InfoUtils {
  /**
   * Get platform/operating system the bot is running on
   */
  getPlatform() {
    const platforms = {
      aix: "IBM AIX",
      darwin: "macOS",
      freebsd: "FreeBSD",
      linux: "Linux",
      openbsd: "OpenBSD",
      sunos: "SunOS",
      win32: "Windows",
    };
    if (platforms[process.platform]) {
      return platforms[process.platform];
    } else return "Unknown";
  }

  /**
   * Get uptime of node process
   */
  getNodeUptime() {
    return this.secondsToDhms(process.uptime());
  }

  /**
   * Get OS uptime
   */
  getOSUptime() {
    return this.secondsToDhms(os.uptime());
  }

  /**
   * Get node module version
   * @param {String} m Module name
   */
  getModuleVersion(m) {
    const module = packageJSON.dependencies[m];
    return module.replace("^", "");
  }

  /**
   * Get free/total memory
   */
  getTotalMemory() {
    const totalMemory = this.formatBytes(os.totalmem());
    return totalMemory;
  }

  /**
   * Format bytes
   * @param {Number} bytes Number of bites to format
   * @param {Number} decimals Number of decimals, defaults to 2
   */
  formatBytes(bytes, decimals = 2) {
    // from https://stackoverflow.com/questions/15900485/correct-way-to-convert-size-in-bytes-to-kb-mb-gb-in-javascript
    if (bytes === 0) return "0 Bytes";

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  }

  /**
   * Convert seconds to DD:HH:MM:SS format
   * @param {Number} seconds The seconds to convert
   */
  secondsToDhms(seconds) {
    // Source: https://stackoverflow.com/questions/36098913/convert-seconds-to-days-hours-minutes-and-seconds
    // I modified it a bit though...

    var d = Math.floor(seconds / (3600 * 24));
    var h = Math.floor((seconds % (3600 * 24)) / 3600);
    var m = Math.floor((seconds % 3600) / 60);
    var s = Math.floor(seconds % 60);

    var dDisplay = d > 0 ? d + (d == 1 ? " day, " : " days, ") : "";
    var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";

    // Show the comma at the end only if the days aren't shown
    let mDisplay = "";
    if (dDisplay) {
      mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes") : "";
    } else {
      mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
    }

    // Only display seconds when days isn't shown
    let sDisplay = "";
    if (!dDisplay.length) {
      sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
    }
    return dDisplay + hDisplay + mDisplay + sDisplay;
  }
}

module.exports = InfoUtils;
