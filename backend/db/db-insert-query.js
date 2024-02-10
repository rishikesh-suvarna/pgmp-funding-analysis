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


const query = `INSERT INTO "Grants" 
(id, title, description, total_funding, start_date, end_date, status) 
VALUES (2, 'HEalth related Activity Recognition system based on IoT – an interdisciplinary training program for young researchers', 'A current trend in healthcare involves the prevention of chronic diseases by changing behaviour towards more healthy lifestyle choices. This is supported by the increased use of wearable sensors and Internet of Things (IoT) devices. Human activity recognition and vital sign...', 
1527991.20, TO_DATE('2017-09-01', 'YYYY-MM-DD'),  TO_DATE('2021-08-31', 'YYYY-MM-DD'), 'CLOSED')`;

client.query(query, (err, res) => {
  if (err) {
      console.error(err);
      return;
  }
  console.log('Data insert successful');
  client.end();
});