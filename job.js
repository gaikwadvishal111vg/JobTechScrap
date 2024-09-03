// const axios = require('axios');
// const cheerio = require('cheerio');
import fs from "fs";
import xl from "excel4node";
import axios from "axios";
import * as cheerio from "cheerio";

const filePath = "job.txt";
const excelSheetFilePath = "job.xlsx";

const url =
  "https://www.timesjobs.com/candidate/job-search.html?searchType=Home_Search&from=submit&asKey=OFF&txtKeywords=&cboPresFuncArea=35";


const wb = new xl.Workbook();
const ws = wb.addWorksheet("Nokari Data");

const writeExcelData = (arr, row, col) => {
  arr.forEach((item) => {
    ws.cell(row, col++).string(item || "N/A");
  });
  wb.write(excelSheetFilePath);
};

axios
  .get(url)
  .then((response) => {
    const html = response.data;
    console.log(html);
    
    // const $ = cheerio.load(html);

    const jobPostings = [];
    // writeFile(filePath,html);
    const data = fs.readFileSync(filePath, "utf8");

    const $ = cheerio.load(data);
    $(".new-joblist").each((index, element) => {
      const jobTitle = $(element).find(".h2").text().trim();
      const companyName = $(element).find(".joblist-comp-name").text().trim();
      const location = $(element)
        .find(".top-jd-dtl.clearfix-class")
        .text()
        .trim();
      const jobDescription = $(element)
        .find(".list-job-dtl.clearfix")
        .text()
        .trim();

      jobPostings.push({
        jobTitle,
        companyName,
        location,
        jobDescription,
      });
      
    });
    console.log(jobPostings);
    let row = 1;
    console.log(jobPostings);
    writeExcelData(
      ["jobTitle", "companyName", "location", "jobDescription"],
      1,
      1
    );
    jobPostings.forEach((record) =>
      writeExcelData(
        [
          record.jobTitle,
          record.companyName,
          record.location,
          record.jobDescription,
        ],
        ++row,
        1
      )
    );
    
  })
  .catch((error) => {
    console.error("Error fetching data:", error);
  });

// Function to write data to a file
function writeFile(filePath, data) {
  fs.writeFile(filePath, data, (err) => {
    if (err) {
      console.error("Error writing to file", err);
    } else {
      console.log("File written successfully");
    }
  });
}

function readFile(filePath) {
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading file", err);
    } else {
      console.log("File content:", data);
    }
  });
}
