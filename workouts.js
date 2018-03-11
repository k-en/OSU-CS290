var express = require('express');
var mysql = require('./dbcon.js');

var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', process.env.PORT || 3306);

app.use('/', express.static(__dirname));

app.get('/',function(req,res,next){
  var context = {};
  mysql.pool.query('SELECT * FROM workouts', function(err, rows, fields){
    if(err){
      next(err);
      return;
    }
    var results = [];
    for(var row in rows){
      var newItem = {'name': rows[row].name, 
                     'reps': rows[row].reps, 
                     'weight': rows[row].weight, 
                     'date':rows[row].date, 
                     'id':rows[row].id};
      if(rows[row].lbs){
        newItem.lbs = "lbs";
      }else{
        newItem.lbs = "kg";
      }
      results.push(newItem);                  
    }
    context.results = results;
    res.render('home', context);
  });
});

//reset
app.get('/reset-table',function(req,res,next){
  var context = {};
  mysql.pool.query("DROP TABLE IF EXISTS workouts", function(err){
    var createString = "CREATE TABLE workouts("+
    "id INT PRIMARY KEY AUTO_INCREMENT,"+
    "name VARCHAR(255) NOT NULL,"+
    "reps INT,"+
    "weight INT,"+
    "date DATE,"+
    "lbs BOOLEAN)";
    mysql.pool.query(createString, function(err){
      context.results = "Table reset";
      res.render('home',context);
    })
  });
});

//insert
app.get('/insert',function(req,res,next){
  var context = {};
  // insert the values from the request into the database
  console.log(req.query.lbs);
  mysql.pool.query("INSERT INTO `workouts` (`name`, `reps`, `weight`, `date`, `lbs`) VALUES (?, ?, ?, ?, ?)", 
    [req.query.name, 
    req.query.reps, 
    req.query.weight, 
    req.query.date, 
    req.query.lbs], 
  function(err, result){
    if(err){
      next(err);
      return;
    }
    context.inserted = result.insertId;
    res.send(JSON.stringify(context));
  });
});

//delete
app.get('/delete', function(req, res, next) {
  var context = {};
  mysql.pool.query("DELETE FROM `workouts` WHERE id = ?", 
    [req.query.id], 
    function(err, result) {
      if(err){
        next(err);
        return;
      }
    });
});

//edit
app.get('/edit',function(req, res, next){
  var context = {};
  mysql.pool.query('SELECT * FROM `workouts` WHERE id=?',
      [req.query.id], 
      function(err, rows, fields){
        if(err){
          next(err);
          return;
        }
        var results = [];
        for(var row in rows){
          var item = {'name': rows[row].name, 
                        'reps': rows[row].reps, 
                        'weight': rows[row].weight, 
                        'date':rows[row].date, 
                        'lbs':rows[row].lbs,
                        'id':rows[row].id};
          results.push(item);
        }
        context.results = results[0];
        res.render('edit', context);
  });
});

//updated return
app.get('/updated', function(req, res, next){
  var context = {};
  mysql.pool.query("SELECT * FROM `workouts` WHERE id=?", [req.query.id], 
    function(err, result){
      if(err){
        next(err);
        return;
      }
      if(result.length == 1){
        var current = result[0];
        console.log(req.query.lbs);
        if(req.query.lbs){
            req.query.lbs = "1";
        }else{
            req.query.lbs = "0";
        }

        mysql.pool.query('UPDATE `workouts` SET name=?, reps=?, weight=?, date=?, lbs=? WHERE id=?', 
        [req.query.name || current.name, 
        req.query.reps || current.reps, 
        req.query.weight || current.weight, 
        req.query.date || current.date, 
        req.query.lbs, 
        req.query.id],
        function(err, result){
          if(err){
            next(err);
            return;
          }
          mysql.pool.query('SELECT * FROM `workouts`', function(err, rows, fields){
            if(err){
              next(err);
              return;
            }
            var results = [];

            for(var row in rows){
              var item = {'name': rows[row].name, 
                          'reps': rows[row].reps,
                          'weight': rows[row].weight, 
                          'date':rows[row].date, 
                          'id':rows[row].id};
              if(rows[row].lbs){
                item.lbs = "lbs";
              }else{
                item.lbs = "kg";
              }
              results.push(item);
            }

            context.results = results;
            res.render('home', context);
          });
        });
      }
  });
});

app.use(function(req,res){
  res.status(404);
  res.render('404');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.type('plain/text');
  res.status(500);
  res.render('500');
});

app.listen(app.get('port'), function(){
  console.log('Express started on port ' + app.get('port') + '; press Ctrl-C to terminate.');
});