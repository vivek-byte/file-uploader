const express = require("express");
const fileUpload = require("express-fileupload");
const app = express();
const fs = require("fs");

app.use(fileUpload());

// reading the file and passing the data as a reposne to the FE. PORT is 5000 and endpint is Upload
app.post("/upload", (req, res) => {
  if (req.files === null) {
    return res.status(400).json({ msg: "No file uploaded" });
  }

  const file = req.files.file;

  file.mv(`${__dirname}/client/public/uploads/${file.name}`, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send(err);
    }

    fs.readFile(`${__dirname}/client/public/uploads/${file.name}`, function (
      err,
      data
    ) {
      if (err) {
        console.log("--------------" + err);
        return data;
      }
      res.writeHead(200, { "Content-Type": "text/html" });
      res.write(data);
      console.log("++++++++++++++++" + data.toString().split("/n"));
      return res.end();
    });
  });
});

app.listen(5000, () => console.log("Server Started..."));
