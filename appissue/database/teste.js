let mysql = require("mysql");

const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "1234",
  database: "mydb"
});

/*
export const insertTableIssue = (obj) => ({
    con.query("INSERT INTO issue (id, nome) VALUES (1, 'issueUm')", function (err, result) {
      if (err) throw err;
      console.log("1 record inserted");
    });
})*/

const insertTableIssue = obj =>
  con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
    var sql = "INSERT INTO issue (id, nome) VALUES (1, 'issueUm')";
    con.query(sql, function(err, result) {
      if (err) throw err;
      console.log("1 record inserted");
    });
  });

export default insertTableIssue();
