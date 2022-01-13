// curl 'Accept: application/vnd.tesseract.article+json' "http://harvest.aps.org/v2/journals/articles?from=2015-01-01&until=2015-02-01&date=published" >> articles.txt
const fs = require("fs");

const STARTYEAR = 2000;
const ENDYEAR = 2003;
const INTERVAL = 2;

const FNAMES = {};
for (let y = STARTYEAR; y <= ENDYEAR; y += INTERVAL) {
    for (let i = 0; i < INTERVAL; i++) {
        FNAMES[y+i] = y + "_" + (y+INTERVAL-1) + ".txt";
    }
}

function getFileName(year) {
    return FNAMES[year];
}

function collect_abstracts(text) {
    let articles = JSON.parse(text).data;
    console.log(articles.length);
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

fs.readFile("articles.txt", "utf8" , (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  collect_abstracts(data);
});
