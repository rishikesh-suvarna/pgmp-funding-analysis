const { Client } = require("pg");

const client = new Client({
  user: "postgres",
  host: "localhost",
  database: "Funds",
  password: "admin",
  port: 5432,
});
client.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
});

const query = 'SELECT * FROM "Grants"';

client.query(query, (err, res) => {
  if (err) {
    console.error("ERROR ==> "+err);
    return;
  }
  for (let row of res.rows) {
    console.log(row);
  }
  client.end();
});
