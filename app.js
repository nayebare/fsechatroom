
      /**
      * Module dependencies.
      */
      var express = require('express');
      var routes = require('./routes');
      var  user = require('./routes/user');
      var http = require('http');
      var  path = require('path');
      var db_connection  = require('./middleware/database.js');
      var  socket = require('socket.io');
      var session = require('client-sessions');

      //var methodOverride = require('method-override');
      var app = express();
      //var mysql      = require('mysql');
      var bodyParser=require("body-parser");

      //use router
      var router = express.Router();

      //global array to store  data
      var notes = [];

      //store all the messages from the database
      var getallmessages = [];

      //database connection


      //initiate session
      var session = require('express-session');

      app.use(session({
        secret: 'hashkey',
        resave: false,
        saveUninitialized: true,
        cookie: { maxAge: 60000 },
        saveUninitialized: true,
         proxy: true,
         resave: true,
         saveUninitialized: true
      }))

    /*
  app.use(session({
        cookieName: 'session',
        secret: 'random_string_goes_here',
        duration: 30 * 60 * 1000,
        activeDuration: 5 * 60 * 1000,
      }));
*/

      // all environments
      app.set('port', process.env.PORT || 8080);
      app.set('views', __dirname + '/views');

      app.set('view engine', 'ejs');
      app.use(bodyParser.urlencoded({ extended: false }));
      app.use(bodyParser.json());
      app.use(express.static(path.join(__dirname, '/views')));

      //call the routes
      app.post('/signup', user.checkusername,user.signup,user.rendersigup);
      app.post('/login', user.login,user.updateuser,user.showmessages,user.getallusers,user.usersonline,user.rendermassagedata);//call for login post

      //app.get('/login', user.showmessages, user.renderloginPage);

      app.get('/', routes.index);//call for main index page
      app.get('/login', routes.index);//call for login page
      app.get('/signup', user.signup);//call for signup page


      //get the dashboard
      app.get('/home/dashboard', user.dashboard);
      app.get('/logout', user.updateuserlogout,user.sessiondestroy,);
      //logout user
      /*
      app.get('/logout', function(req, res){
         req.session.destroy(function(){
            console.log("user logged out.")
         });
         res.redirect('/login');
      });
      */



       app.use(bodyParser.urlencoded({ extended: true }));

      //Middleware  creating  a server variable

      var server = app.listen(1080, function (){

      console.log('listening on port 1080');

      });

      //setting up the socket
      //setting up the socket
      var io = socket(server);

      //connect the socket function
      io.on('connection',function(socket){
       console.log('made socket connection',socket.id);

       //

        //listen for the message sent by th client
       socket.on('chat', function(data){
       io.sockets.emit('chat', data);

        notes.push(data);
      // insert the data into the table

      db_connection.query('INSERT INTO messages SET ?',data, function (error, results, fields) {
        if (error) {
          console.log("error ocurred",error);
        }else{

      //check that registered username exits in the database.

          console.log('The solution is: ', results);
        }
        });
       });




        //creating another event listener
      	socket.on('typing', function(data){
      	socket.broadcast.emit('typing',data);
      });

      //broadcast that user x has joined  chat
        //creating another event listener
        socket.on('adduser', function(data){
        socket.broadcast.emit('adduser',data);
      });


      });
