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
      "application/vnd.github.inertia-preview+json, application/vnd.github.symmetra-preview+json, application/vnd.github.machine-man-preview, application/vnd.github.starfox-preview+json",
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

async function getCards(colunaId) {
  const url = "https://api.github.com/projects/columns/" + colunaId + "/cards";
  return getGitURL(url);
}

async function getEvents(pageId) {
  const url =
    "https://api.github.com/repos/laboratoriobridge/pec/issues/events?page=" +
    pageId;
  return getGitURL(url);
}

async function getLabels() {
  const url = "https://api.github.com/repos/laboratoriobridge/pec/labels";
  return getGitURL(url);
}

async function main() {
  const projetos = await getProjects();
  //issuesPorColuna();
  //pegarEventos();
  //insertLabels();
  // insertCards("4924040");
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
  port: 5436,
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
      // console.log(res);
      if (res.rowCount === 0) {
        const bu = await getProjects();
        bu.map(item => {
          // console.log("VALORES " + item.id + item.name);
          var sql = "INSERT INTO board (id, nome) VALUES ($1, $2)";
          client.query(sql, [item.id, item.name], function(err, result) {
            try {
              if (err) throw err;
              // console.log("Number of records inserted: " + result.affectedRows);
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
    // console.log("RES  " + res);
    response.send({ res });
  });
}
app.get("/equipes", projectExpected);

async function colunasExpected(request, response) {
  var sql = "SELECT coluna.nome FROM coluna WHERE coluna.id_board=$1";
  client.query(sql, [request.query.id], function(err, result) {
    try {
      if (err) throw err;
      // console.log("Number of records inserted: " + result.affectedRows);
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

async function pegarEventos() {
  let i = 0;
  let eventos = await getEvents(i);
  let idsJaSalvos = [];
  var sql = "select id from eventos";
  client.query(sql, async function(err, result) {
    try {
      if (err) throw err;
    } catch (error) {
      console.log(error);
    }
    idsJaSalvos = result;

    do {
      // console.log("swswsw", result.rows.length);
      eventos.map(evento => {
        // result.rows.forEach(resultado => {
        //   if (resultado.id === evento.id) {
        //     console.log("DHUIDHOIHDWGWD");
        //     return;
        //   }
        // });
        console.log(evento.id);
        console.log(result.rows.includes(evento.id));
        if (result.rows.includes(evento.id)) {
          console.log("ja Existe");
          return;
        }
        switch (evento.event) {
          case "closed": {
            console.log(evento.event);
            client.query(
              "INSERT INTO eventos (id, evento, created, id_issue) values ($1, $2, $3, $4)",
              [evento.id, evento.event, evento.created_at, evento.issue.number],
              function(err, result) {
                try {
                  if (err) throw err;
                  console.log(
                    "Number of records inserted: " + result.affectedRows
                  );
                } catch (error) {
                  console.log(error);
                }
              }
            );
            break;
          }
          case "added_to_project": {
            //console.log(evento.event);
            insertIssues(evento);
            insertCards(evento);
            client.query(
              "INSERT INTO eventos (id, evento, created, id_issue, id_card, coluna, id_projeto) values ($1, $2, $3, $4, $5, $6, $7)",
              [
                evento.id,
                evento.event,
                evento.created_at,
                evento.issue.number,
                evento.project_card.id,
                evento.project_card.column_name,
                evento.project_card.project_id
              ],
              function(err, result) {
                try {
                  if (err) throw err;
                  console.log(
                    "Number of records inserted: " + result.affectedRows
                  );
                } catch (error) {
                  console.log(error);
                }
              }
            );
            break;
          }
          case "converted_note_to_issue": {
            console.log(evento.event);
            insertIssues(evento);
            insertCards(evento);
            client.query(
              "INSERT INTO eventos (id, evento, created, id_issue, id_card, coluna, id_projeto) values ($1, $2, $3, $4, $5, $6, $7)",
              [
                evento.id,
                evento.event,
                evento.created_at,
                evento.issue.number,
                evento.project_card.id,
                evento.project_card.column_name,
                evento.project_card.project_id
              ],
              function(err, result) {
                try {
                  if (err) throw err;
                  console.log(
                    "Number of records inserted: " + result.affectedRows
                  );
                } catch (error) {
                  console.log(error);
                }
              }
            );
            break;
          }
          case "moved_columns_in_project": {
            console.log(evento.event);
            client.query(
              "INSERT INTO eventos (id, evento, created, id_issue, id_card, coluna, id_projeto, coluna_anterior) values ($1, $2, $3, $4, $5, $6, $7, $8)",
              [
                evento.id,
                evento.event,
                evento.created_at,
                evento.issue.number,
                evento.project_card.id,
                evento.project_card.column_name,
                evento.project_card.project_id,
                evento.project_card.previous_column_name
              ],
              function(err, result) {
                try {
                  if (err) throw err;
                  console.log(
                    "Number of records inserted: " + result.affectedRows
                  );
                } catch (error) {
                  console.log(error);
                }
              }
            );
            break;
          }
          case "removed_from_project": {
            client.query(
              "INSERT INTO eventos (id, evento, created, id_issue, id_card, coluna, id_projeto) values ($1, $2, $3, $4, $5, $6, $7)",
              [
                evento.id,
                evento.event,
                evento.created_at,
                evento.issue.number,
                evento.project_card.id,
                evento.project_card.column_name,
                evento.project_card.project_id
              ],
              function(err, result) {
                try {
                  if (err) throw err;
                  console.log(
                    "Number of records inserted: " + result.affectedRows
                  );
                } catch (error) {
                  console.log(error);
                }
              }
            );
            break;
          }
          case "reopened": {
            client.query(
              "INSERT INTO eventos (id, evento, created, id_issue) values ($1, $2, $3, $4)",
              [evento.id, evento.event, evento.created_at, evento.issue.number],
              function(err, result) {
                try {
                  if (err) throw err;
                  console.log(
                    "Number of records inserted: " + result.affectedRows
                  );
                } catch (error) {
                  console.log(error);
                }
              }
            );
            break;
          }
          case "labeled": {
            //console.log(evento);
            client.query(
              "INSERT INTO rl_label_issue (id_issue, coluna) values ($1, $2)",
              [evento.issue.number, evento.label.name],
              function(err, result) {
                try {
                  if (err) throw err;
                  console.log(
                    "Number of records inserted: " + result.affectedRows
                  );
                } catch (error) {
                  console.log(error);
                }
              }
            );
            break;
          }
          case "unlabeled": {
            console.log(evento);
            client.query(
              "DELETE FROM rl_label_issue where id_issue=$1 and coluna=$2",
              [evento.issue.number, evento.label.name],
              function(err, result) {
                try {
                  if (err) throw err;
                  console.log(
                    "Number of records inserted: " + result.affectedRows
                  );
                } catch (error) {
                  console.log(error);
                }
              }
            );
            break;
          }
          default:
            break;
        }
      });
      i++;
      eventos = await getEvents(i);
    } while (i < 509);
  });

  //console.log("Eventos: ", eventos.length);
}

async function insertIssues(evento) {
  client.query(
    "INSERT INTO issue (id, nome, estado, modificacao) values ($1, $2, $3, $4)",
    [
      evento.issue.number,
      evento.issue.title,
      evento.issue.state,
      evento.issue.updated_at
    ],
    async function(err, result) {
      try {
        if (err) throw err;
        //console.log("Number of records inserted: " + result.affectedRows);
      } catch (error) {
        console.log(error);
      }
    }
  );
}

async function insertCards(evento) {
  console.log(evento.project_card);
  // let issue = itemCard.content_url;
  // let numberIssue =
  //   issue && issue.substring(issue.lastIndexOf("/") + 1, issue.length);
  var sql =
    "INSERT INTO cards (id, created, project_id, coluna, number_issue) VALUES ($1, $2, $3, $4, $5)";
  client.query(
    sql,
    [
      evento.project_card.id,
      evento.created_at,
      evento.project_card.project_id,
      evento.project_card.column_name,
      evento.issue.number
    ],
    function(err, result) {
      try {
        if (err) throw err;
        //console.log("Number of records inserted: " + result.affectedRows);
      } catch (error) {
        console.log(error);
      }
    }
  );
}

async function insertLabels() {
  const labels = await getLabels();
  labels.map(labels => {
    var sql = "INSERT INTO label (id, nome) VALUES ($1, $2)";
    client.query(sql, [labels.id, labels.name], function(err, result) {
      try {
        if (err) throw err;
        console.log("Number of records inserted: " + result.affectedRows);
      } catch (error) {
        console.log(error);
      }
    });
  });
}

async function issuesPorColuna(request, response) {
  var sql =
    "select coluna, count( coluna ) from ( select max( id ) as id, id_issue from eventos as e " +
    "where created between to_date( $2, 'dd/mm/yyyy') and to_date($3,'dd/mm/yyyy') " +
    "and id_projeto = $1 and evento not in( 'closed', 'reopened', 'lebeled','unlabeled', 'removed_from_project') " +
    "and id_issue not in( select distinct ev.id_issue from eventos as ev join cards on cards.number_issue = ev.id_issue " +
    "where evento like 'closed'and ev.created < to_date($2,'dd/mm/yyyy') " +
    "and cards.project_id = $1) " +
    "group by e.id_issue) as sub join eventos on sub.id = eventos.id " +
    "group by coluna";
  client.query(
    sql,
    [request.query.id, request.query.dataInicio, request.query.dataFim],
    function(err, result) {
      //console.log("AQUIIIIIIIIIIIHSAHSA           ", request.query);
      try {
        if (err) throw err;
      } catch (error) {
        console.log(error);
      }
      response.send({ result });
      //console.log("Issues, colunas", result);
    }
  );
}

app.get("/ipc", issuesPorColuna);

async function issuesAbertas(request, response) {
  var sql =
    "select distinct issue.id, issue.nome, max(cards.created) as created from eventos join issue on eventos.id_issue = issue.id " +
    "join cards on issue.id = cards.number_issue where id_card is not null and id_projeto=$1 and id_issue  not in (select id_issue from eventos where evento='closed') " +
    " group by issue.id, issue.nome";
  client.query(sql, [request.query.id], function(err, result) {
    try {
      if (err) throw err;
    } catch (error) {
      console.log(error);
    }
    response.send({ result });
    //console.log("Issues, colunas", result);
  });
}

app.get("/abertas", issuesAbertas);

async function issuesFechadas(request, response) {
  var sql =
    "select distinct issue.id, issue.nome, eventos.evento, eventos.created as fechada, cards.created as aberta from eventos join issue on eventos.id_issue = issue.id " +
    "inner join cards on issue.id = cards.number_issue where cards.project_id=$1 and eventos.evento='closed' and id_issue not in (select id_issue from eventos where evento='reopened')";
  client.query(sql, [request.query.id, request.query.dataFim], function(
    err,
    result
  ) {
    try {
      if (err) throw err;
    } catch (error) {
      console.log(error);
    }
    response.send({ result });
  });
}

app.get("/fechadas", issuesFechadas);

async function thoughputAcumulado(request, response) {
  var sql =
    "select count(*) from eventos join issue on eventos.id_issue = issue.id inner join cards on issue.id = cards.number_issue " +
    "where cards.project_id=$1 and eventos.evento = 'closed' and eventos.created <= to_date($2, 'dd/mm/yyyy') " +
    "and id_issue not in( select id_issue from eventos where evento = 'reopened') ";

  client.query(sql, [request.query.id], function(err, result) {
    try {
      if (err) throw err;
    } catch (error) {
      console.log(error);
    }
    response.send({ result });
  });
}

app.get("/acumulado", thoughputAcumulado);

//idEventos();

//pegarEventos();

async function idEventos() {
  var sql = "select id from eventos";
  client.query(sql, function(err, result) {
    try {
      if (err) throw err;
    } catch (error) {
      console.log(error);
    }
    return result;
  });
}

const baseDir = `${__dirname}/build/`;
// we've started you off with Express,
// but feel free to use whatever libs or frameworks you'd like through `package.json`.
//http://expressjs.com/en/starter/static-files.html
app.use(express.static(baseDir));
