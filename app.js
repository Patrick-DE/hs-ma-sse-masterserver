require('dotenv').load({ path: __dirname + '/.env' }); //process.env.SECRET

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

// create the app
const app = express();
app.disable('view cache');

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))
// parse requests of content-type - application/json
app.use(bodyParser.json())

//require('./models/dummyData.model');

// Require routes
var challenge = require('./routes/challenge.route');
app.use('/api/challenge', challenge);
var team = require('./routes/team.route');
app.use('/api/team', team);
var user = require('./routes/user.route');
app.use('/api/user', user);
var admin = require('./routes/admin.route');
app.use('/api/admin', admin);

var auth = require('./routes/chal_auth.route');
app.use('/api/', auth); //webroot

app.use(express.static(path.join(__dirname, 'public')));

app.listen(3000, () => {
    console.log("Server running on port 3000");
});
