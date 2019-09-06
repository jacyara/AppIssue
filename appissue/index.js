// server.js
// where your node app starts

// init project
const express = require("express");
//const mysql = require("mysql");
const app = express();

// const con = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "1234"
// });

// const connection = () => {
//   con.connect(function(err) {
//     if (err) throw err;
//     console.log("Connected!");
//   });
// };

// we've started you off with Express,
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function(request, response) {
  response.sendFile(__dirname + "/views/index.html");
});

app.post("/issue", function(request, response, next) {
  request.on("data", function(data) {
    console.log("Dados da Issue: ");
    console.log("Ação: " + JSON.parse("" + data).action);
    console.log(
      "Nome: " +
        JSON.parse("" + data).issue.title +
        " Número: " +
        JSON.parse("" + data).issue.number
    );
    console.log("Label: " + JSON.parse("" + data).issue.labels);
  });
  response.send("OK");
});

// listen for requests :)
const listener = app.listen(process.env.PORT, function() {
  //connection();
  console.log(
    "Your app is listening on port http://localhost:" + listener.address().port
  );
});
