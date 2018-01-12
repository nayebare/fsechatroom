//load the signup
//load the database module
var http = require('http');
var  path = require('path');
var db_connection  = require('../middleware/database.js');// link  from the parent folder to actualy folder
var currentDate = new Date();
var bodyParser=require("body-parser");
var fs = require('fs');



exports.signup = function(req, res){

    message = '';

	if(req.method == "POST"){


    var registration_data ={
  	id: '',
    lname: req.body.first_name,
    fname: req.body.last_name,
    username: req.body.user_name,
    password: req.body.password,
    timestamp: currentDate
  		}

  db_connection.query('INSERT INTO user SET ?',registration_data, function (error, results, fields) {
         message = "Succesfully! Your account has been created.";
         res.render('signup.ejs',{message: message});

    });
  }
else{
res.render('signup');
   
  }

}

//get all messages
exports.getallmessages = function(req ,res){
            //show all message after login

    var sql="SELECT * FROM `messages`"; 
    db_connection.query(sql, function(err, results){    

         if(results.length){
         	for(x in results){
                res.locals.print =  results[x];
                console.log(results[x]);
            }
            var all_messages = results[0];
          //res.render('profile.ejs', {message:results[0].lname}); 

         }
         });

         }

//using export function

exports.login = function(req, res){
   var message = '';
   var sess = req.session;

 
   if(req.method == "POST"){
      var post  = req.body;
      var name= post.user_name;
      var pass= post.password;
    
      var sql="SELECT message, handle, fname, lname, username FROM `user`,`messages` WHERE `username`='"+name+"' and password = '"+pass+"'";                          
      db_connection.query(sql, function(err, results){    

         if(results.length){
            req.session.userId = results[0].id;
            req.session.user = results[0];
            console.log(results[0].fname);
            message = results[0];
            res.render('profile.ejs', {message:results[0].fname});
           

         }
         else{
            message = 'Wrong Credentials.';
            res.render('index.ejs',{message: message});
         }
                
      });
   } else {
      res.render('index.ejs',{message: message});
   }        
};

//call for the dashboard

exports.dashboard = function(req, res, next){
var user =  req.session.user,
userId = req.session.userId;
if(userId == null){
res.redirect("/home/dashboard");
return;
}

var sql="SELECT * FROM `user` WHERE `id`='"+userId+"'";
   db_connection.query(sql, function(err, results){
  
   //console.log(results);

  // message = results[0].id;
  
   res.render('profile.ejs', {message:message});   
  
});
};



