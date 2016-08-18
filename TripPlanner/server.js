var express = require('express');
var bodyParser = require('body-parser');


var app = express();

var connections = [];
var users = [];

app.use(express.static('./public'));

var server = app.listen(3000);
// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var router = express.Router();              // get an instance of the express Router

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });
});

var mongoose   = require('mongoose');
// mongoose.connect('mongodb://sudeepgaddam:nokiakyakiya911@ds161245.mlab.com:61245/sudeepdb'); // connect to our database
mongoose.connect('mongodb://127.0.0.1/myapp'); // connect to our database
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
	console.log("connection successful");

});

var Bear     = require('./models/bear');
var Message = require('./models/messages');

// on routes that end in /bears
// ----------------------------------------------------
router.route('/bears').post(function(req, res) {
				console.log('Received POST bears request');
        var bear = new Bear();      // create a new instance of the Bear model
        bear.name = req.body.name;  // set the bears name (comes from the request)
				console.log(bear.name);
        // save the bear and check for errors
        bear.save(function(err) {
					console.log("In save method");
            if (err)
                res.send(err);
					console.log("In save method, After save");

            res.json({ message: 'Bear created!' });

        });
    });


app.use('/api', router);

io = require('socket.io').listen(server);

io.sockets.on('connection', function(socket){

	socket.once('disconnect', function(){
		for(var i = 0;i < users.length;i++){
			if(users[i].id == this.id){
				users.splice(i, 1);
			}
		}
		connections.splice(connections.indexOf(socket), 1);
		socket.disconnect();
		console.log('Disconnected: %s sockets connected', connections.length);
		io.emit('disconnect', users);
	});

	socket.on('messageAdded', function(payload){
		var newMessage = {
			timeStamp: payload.timeStamp,
			text: payload.text,
			user: payload.user
		}
    var message = new Message();      // create a new instance of the Bear model
    message.timeStamp = payload.timeStamp;  // set the bears name (comes from the request)
    message.text = payload.text;
    message.user = payload.user;
    message.save(function(err) {
      io.emit('messageAdded', newMessage);

    });




	});


		socket.on('messageTyping', function(payload){

			console.log('Typing Message: '+payload.text);

			var newMessage = {
				timeStamp: payload.timeStamp,
				text: payload.text,
				user: payload.user
			}

			io.emit('messageTyping', newMessage);
		});

	socket.on('userJoined', function(payload){
		var newUser = {
			id: this.id,
			name: payload.name
		}

		users.push(newUser);
		io.emit('userJoined', users);
		console.log('User Joined: '+payload.name);
	});

	connections.push(socket);
	console.log('Connected: %s sockets connected', connections.length);
});

console.log('Server is running on port 3000');
