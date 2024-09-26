const puppeteer = require("puppeteer");
const schedule = require("node-schedule");
require("dotenv").config();

const { MailerSend, EmailParams, Sender, Recipient } = require("mailersend");

const getTitleandPrice = async (url) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 });

  return page.evaluate(() => {
    const title = document.querySelector(".VU-ZEz")?.textContent;
    const price = document.querySelector(".Nx9bqj")?.textContent;

    return {
      title,
      price,
    };
  });
};

const comparePrice = (currentPrice, thresholdPrice, url) => {
  const price = +currentPrice.slice(1).split(",").join("");

  if (price < thresholdPrice) {
    // email
    const mailerSend = new MailerSend({
      apiKey: process.env.API_KEY,
    });

    const sentFrom = new Sender(
      "MS_8aYMZM@trial-z3m5jgr2k90ldpyo.mlsender.net",
      "Price_Drop"
    );

    const recipients = [
      new Recipient("pradhansubham147@gmail.com", "Subham Pradhan"),
    ];
    // const cc = [new Recipient("your_cc@client.com", "Your Client CC")];
    // const bcc = [new Recipient("your_bcc@client.com", "Your Client BCC")];

    const emailParams = new EmailParams()
      .setFrom(sentFrom)
      .setTo(recipients)
      .setSubject("Price drop alert notification")
      .setHtml(
        `<strong>Yohuuu!!! The price has been dropeed. Please buy it, ASAP :):):) <br/> <a href=${url} target="_blank">Link to purchase...</a> </strong>`
      );

    mailerSend.email
      .send(emailParams)
      .then((response) => console.log(response))
      .catch((error) => console.log(error));

    console.log("Yoohuuuu, price has been dropped. Buy It :):):)");
  }
};

schedule.scheduleJob("*/1 * * * *", async () => {
  const url =
    "https://www.flipkart.com/apple-macbook-air-m2-8-gb-256-gb-ssd-mac-os-monterey-mlxw3hn-a/p/itmc2732c112aeb1?pid=COMGFB2GSG8EQXCQ&lid=LSTCOMGFB2GSG8EQXCQJWHH2F&marketplace=FLIPKART&store=6bo%2Fb5g&srno=b_1_7&otracker=browse&otracker1=hp_rich_navigation_PINNED_neo%2Fmerchandising_NA_NAV_EXPANDABLE_navigationCard_cc_8_L1_view-all&fm=organic&iid=916774ab-be80-4a29-b0c2-8efc7fa2b90a.COMGFB2GSG8EQXCQ.SEARCH&ppt=None&ppn=None&ssid=7tis96a93k0000001727332963434";
  const { title, price } = await getTitleandPrice(url);
  const thresholdPrice = 94000;
  comparePrice(price, thresholdPrice, url);
});
