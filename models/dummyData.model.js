var mongoose = require('../dbconnection');
var Category = require('./categories.model');
var Buddy = require('./buddies.model');
//var Block = require('./blocks.model');
var Appointment = require('./appointments.model');

var db = mongoose.connection;
var Schema = mongoose.Schema;

//TEST ADDING Category
var testCategory = new Category({
    name: "testCategory",
    category_id: 0
});
testCategory.save(function(err) {
    if (err) throw err;
    console.log('TestCategory saved successfully!');
});

//TEST ADDING Buddy
var testBuddy = new Buddy({
    moodle_id: 1611812,
    name: "Eisenschmidt",
    surename: "Patrick",
    mobile: "017624440132",
    email: "1611812@stud.hs-mannheim.de",
    available: false,
    room: "",
    blocked: false,
    away: true,
    away_reason: "Essen!!!"
});
testBuddy.save(function(err) {
    if (err) throw err;
    console.log('testBuddy saved successfully!');
});

//TEST ADDING all blocks
db.collection('blocks').insertMany([
    //Minutes SINCE 00:00
    { start_time: 480, //08:00
        end_time: 570, //09:30
        block_id: 0 //
    },
    { start_time: 585, //09:45
        end_time: 675, //11:15
        block_id: 1 //
    },
    { start_time: 720, //12:00
        end_time: 810, //13:30
        block_id: 2 //
    },
    { start_time: 820, //13:40
        end_time: 910, //15:10
        block_id: 3 //
    },
    { start_time: 920, //15:20
        end_time: 1010, //16:50
        block_id: 4 //
    }
])

//TEST ADDING appointment
var testAppointment = new Appointment({
    block_id: "5bba033ca11ceb0ef8946b19",
    buddy_id: testBuddy,
    category_id: testCategory,
    moodle_id: 0,
    room: "A005",
    first_name: "Patrick",
    last_name: "Eisen",    
    status: true,
    urgency: false,
    description: "Test appointment",
    start_time: 480,
    end_time: 500
});
testAppointment.save(function(err) {
    if (err) throw err;
    console.log('testAppointment saved successfully!');
});