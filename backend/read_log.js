const fs = require('fs');
const content = fs.readFileSync('jest_out.txt', 'utf16le');
console.log(content);
