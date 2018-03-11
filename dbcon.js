var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'azrds.cp3sdwiozgpt.us-west-1.rds.amazonaws.com',
  user            : 'knny',
  password        : 'kenny123',
  database        : 'azrds'
});

module.exports.pool = pool;