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
    var templateHtml = fs.readFileSync(
      path.join(process.cwd(), "template.html"),
      "utf8"
    );
    var template = handlebars.compile(templateHtml);
    var html = template(data);

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
      path: `${data.product}.pdf`,
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
    res.send("done");
  } catch (error) {
    console.log(error);
  }
});
// async function createPDF(data) {
//   var templateHtml = fs.readFileSync(
//     path.join(process.cwd(), "template.html"),
//     "utf8"
//   );
//   var template = handlebars.compile(templateHtml);
//   var html = template(data);

//   var milis = new Date().getTime();

//   var options = {
//     width: "400px",
//     height: "400px",
//     headerTemplate: "<p></p>",
//     footerTemplate: "<p></p>",
//     displayHeaderFooter: false,
//     margin: {
//       top: "10px",
//       bottom: "30px",
//     },
//     printBackground: true,
//     path: `${data.product}.pdf`, // Use dynamic path for the generated PDF
//   };

//   const browser = await puppeteer.launch({
//     args: ["--no-sandbox"],
//     headless: true,
//   });

//   var page = await browser.newPage();

//   await page.goto(`data:text/html;charset=UTF-8,${html}`, {
//     waitUntil: "networkidle0",
//   });

//   await page.pdf(options);
//   await browser.close();
// }

// const data1 = {
//   title: "TRUKLIP CERTIFICATE",
//   product: "iPhone 15 Pro Max",
//   date: "14/06/2024",
//   name: "Rodolfo Luis",
//   truklipid: "TRU28323213",
// };

// const data2 = {
//   title: "TRUKLIP CERTIFICATE",
//   product: "Samsung Galaxy S23 Ultra",
//   date: "14/06/2024",
//   name: "Jane Doe",
//   truklipid: "TRU98765432",
// };

// async function generatePDFs() {
//   await createPDF(data1);
//   await createPDF(data2);
// }

// generatePDFs();
