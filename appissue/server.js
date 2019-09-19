// server.js
// where your node app starts

// init project
const express = require("express");
//const mysql = require("mysql");
const axios = require("axios");
const app = express();
//const ssl = require("sslmode");
const pg = require("pg");
const { Client } = require("pg");

var Base64 = {
  _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
  encode: function(e) {
    var t = "";
    var n, r, i, s, o, u, a;
    var f = 0;
    e = Base64._utf8_encode(e);
    while (f < e.length) {
      n = e.charCodeAt(f++);
      r = e.charCodeAt(f++);
      i = e.charCodeAt(f++);
      s = n >> 2;
      o = ((n & 3) << 4) | (r >> 4);
      u = ((r & 15) << 2) | (i >> 6);
      a = i & 63;
      if (isNaN(r)) {
        u = a = 64;
      } else if (isNaN(i)) {
        a = 64;
      }
      t =
        t +
        this._keyStr.charAt(s) +
        this._keyStr.charAt(o) +
        this._keyStr.charAt(u) +
        this._keyStr.charAt(a);
    }
    return t;
  },
  decode: function(e) {
    var t = "";
    var n, r, i;
    var s, o, u, a;
    var f = 0;
    e = e.replace(/[^A-Za-z0-9\+\/\=]/g, "");
    while (f < e.length) {
      s = this._keyStr.indexOf(e.charAt(f++));
      o = this._keyStr.indexOf(e.charAt(f++));
      u = this._keyStr.indexOf(e.charAt(f++));
      a = this._keyStr.indexOf(e.charAt(f++));
      n = (s << 2) | (o >> 4);
      r = ((o & 15) << 4) | (u >> 2);
      i = ((u & 3) << 6) | a;
      t = t + String.fromCharCode(n);
      if (u != 64) {
        t = t + String.fromCharCode(r);
      }
      if (a != 64) {
        t = t + String.fromCharCode(i);
      }
    }
    t = Base64._utf8_decode(t);
    return t;
  },
  _utf8_encode: function(e) {
    e = e.replace(/\r\n/g, "\n");
    var t = "";
    for (var n = 0; n < e.length; n++) {
      var r = e.charCodeAt(n);
      if (r < 128) {
        t += String.fromCharCode(r);
      } else if (r > 127 && r < 2048) {
        t += String.fromCharCode((r >> 6) | 192);
        t += String.fromCharCode((r & 63) | 128);
      } else {
        t += String.fromCharCode((r >> 12) | 224);
        t += String.fromCharCode(((r >> 6) & 63) | 128);
        t += String.fromCharCode((r & 63) | 128);
      }
    }
    return t;
  },
  _utf8_decode: function(e) {
    var t = "";
    var n = 0;
    var r = (c1 = c2 = 0);
    while (n < e.length) {
      r = e.charCodeAt(n);
      if (r < 128) {
        t += String.fromCharCode(r);
        n++;
      } else if (r > 191 && r < 224) {
        c2 = e.charCodeAt(n + 1);
        t += String.fromCharCode(((r & 31) << 6) | (c2 & 63));
        n += 2;
      } else {
        c2 = e.charCodeAt(n + 1);
        c3 = e.charCodeAt(n + 2);
        t += String.fromCharCode(
          ((r & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63)
        );
        n += 3;
      }
    }
    return t;
  }
};

async function getGitURL(url) {
  let data;
  const username = "jacyara";
  const password = "";
  const headers = {
    Accept:
      "application/vnd.github.inertia-preview+json, application/vnd.github.symmetra-preview+json",
    Authorization: "Basic " + Base64.encode(username + ":" + password)
  };
  try {
    const response = await axios.get(url, { params: {}, headers });
    data = response.data;
  } catch (error) {
    console.error(error);
  }

  return data;
}

async function getProjects() {
  return await getGitURL(
    "https://api.github.com/repos/laboratoriobridge/pec/projects"
  );
}

async function getColunas(projectId) {
  const url = "https://api.github.com/projects/" + projectId + "/columns";
  return getGitURL(url);
}

async function main() {
  const projetos = await getProjects();
  //insertColumns(projectId);
  //projetos.map(item => console.log(item.name + " " + item.creator.login));
  const listener = app.listen(5000, function() {
    //connection();
    console.log(
      "Your app is listening on port http://localhost:" +
        listener.address().port
    );
  });
}

main();

const client = new Client({
  host: "localhost",
  port: 5432,
  user: "root",
  password: "1234",
  database: "appissue"
});

client.connect(err => {
  if (err) {
    console.error("connection error", err.stack);
  } else {
    console.log("connected");
  }
});

async function projectExpected(request, response) {
  client.query("SELECT * FROM board", async (err, res) => {
    try {
      if (err) throw err;
      console.log(res);
      if (res.rowCount === 0) {
        const bu = await getProjects();
        bu.map(item => {
          console.log("VALORES " + item.id + item.name);
          var sql = "INSERT INTO board (id, nome) VALUES ($1, $2)";
          client.query(sql, [item.id, item.name], function(err, result) {
            try {
              if (err) throw err;
              console.log("Number of records inserted: " + result.affectedRows);
            } catch (error) {
              console.log(error);
            }
          });
        });
      }
      //client.end();
    } catch (error) {
      console.log(error);
    }
    console.log("RES  " + res);
    response.send({ res });
  });
}
app.get("/kkk", projectExpected);

async function colunasExpected(request, response) {
  var sql = "SELECT coluna.nome FROM coluna WHERE coluna.id_board=$1";
  client.query(sql, [request.query.id], function(err, result) {
    try {
      if (err) throw err;
      console.log("Number of records inserted: " + result.affectedRows);
    } catch (error) {
      console.log(error);
    }
    response.send({ result });
  });
}

app.get("/col", colunasExpected);

async function insertColumns(projectId) {
  const colunas = await getColunas(projectId);
  console.log(colunas);
  colunas.map(item => {
    var sqlSelect = "SELECT board.id FROM board WHERE id = $3";
    var sql =
      "INSERT INTO coluna (id, nome, id_board) VALUES ($1, $2, (" +
      sqlSelect +
      "))";
    client.query(sql, [item.id, item.name, projectId], function(err, result) {
      try {
        if (err) throw err;
        console.log("Number of records inserted: " + result.affectedRows);
      } catch (error) {
        console.log(error);
      }
    });
  });
}

// Heroku
// const client = new Client({
//   //connectionString: process.env.DATABASE_URL,
//   //ssl: true
// });

// client.connect();
// console.log(client);

// client.query(
//   "SELECT table_schema,table_name FROM information_schema.tables;",
//   (err, res) => {
//     if (err) throw err;
//     for (let row of res.rows) {
//       console.log(JSON.stringify(row));
//     }
//     client.end();
//   }
// );

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

const baseDir = `${__dirname}/build/`;
// we've started you off with Express,
// but feel free to use whatever libs or frameworks you'd like through `package.json`.
//http://expressjs.com/en/starter/static-files.html
app.use(express.static(baseDir));

//expressjs.com/en/starter/basic-routing.html
// http: app.get("/", function(request, response) {
//   response.sendFile(__dirname + "/build/index.html");
// });

//app.post("/issue", function(request, response, next) {
// request.on("data", function(data) {
//   console.log("Dados da Issue: ");
//   console.log("Ação: " + JSON.parse("" + data).action);
//   console.log(
//     "Nome: " +
//       JSON.parse("" + data).issue.title +
//       " Número: " +
//       JSON.parse("" + data).issue.number
//   );
//   console.log("Label: " + JSON.parse("" + data).issue.labels);
// });
// response.send("OK");
//});

// listen for requests :)
// const listener = app.listen(process.env.PORT, function() {
//   //connection();
//   console.log(
//     "Your app is listening on port http://localhost:" + listener.address().port
//   );
// });
