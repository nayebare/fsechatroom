  //load the signup
  //load the database module
  var http = require('http');
  var  path = require('path');
  var db_connection  = require('../middleware/database.js');// link  from the parent folder to actualy folder
  var currentDate = new Date().toLocaleString(); 
  var bodyParser=require("body-parser");
  var fs = require('fs');


  //function to make sure the username is not the same
  exports.checkusername = function(req, res, next){

        var message = '';
        var sess = req.session;
        var username= req.body.user_name;
        var lname= req.body.first_name;
        var fname = req.body.last_name;
        var pass= req.body.password;

     if(lname =='' || fname =='' || username =='' || pass ==''){
       req.message =  "Fill in all the fields please";
           return next();

      }
      else{
      
        var sql="SELECT username FROM `user` WHERE `username`='"+username+"'";                          
        db_connection.query(sql, function(err, results){    
            console.log(err);
           if(results.length !== 0){
            message="The Username name exists";
              res.render('signup.ejs',{message:message});
           }
           else{
              return next(); 
           }
           

        });
        }      
  };


  //function for signing up

  exports.signup = function(req, res , next){

      message = '';
        lname= req.body.first_name;
        fname = req.body.last_name;
        username = req.body.user_name;
        pass = req.body.pass;
      

       if(lname =='' || fname =='' || username =='' || pass ==''){
      
         req.message =  "Fill in all the fields please";
           return next();

          }else{

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
          res.render('profile.ejs'); /* Render the error page. */ 
          }           
      });
  }


  //using export function

  exports.login = function(req, res,next){
     var message = '';
     var sess = req.session;
   
     if(req.method == "POST"){
        var post  = req.body;
        var name = post.user_name;
        var pass = post.password;
       
        var sql="SELECT  fname, lname, username,password FROM `user` WHERE `username`='"+name+"' and password = '"+pass+"'";                          
        db_connection.query(sql, function(err, results){    

           if(results.length){
              req.message = results;
              req.session_username = results[0].username;
              return next();
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

  //use this url as middleware
  //build the function to select all messages and let serve as middle ware

  exports.rendermassagedata = function(req, res) {
      res.render('profile.ejs', {
          user_data: req.message,
          message_data: req.data,
          username: req.session_username
       
      });
  }
  


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



