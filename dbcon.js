var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'classmysql.engr.oregonstate.edu',
  user            : 'cs340_ngoken',
  password        : '9356',
  database        : 'cs340_ngoken'
});

module.exports.pool = pool;