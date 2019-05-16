const express = require('express');
const puppeteer = require('puppeteer');
const lighthouse = require('lighthouse');
const app = express();

app.get('/', async (req, res) => {
  const url = req.query.url || 'https://artlogic.net';
  
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });

  let lighthouseFlags = {}
  lighthouseFlags.port = (new URL(browser.wsEndpoint())).port;
  lighthouseFlags.onlyCategories = ['performance']
  console.log(`Browser started for ${url}`);

  const lhr = await lighthouse(url, lighthouseFlags);
  await browser.close();
  let perf_score = lhr.lhr.categories.performance.score;
  console.log(perf_score)
  res.send(`Perf score = ${perf_score}`);
});



// Listen to the App Engine-specified port, or 8080 otherwise
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});