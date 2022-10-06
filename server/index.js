const express = require("express");
const app = express();
const mysql = require("mysql");
const cors = require("cors");
const axios = require("axios");
const fs = require("fs"),
      http = require("http"),
      https = require("https");
const Stream = require("stream").Transform;



app.use(cors());
app.use(express.json());



// Download Image EMS Helper Function
var downloadImageFromURL = (url, filename, callback) => {
  var client = http;
  if (url.toString().indexOf("https") === 0) {
    client = https;
  }

  client
    .request(url, function (response) {
      var data = new Stream();

      response.on("data", function (chunk) {
        data.push(chunk);
      });

      response.on("end", function () {
        fs.writeFileSync(filename, data.read());
      });
    })
    .end();
};

const db = mysql.createConnection({
  user: "root",
  host: "localhost",
  database: "event",
});

// Web app เรียก API Event EMS จาก Database
app.get("/ems_event", (req, res) => {
  db.query("SELECT * FROM frems", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});


//Push FR_EMS in Database
app.post("/fr_event", (req, res) => {
  console.log(req.body);
  const data = req.body;
  try {
    const result = db.query(
      `SELECT * FROM frems WHERE eventid = '${data.notificationSourceEventId}'`
    );
    if (!result.values) {
      console.log("INSERT");
      try {
        db.query(`INSERT INTO frems (eventid, applicationname, cameraname, eventname,	levelpriority,	monitorid, regionname,	startedat,	zonename)
     VALUES  ('${data.notificationSourceEventId}', '${data.notificationHeader}', '${data.notificationSourceType}', '${data.EventName}',	'${data.notificationPriority}',	
     '${data.notificationProcessId}',	'${data.notificationSourceName}', '${data.closedTime}',	'${data.notificationZoneName}')`);
      } catch (err) {
        console.log(err);
      }
      //เป็นการใช้ function เรียก pathในJSON.Data downloadลงในfolder fr_image,intrusion_image
      data.ltEventFile.forEach((file) => {
        downloadImageFromURL(
          `http://192.168.1.254${file.FilePath}`,
          `./FR_image/${file.FileName}`,
          function () {
            console.log("done");
          }
        );
      });
    }
    console.log(result.values);
  } catch (err) {
    console.log(err);
  }
  res.send(req.body);
});

//Push Intrusion_EMS in Database
app.post("/intrusion_event", (req, res) => {
  console.log(req.body);
  const data = req.body;
  try {
    const result = db.query(
      `SELECT * FROM intrusionems WHERE eventid = '${data.notificationSourceEventId}'`
    );
    if (!result.values) {
      console.log("INSERT");
      try {
        db.query(`INSERT INTO intrusionems (eventid, applicationname, cameraname, eventname,	levelpriority,	monitorid, regionname,	startedat,	zonename)
     VALUES  ('${data.notificationSourceEventId}', '${data.notificationHeader}', '${data.notificationSourceType}', '${data.EventName}',	'${data.notificationPriority}',	
     '${data.notificationProcessId}',	'${data.notificationSourceName}', '${data.closedTime}',	'${data.notificationZoneName}')`);
      } catch (err) {
        console.log(err);
      }
      //เป็นการใช้ function เรียก pathในJSON.Data downloadลงในfolder intrusion_image
      data.ltEventFile.forEach((file) => {
        downloadImageFromURL(
          `http://192.168.1.254${file.FilePath}`,
          `./Intrusion_image/${file.FileName}`,
          function () {
            console.log("done");
          }
        );
      });
    }
    console.log(result.values);
  } catch (err) {
    console.log(err);
  }
  res.send(req.body);
});

//Push Event in Database
app.post("/push_event", (req, res) => {
  console.log(req.body);
  const data = req.body;
  try {
    const result = db.query(
      `SELECT * FROM apiems WHERE eventid = '${data.notificationSourceEventId}'`
    );
    if (!result.values) {
      console.log("INSERT");
      try {
        db.query(`INSERT INTO apiems (eventid, applicationname, cameraname, eventname,	levelpriority,	monitorid, regionname,	startedat,	zonename)
     VALUES  ('${data.notificationSourceEventId}', '${data.notificationHeader}', '${data.notificationSourceType}', '${data.EventName}',	'${data.notificationPriority}',	
     '${data.notificationProcessId}',	'${data.notificationSourceName}', '${data.closedTime}',	'${data.notificationZoneName}')`);
      } catch (err) {
        console.log(err);
      }
    }
    console.log(result.values);
  } catch (err) {
    console.log(err);
  }
  res.send(req.body);
});



app.listen("3300", () => {
  console.log("Server is running on port 3300");
});

// app.get("/apiems", (req, res) => {
//   const config = {
//     method: "get",
//     url: "http://192.168.1.254:8080/api/getEventRegister?pSubscriberId=1&pcount=1000&plastid=300",
//     headers: {
//       Authorization: "Bearer Basic",
//     },
//   };

//   axios(config)
//     .then((res) => {
//       //   console.log(res.data);
//       res.data.forEach((data) => {
//         db.query(
//           `SELECT * FROM apiems WHERE eventid = '${data.eventId}' `,
//           (err, result) => {
//             if (err) {
//               console.log(err);
//             } else {
//               if (result.length === 0) {
//                 db.query(`INSERT INTO apiems (eventid, applicationname, cameraname, eventname,	levelpriority,	monitorid,	objectrecognizeid,	regionname,	startedat,	zonename)
//                 VALUES  ('${data.eventId}', '${data.applicationName}', '${data.cameraName}', '${data.eventName}',	'${data.levelPriority}',	'${data.monitorId}',	'${data.objectRecognizeId}',	'${data.regionName}',	'${data.startedAt}',	'${data.zoneName}')`);
//               }
//               console.log(result);
//             }
//           }
//         );
//       });
//     })
//     .catch((err) => console.log(err));

//   db.query("SELECT * FROM apiems", (err, result) => {
//     if (err) {
//       console.log(err);
//     } else {
//       res.send(result);
//     }
//   });
// });
