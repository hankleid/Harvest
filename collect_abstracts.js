const STARTYEAR = 2000;
const ENDYEAR = 2009;
const INTERVAL = 5;
const NUMPAGES = 10;

const FNAMES = {};

const fs = require("fs");
const https = require("https");

for (let y = STARTYEAR; y <= ENDYEAR; y += INTERVAL) {
    for (let i = 0; i < INTERVAL; i++) {
        FNAMES[y+i] = y + "_" + (y+INTERVAL-1) + ".txt";
    }
}

function getFileName(year) {
    return FNAMES[year];
}

function collect_abstracts(json) {
    let articles = json.data;
    for (let i = 0; i < articles.length; i++) {
        let article = articles[i];
        let year = article.date.substring(0, 4);
        if (article.hasOwnProperty("abstract") && getFileName(year)) {
            let abstract = article.abstract.value;
            let fn = getFileName(year);
            fs.appendFileSync(fn, abstract, "utf8");
        }
    }
}

for (let i = 1; i <= NUMPAGE; i++) {
    let url = "https://harvest.aps.org/v2/journals/articles?from="
            +STARTYEAR+"-01-01&until="+ENDYEAR+"-12-31&date=published&page="+i;
    https.get(url, res => {
        res.setEncoding("utf8")
        let body = "";
        res.on("data", data => {
            if (typeof body !== 'undefined') {
                body += data;
            }
        });
        res.on("end", () => {
            body = JSON.parse(body);
            collect_abstracts(body);
        });
    });
}
