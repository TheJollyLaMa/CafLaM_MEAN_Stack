const request = require('request');

// const request = require("request");
// const { createWriteStream } = require("fs");
// const stream = require("stream");
// const { promisify } = require("util");
// const pipeline = promisify(stream.pipeline);

let smarthome = {};

smarthome.get_power_data = (req, res) => {

};

//   const fileName = "powerData.json";
//   const httpheaders = {
//     ContentType: 'application/json',
//     ContentLength: undefined,
//     TransferEncoding: 'disabled'
//   }
//
//   const downloadStream = got.stream(url,{headers: httpheaders});
//
//   const fileWriterStream = createWriteStream(fileName);
//
//   downloadStream.on("downloadProgress", ({ transferred, total, percent }) => {
//     const percentage = Math.round(percent * 100);
//     console.error(`progress: ${transferred}/${total} (${percentage}%)`);
//   });
//   console.log(downloadStream);
//   pipeline(downloadStream, fileWriterStream)
//     .then((res) => {
//       console.log(`File downloaded to ${fileName}`)
//       // console.log(res);
//     })
//     .catch((error) => console.error(`Something went wrong. ${error.message}`));
//
// };


module.exports = smarthome;
