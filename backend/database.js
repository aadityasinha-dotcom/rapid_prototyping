const mysql = require('mysql');
// Create a connection to the MySQL server
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'siddhansh',
  password: 'mu_password',
  database: 'users'
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL server: ' + err.stack);
    return;
  }
  
  console.log('Connected to MySQL server as id ' + connection.threadId);
});

// Perform a query
connection.query('SELECT * FROM your_table_name', (err, rows) => {
  if (err) {
    console.error('Error executing query: ' + err.stack);
    return;
  }

  console.log('Data received from MySQL server:');
  console.log(rows);
});



// Close the connection
connection.end((err) => {
  if (err) {
    console.error('Error closing connection: ' + err.stack);
    return;
  }

  console.log('Connection closed.');
});
