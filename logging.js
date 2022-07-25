const RESET = "\u001B[0m";
const BLUE = "\u001B[34m";
const YELLOW = "\u001b[33m";
const RED = "\u001B[31m";

function info(message) {
  console.info(`${BLUE} ${getTime()} [INFO] ${message} ${RESET}`);
}


function warn(message) {
  console.warn(`${YELLOW} ${getTime()} [WARN] ${message} ${RESET}`);
}


function error(message) {
  console.error(`${RED} ${getTime()} [ERRR] ${message} ${RESET}`);
}


function getTime() {
  const now = new Date();
  const date = `[${now.getDate()}.${now.getMonth()}.${now.getFullYear()}] [${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}]`;
  return date;
}


module.exports.info = info;
module.exports.warn = warn;
module.exports.error = error;