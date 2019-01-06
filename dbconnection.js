var mongoose = require('mongoose');
var mongodb = process.env.DATABASE;
mongoose.connect(mongodb, {useNewUrlParser: true});
mongoose.set('useCreateIndex', true);

//test
mongoose.Promise = global.Promise;

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function() {
  console.log("Connected!");
  
});

module.exports = mongoose;