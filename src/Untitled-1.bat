
db.query(
    `SELECT * FROM apiems WHERE eventid = '${req.boby.notificationSourceEventId}' `,
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        if (result.length === 0) {
          db.query(`INSERT INTO apiems (eventid, applicationname, cameraname, eventname,	levelpriority,	monitorid, regionname,	startedat,	zonename)
           VALUES  ('${req.boby.notificationSourceEventId}', '${req.boby.notificationHeader}', '${req.boby.notificationSourceType}', '${req.boby.EventName}',	'${req.boby.notificationPriority}',	
           '${req.boby.notificationProcessId}',	'${req.boby.notificationSourceName}', '${req.boby.closedTime}',	'${req.boby.notificationZoneName}')`);
        }
        console.log(result);
      }
    }

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
