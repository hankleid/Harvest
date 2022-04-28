const axios = require('axios');
const fs = require("fs");
const YEAR = 2016;
const PERPAGE = 200;

const idURL = "https://api.elsevier.com/content/search/scopus?"
            +"query=ISSN(0304-8853 OR 0038-1101)"
            +"&apiKey=e622388ba261e700b860d2572455d9d4"
            +"&insttoken=288208f8f5ebac7eb3cd123901463335"
            +"&view=STANDARD"
            +"&sort=pubyear"
            +"&date="+YEAR
            +"&count="+PERPAGE
            +"&start=";


const delay = (ms = 0) => new Promise((r) => setTimeout(r, ms));

const getAbstracts = async function (eids) {
    let results = [];
    for (let i = 0; i < eids.length; i++) {
        await delay();
        const res = await axios
            .get(
                `https://api.elsevier.com/content/abstract/eid/${eids[i]}?apiKey=e622388ba261e700b860d2572455d9d4&insttoken=288208f8f5ebac7eb3cd123901463335`
            ).then(
                console.log("called " + (i+1) + "!")
            ).catch(
                (error) => console.error(error.response.status));
        results.push(res.data['abstracts-retrieval-response'].coredata['dc:description'])
    }
    abstracts = results.filter((element) => { return element !== undefined; });
    return abstracts;
};

const processAbstracts = async function (texts) {
    for (let text of texts) {
        let fn = "Elsevier/" + YEAR;
        fs.appendFileSync(fn, text, "utf8");
    }
    console.log("Abstracts from " + YEAR + " printed successfully.");
    return;
}


async function main() {
    const res = await axios
        .get(idURL+0)
        .catch((error) => console.error(error));
    const totalNumArticles = res.data['search-results']['opensearch:totalResults'];
    console.log(totalNumArticles);

    let page = 0;
    while (page*PERPAGE < totalNumArticles) { // STOP @ FINAL ARTICLE.
        let thisURL = idURL + page*PERPAGE;
        console.log(thisURL);
        const res = await axios
            .get(thisURL)
            .catch((error) => console.error(error));

        console.log("PAGE "+page);
        const articles = res.data['search-results'].entry;
        const eids = articles.map((article) => article.eid);
        console.log(eids);
        const abstracts = await getAbstracts(eids);
        await processAbstracts(abstracts);

        page++;
    }
}

main();
