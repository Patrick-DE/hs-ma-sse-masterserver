const express = require('express');
//require('./models/dummyData.model');

// create the app
const app = express();

// Require routes
var buddy = require('./routes/challenge.route');
app.use('/challenge', buddy);
var buddy = require('./routes/flag.route');
app.use('/flag', buddy);

app.use(express.static(path.join(__dirname, 'public')));

app.listen(3000, () => {
 console.log("Server running on port 3000");
});
