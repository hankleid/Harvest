const fs = require('fs');

const STARTYEAR = 2000;
const ENDYEAR = 2009;
const INTERVAL = 5;
const FNAMES = {};

function getFileName(year) {
    return FNAMES[year];
}

for (let y = STARTYEAR; y <= ENDYEAR; y += INTERVAL) {
    for (let i = 0; i < INTERVAL; i++) {
        FNAMES[y+i] = y + "_" + (y+INTERVAL-1) + ".txt";
    }
}

console.log(getFileName("2005"));

fs.appendFileSync('testfile.txt', 'Hello!', 'utf8');
