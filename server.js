//test
var app = require('./server-config.js');

var port = process.env.PORT || 4586;

app.listen(port);

console.log('Server now listening on port ' + port);
