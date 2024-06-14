const fs = require("fs");
const path = require("path");
const puppeteer = require("puppeteer");
const handlebars = require("handlebars");
const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors());
app.use(express.json());
app.listen(4554, () => {
  console.log("server listening on port 4554");
});
app.post("/pdf", async (req, res) => {
  try {
    const { data } = req.body;
    console.log(data.length);
    for (let i = 0; i < data.length; i++) {
      var templateHtml = fs.readFileSync(
        path.join(process.cwd(), "template.html"),
        "utf8"
      );
      var template = handlebars.compile(templateHtml);
      var html = template(data[i]);

      var options = {
        width: "400px",
        height: "400px",
        headerTemplate: "<p></p>",
        footerTemplate: "<p></p>",
        displayHeaderFooter: false,
        margin: {
          top: "10px",
          bottom: "30px",
        },
        printBackground: true,
        path: `${data[i].product}.pdf`,
      };

      const browser = await puppeteer.launch({
        args: ["--no-sandbox"],
        headless: true,
      });

      var page = await browser.newPage();

      await page.goto(`data:text/html;charset=UTF-8,${html}`, {
        waitUntil: "networkidle0",
      });

      await page.pdf(options);
      await browser.close();
    }

    res.send("done");
  } catch (error) {
    console.log(error);
  }
});
