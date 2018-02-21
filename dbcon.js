var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'wolog.ckiqk2hwepv9.us-east-2.rds.amazonaws.com',
  user            : 'knny',
  password        : 'muhpass1',
  database        : 'wolog'
});

module.exports.pool = pool;