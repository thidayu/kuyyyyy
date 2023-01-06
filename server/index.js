const express = require("express");
const app = express();
const mysql = require("mysql");
const cors = require("cors");
const axios = require("axios");
const fs = require("fs"),
  http = require("http"),
  https = require("https");
const Stream = require("stream").Transform;

app.use("/FR_image", express.static("FR_image"));
app.use("/Intrusion_image", express.static("Intrusion_image"));
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

app.get("/frimage", (req, res) => {
  const imagelist = fs.readdirSync("./FR_image", (err, filename) => filename);
  console.log(imagelist);
  res.send(imagelist);
});

app.get("/intrusionimage", (req, res) => {
  const imagelist = fs.readdirSync(
    "./Intrusion_image",
    (err, filename) => filename
  );
  console.log(imagelist);
  res.send(imagelist);
});

// Web app เรียก API Event EMS จาก Database
app.get("/ems_event", (req, res) => {
  db.query("SELECT * FROM fr", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

//Push FR_EMS in Database
app.post("/fr1_event", async (req, res) => {
  console.log(req.body);
  console.log(req.headers.authorization);
  if (req.headers.authorization != "Basic") {
    res.send("err");
    return;
  }
  const data = req.body;
  let profile;
  let login;
  let camera;
  const agent = new https.Agent({
    rejectUnauthorized: false,
  });
  try {
    login = await axios.post(
      "https://192.168.1.252/api/authservice/signin",
      {
        username: "admin",
        password: "123456@A",
      },
      { httpsAgent: agent }
    );
    console.log(login.data);
  } catch (error) {
    console.log(error);
  }

  try {
    profile = await axios.get(
      "https://192.168.1.252/api/customerservice/getCustomerByCustomerId?customerId=" +
        data.ProfileId,
      {
        httpsAgent: agent,
        headers: { Authorization: "Bearer " + login.data.object.token },
      }
    );
    console.log(profile.data);
  } catch (error) {
    console.log(error);
  }
  try {
    camera = await axios.post(
      "https://192.168.1.252/api/cameraservice/getFilterCamera",
      {
        cameraStatus: 0,
        listRegion: [],
        pageIndex: 0,
        pageSize: 100,
      },
      {
        httpsAgent: agent,
        headers: { Authorization: "Bearer " + login.data.object.token },
      }
    );
    console.log(camera.data);
  } catch (error) {
    console.log(error);
  }
  axios
    .post("https://mewprodev.net:7701/Notify/api/Notification/line/send", {
      companyid: "GUARDFORCE",
      password: "Bkav@2020",
      msg: `
Event: ${data.Identity} 
Profile: ${profile.data.object.fullName} 
Camera: ${
        camera.data.object.listCamera.find((c) => c.cameraId == data.CameraId)
          .cameraName
      }
Position: ${
        camera.data.object.listCamera.find((c) => c.cameraId == data.CameraId)
          .regionName
      } `,
    })
    .then((res) => {
      console.log(res.data);
    })
    .catch((err) => console.log(err));
  try {
    console.log("INSERT");
    try {
      const filePath = data?.ListFile[0]?.FilePath
        ? `${data.ListFile[0].FilePath}`
        : "";
      const fileName = filePath.split("/").pop() + ".jpg";
      db.query(`INSERT INTO fr (Identity, ProfileId, CameraId, Code,	CameraCreatedAt, ListDuplicateProfile, image)
     VALUES  ('${data.Identity}', '${data.ProfileId}', '${data.CameraId}', '${data.Code}','${data.CameraCreatedAt}',	
     '${data.ListDuplicateProfile}', '${fileName}')`);
      downloadImageFromURL(filePath, `./Fr_image/${fileName}`, function () {
        console.log("done");
      });
    } catch (err) {
      console.log(err);
    }
    //เป็นการใช้ function เรียก pathในJSON.Data downloadลงในfolder fr_image,intrusion_image
  } catch (err) {
    console.log(err);
  }
  res.send(req.body);
});

// Push FR_EMS in Database
// app.post("/fr_event", async (req, res) => {
//   console.log(req.body);
//   const data = req.body;
//   //  axios
//   //     .post("https://mewprodev.net:7701/Notify/api/Notification/line/send", {
//   //       companyid: "GUARDFORCE",
//   //       password: "Bkav@2020",

//   //       msg: "Event: "  + data.EventName,
//   //     })
//   //     .then((res) => {
//   //       console.log(res.data);
//   //       setData(res.data);
//   //     })
//   //     .catch((err) => console.log(err));
//   // try {
//   //   const profile = await axios.get(
//   //     "https://192.168.1.252/api/customerservice/getCustomerByCustomerId?customerId=" +
//   //       data.ProfileId
//   //   );
//   //   console.log(profile.data);
//   // } catch (error) {
//   //   console.log(error);
//   // }
//   // axios
//   //   .post(
//   //     "https://guardforce.demozone.vn/api/customerservice/getCustomerByCustomerId?customerId=" +
//   //       data.ProfileId
//   //   )
//   //   .then((res) => {
//   //     console.log(res.data);
//   //   })
//   //   .catch((err) => console.log(err));
//   axios
//     .post("https://mewprodev.net:7701/Notify/api/Notification/line/send", {
//       companyid: "GUARDFORCE",
//       password: "Bkav@2020",
//       msg: "Event: " + data.Identity,
//     })
//     .then((res) => {
//       console.log(res.data);
//       setData(res.data);
//     })
//     .catch((err) => console.log(err));
//   try {
//     console.log("INSERT");
//     try {
//       const filePath = data?.ListFile[0]?.FilePath
//         ? `${data.ListFile[0].FilePath}`
//         : "";
//       const fileName = filePath.split("/").pop() + ".jpg";
//       db.query(`INSERT INTO fr (Identity, ProfileId, CameraId, Code,	CameraCreatedAt, ListDuplicateProfile, image)
//      VALUES  ('${data.Identity}', '${data.ProfileId}', '${data.CameraId}', '${data.Code}',	'${data.CameraCreatedAt}',	
//      '${data.ListDuplicateProfile}', '${fileName}')`);
//       downloadImageFromURL(filePath, `./Fr_image/${fileName}`, function () {
//         console.log("done");
//       });
//     } catch (err) {
//       console.log(err);
//     }
//     //เป็นการใช้ function เรียก pathในJSON.Data downloadลงในfolder fr_image,intrusion_image
//   } catch (err) {
//     console.log(err);
//   }/
//   res.send(req.body);
// });

//Push Intrusion_EMS in Database
app.post("/intrusion_event", async (req, res) => {
  console.log(req.body);
  const data = req.body;
 
  try {
    const profile = await axios.get(
      "https://192.168.1.252/api/customerservice/getCustomerByCustomerId?customerId=" +
        data.ProfileId
    );
    console.log(profile.data);
  } catch (error) {
    console.log(error);
  }

  axios
    .post("https://mewprodev.net:7701/Notify/api/Notification/line/send", {
      companyid: "GUARDFORCE",
      password: "Bkav@2020",
      msg: `
Event: ${data.EventName} 
Camera: ${data.CameraName}
Position: ${"Thailand"} `,
         
    })
    .then((res) => {
      console.log(res.data);
    })
    .catch((err) => console.log(err));
  try {
    console.log("INSERT");
    try {
      const filePath = data?.ListFile[0]?.FilePath
        ? `${data.ListFile[0].FilePath}`
        : "";
      const fileName = filePath.split("/").pop() + ".jpg";
      db.query(`INSERT INTO fr (Identity, ProfileId, CameraId, Code,	CameraCreatedAt, ListDuplicateProfile, image)
     VALUES  ('${data.Identity}', '${data.ProfileId}', '${data.CameraId}', '${data.Code}',	'${data.CameraCreatedAt}',	
     '${data.ListDuplicateProfile}', '${fileName}')`);
      downloadImageFromURL(filePath, `./Fr_image/${fileName}`, function () {
        console.log("done");
      });
    } catch (err) {
      console.log(err);
    }
    //เป็นการใช้ function เรียก pathในJSON.Data downloadลงในfolder fr_image,intrusion_image
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
