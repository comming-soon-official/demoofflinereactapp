// const pdf = require("html-pdf");
// const ejs = require("ejs");
// const fs = require("fs");
// const path = require("path");

// const moment = require("moment");

// const exportPdf = async (data, account) => {
//   const filePath = path.resolve(__dirname, "./report/report.ejs");
//   const htmltoString = fs.readFileSync(filePath).toString();

//   let options = {
//     format: "A4",
//   };
//   const ejsData = ejs.render(htmltoString, { data, moment, account });

//   return new Promise((resolve, reject) => {
//     pdf.create(ejsData, options).toBuffer((err, buffer) => {
//       if (err) {
//         reject(err);
//       } else {
//         console.log("This is a buffer:", Buffer.isBuffer(buffer));
//         console.log(buffer.toString("base64"));
//         resolve(buffer.toString("base64"));
//       }
//     });
//   });
// };

// Parse.Cloud.define("getMonthlyreport", async (req) => {
//   const auth = req.user;
//   const { id, first, next } = req.params;
//   const getAccount = async () => {
//     const Account = Parse.Object.extend("Account");
//     const query = new Parse.Query(Account);
//     query.equalTo("userId", auth);
//     query.equalTo("objectId", id);
//     return query.find().then((results) => {
//       console.log(
//         "hello im from results " +
//           id +
//           first +
//           next +
//           results[0] +
//           " end of concept"
//       );
//       return results[0];
//     });
//   };
//   const account = await getAccount();
//   const Transaction = Parse.Object.extend("Transaction");
//   const query1 = new Parse.Query(Transaction);
//   query1.equalTo("userId", auth);
//   query1.equalTo("accountId", account);
//   query1.greaterThan("date", first);
//   query1.lessThan("date", next);
//   query1.descending("date");
//   const res = await query1.find();
//   const buffer = await exportPdf(res, account);
//   console.log(buffer + "this is my buffer");
//   // return "hello";
//   return buffer;
// });

// const AWS = require("aws-sdk");
// const fs = require("fs");
// const path = require("path");

// const s3 = new AWS.S3({
//   region: "ap-south-1",
//   accessKeyId: "AKIAWCIX6VGLGMVO4XQ7",
//   secretAccessKey: "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",
// });

// const filepath = path.join(__dirname, "./temp.js");

// const params = {
//   Bucket: "saasaiensured",
//   Key: "id.gif",
//   Body: fs.createReadStream(filepath),
// };
// s3.upload(params, (err, data) => {
//   if (err) {
//     console.log(err);
//     return;
//   }
//   console.log(`uploaded sucessfully ${data.Location}`);
//   console.log(data);
// });
