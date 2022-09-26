const express = require("express");
const app = express();
const mysql = require("mysql");
const cors = require("cors");
const axios = require("axios");

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  user: "root",
  host: "localhost",
  database: "event",
});

// Web app เรียก API Event EMS จาก Database
app.get("/ems_event", (req, res) => {
  db.query("SELECT * FROM apiems", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
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

app.listen("3300", () => {
  console.log("Server is running on port 3300");
});
