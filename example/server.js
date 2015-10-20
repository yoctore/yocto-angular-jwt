var _           = require('lodash');
var express     = require('express');
var app         = express();
var bodyParser  = require('body-parser');
var cors        = require('cors');
var path        = require('path');
var base        = path.normalize(process.cwd() + '/example');

// view engine setup
app.set('views', base + '/views');
app.set('view engine', 'jade');
app.set('view options', ({ layout : true }));

app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

app.use(cors());

// Configure app to angular and all bower_components
app.use('/public', express.static(base + '/public'));
app.use('/bower_components',  express.static(base + '/bower_components'));
app.use('/dist',  express.static(path.normalize(base + '/../dist')));

// Return connect page
app.get('/connect', function(req, res, next) {
  res.render('connect');
});

var server = app.listen(3001, function() {
  var host = server.address().address;
  var port = server.address().port;

  console.log('app start on port : ' +  port);
});
