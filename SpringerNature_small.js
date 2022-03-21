//var ENDLOOP = 10000/100 // no. total articles divided by no. articles/page
var YEAR = 1900;
var PAGELENGTH = 100;
var START = 1;

var FNAMES = {};
var numAbstracts = {};
var ids = {};

var fs = require("fs");
var https = require("https");


function collect_abstracts(json) {
    var articles = json.records;
    console.log(json.result)
    //console.log(json.records)
    if (articles !== undefined) {
        for (var i = 0; i < articles.length; i++) {
            var article = articles[i];
            if (article.hasOwnProperty("abstract")) {
                var abstract = article.abstract;
                var fn = "SpringerNature/" + YEAR;
                fs.appendFileSync(fn, abstract, "utf8");
            }
        }
    }
}

for (var i = 0; i < 20; i++) {
    var url = "https://api.springernature.com/meta/v2/json?q="
            +"(pub:%22Nature%20Communications%22%20OR%20"
            +"pub:Nature%20OR%20"
            +"ub:%22Nature%20Materials%22%20OR%20"
            +"pub:%22Nature%20Nanotechnology%22%20OR%20"
            +"pub:%22Nature%20Photonics%22%20OR%20"
            +"pub:%22Nature%20Physicsy%22%20OR%20"
            +"pub:%22Nature%20Reviews%20Materials%22%20OR%20"
            +"pub:%22Nature%20Reviews%20Physics%22%20OR%20"
            +"pub:%22Communications%20Engineering%22%20OR%20"
            +"pub:%22Communications%20Physics%22%20OR%20"
            +"pub:%22npj%20Computational%20Materials%22%20OR%20"
            +"pub:%22npj%20Quantum%20Materials%22%20OR%20"
            +"pub:%22Scientific%20Reports%22%20OR%20"
            +"pub:%22Nature%20Energy%22)"
            +" year:"+YEAR
            +"&p="+PAGELENGTH+"&s="+(START+PAGELENGTH*i)
            +"&api_key=86e121ae7080eb66373361f62f04b07b";
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
            collect_abstracts(body);
        });
    });
}
