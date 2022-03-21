var STARTYEAR = 1950;
var ENDYEAR = 2000;
var INTERVAL = 1;
var NUMPAGES = 2000;

var FNAMES = {};
var numAbstracts = {};
var ids = {};

var fs = require("fs");
var https = require("https");

for (var y = STARTYEAR; y <= ENDYEAR; y += INTERVAL) {
    for (var i = 0; i < INTERVAL; i++) {
        FNAMES[y+i] = y + "_" + (y+INTERVAL-1) + ".txt";
    }
}

function getFileName(year) {
    return FNAMES[year];
}

function collect_abstracts(json) {
    var articles = json.data;
    for (var i = 0; i < articles.length; i++) {
        var article = articles[i];
        var year = article.date.substring(0, 4);
        if (article.hasOwnProperty("abstract") && getFileName(year)) {
            var abstract = article.abstract.value;
            var id = article.journal.id;
            if (ids[id] == undefined) {
                ids[id] = 1;
            } else {
                ids[id] += 1;
            }
            if (numAbstracts[year] == undefined) {
                numAbstracts[year] = 1;
            } else {
                numAbstracts[year] += 1;
            }
            var fn = "APS/" + getFileName(year);
            fs.appendFileSync(fn, abstract, "utf8");
        }
    }
    console.log(numAbstracts);
    console.log(ids);
}

for (var i = 0; i <= 0; i++) {
    var url = "https://api.elsevier.com/content/search/scopus?"
            +"apiKey=e622388ba261e700b860d2572455d9d4"
            +"&field=description"
            +"&sort=pubyear"
            +"date=2020-2021"
            +"&count=1"
            +"&start="+i
    https.get(url, function (res) {
        res.setEncoding("utf8")
        var body = "";
        res.on("data", function (data) {
            if (typeof body !== 'undefined') {
                body += data;
            }
        });
        res.on("end", function () {
            body = JSON.parse(body);
            console.log(body)
            //collect_abstracts(body);
        });
    });
}
