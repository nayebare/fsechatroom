  //load the signup
  //load the database module
  var http = require('http');
  var  path = require('path');
  var db_connection  = require('../middleware/database.js');// link  from the parent folder to actualy folder
  var currentDate = new Date();
  var bodyParser=require("body-parser");
  var fs = require('fs');


  //function to make sure the username is not the same
  exports.checkusername = function(req, res, next){
        var message = '';
        var sess = req.session;
        var post  = req.body;
        var name= post.user_name;
        var pass= post.password;


      var fname = req.body.first_name;
      if(fname ==''){

     req.message =  "fill fname the form please";
           return next();

      }
      
        var sql="SELECT username FROM `user` WHERE `username`='"+name+"'";                          
        db_connection.query(sql, function(err, results){    

           if(results.length){
            req.message = 'The username is already taken';
              return next();       
           }

           else{
              res.render('signup.ejs');
           }         
        });      
  };


  //function for signing up

  exports.signup = function(req, res , next){

      message = '';

  	if(req.method == "POST"){

      

      var registration_data = {
    	id: '',
      lname: req.body.first_name,
      fname: req.body.last_name,
      username: req.body.user_name,
      password: req.body.password,
      timestamp: currentDate
    		}


    db_connection.query('INSERT INTO user SET ?',registration_data, function (error, results, fields) {
           //res.render('signup.ejs',{message: message});
           req.message =  "Succesfully! Your account has been created.";
           return next();

      });
    }
  else{
  //check if the user is registered in the database
  res.render('signup');
    }

  }

  //export function to carry the two functions above
  //write the final query

  exports.rendersigup = function(req, res) {
      res.render('signup.ejs', {
          message: req.message
      });
  }



  //get all messages
  exports.getallmessages = function(req,res){
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




  //show all messages
  exports.showmessages = function(req, res, next) {
      var dbRequest = 'SELECT * FROM messages';
      db_connection.query(dbRequest, function(error, rows) {
          if(rows.length !== 0) {
              req.data = rows;
              return next();
          }
          else{

          res.render('incorrect_student'); /* Render the error page. */ 
          }           
      });
  }


  //write the final query
  /*
  exports.renderloginPage = function(req, res) {
      res.render('login', {
          students: req.students,
          groups: req.groups
      });
  }
  */



  //using export function

  exports.login = function(req, res){
     var message = '';
     var sess = req.session;
   
     if(req.method == "POST"){
        var post  = req.body;
        var name= post.user_name;
        var pass= post.password;
      
        var sql="SELECT message, messages.timestamp, handle, fname, lname, username FROM `user`,`messages` WHERE `username`='"+name+"' and password = '"+pass+"'";                          
        db_connection.query(sql, function(err, results){    

           if(results.length){
              req.session.userId = results[0].id;
              req.session.user = results[0];
              req.session.username = results[0].username;

              console.log(results[0].fname);
              message = results[0];
              res.render('profile.ejs', {
                message:results,
                data:req.session.username
              });
             

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



