const axios = require('axios');
const YEAR = 2022;

const idURL = "https://api.elsevier.com/content/search/scopus?"
            +"query=LANGUAGE%28english%29"
            +"&apiKey=e622388ba261e700b860d2572455d9d4"
            +"&insttoken=288208f8f5ebac7eb3cd123901463335"
            +"&view=STANDARD"
            +"&sort=pubyear"
            +"&date="+YEAR
            +"&count=10"
            +"&start="+0;


const delay = (ms = 1000) => new Promise((r) => setTimeout(r, ms));
const getInSeries = async (promises) => {
  let results = [];
  let i = 1;
  for (let promise of promises) {
    results.push(await delay().then(() => promise));
    console.log("pushed " + i + "!")
    i++;
  }
  return results;
};

async function getArticleIds(url) {
    axios
        .get(url)
        .then(res => {
            console.log("PAGE 1")
            const articles = res.data['search-results'].entry;
            const eids = articles.map((article) => article.eid);
            console.log(eids);
            getAbstracts(eids);
        })
        .catch((error) => console.error(error.response.status))
}

async function getAbstracts(eids) {
    const promises = eids.map((eid) =>
        axios
            .get(`https://api.elsevier.com/content/abstract/eid/${eid}?apiKey=e622388ba261e700b860d2572455d9d4&insttoken=288208f8f5ebac7eb3cd123901463335`)
            .then((res) => res.data['abstracts-retrieval-response'].coredata['dc:description'])
            .catch((error) => console.error(error.response.status))
    );
    const results = await getInSeries(promises);
    const abstracts = results.filter(el => {
        return el !== undefined;
    });
    console.log(abstracts)
}

getArticleIds(idURL);
