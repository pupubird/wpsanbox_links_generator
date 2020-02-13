const puppeteer = require("puppeteer");
const fs = require("fs");

async function start(i, x) {
  console.log(`Thread ${i} start`);
  // initialize
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  console.log("Go to wpsandbox.");
  await page.goto("https://wpsandbox.net/").catch(err => console.log(err));

  //   click button
  console.log("Wait for button");
  const btn = await page.waitForSelector(".row #qs_app_wp5_trigger_set_up_btn");

  let links = [];
  //   loop for x amount of time
  for (i = 0; i < x; i++) {
    console.log(
      `---------------Thread ${i}: Link generating: ${i +
        1}/${x}---------------`
    );
    console.log(`Click generate button`);
    await new Promise(resolve => setTimeout(resolve, 500));
    await page.click(".row #qs_app_wp5_trigger_set_up_btn");

    //   wait for link
    console.log("Waiting link to be generated.");
    await page.waitForSelector(
      ".row > .col-xs-12 > #results > #app-notice > a"
    );
    const result = await page.$eval(
      ".row > .col-xs-12 > #results > #app-notice > a",
      element => element.getAttribute("href")
    );
    links.push(result);
    console.log("Link generated.");
  }
  await browser.close();
  await saveLinks(links, i);
}

async function saveLinks(links, i) {
  fs.writeFile(`links_${i}.txt`, links, function(err) {
    if (err) {
      return console.log(err);
    }
  });

  fs.readFile(`links_${i}.txt`, "utf8", (err, data) => {
    if (err) throw err;
    data = data.replace(",", "\n");
    console.log(data);
    fs.writeFile(`links_${i}.txt`, data, function(err) {
      if (err) {
        return console.log(err);
      }
      console.log("The file was saved!");
    });
  });
}

module.exports = start;
