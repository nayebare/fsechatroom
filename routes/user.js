  //load the signup
  //load the database module
  var http = require('http');
  var  path = require('path');
  var db_connection  = require('../middleware/database.js');// link  from the parent folder to actualy folder
  var currentDate = new Date().toLocaleString();
  var bodyParser=require("body-parser");
  var fs = require('fs');
  var session = require('client-sessions');

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
      timestamp: currentDate,
      online: 'offline'
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
  exports.getallusers = function(req,res,next){
              //show all message after login

      var sql="SELECT * FROM `user`";
      db_connection.query(sql, function(err, rows){
        req.users = rows;
        return next();
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
     var sess;
     if(req.method == "POST"){
        var post  = req.body;
        var name = post.user_name;
        var pass = post.password;
        var sess = req.session;


        var sql="SELECT id, fname, lname, username,password FROM `user` WHERE `username`='"+name+"' and password = '"+pass+"'";
        db_connection.query(sql, function(err, results){
            var session_usedId = results[0].id;
             req.session.user = results[0].id;


           if(results.length){
              req.message = results;
              req.session_username = results[0].username;
              sess.userId = results[0].id;
              //console.log(sess.userId);
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

     //compound the session to be used elsewhere
        // YOUR CODE HERE TO GET COMPORT AND COMMAND
     sess.comport;
     sess.command;
  };


    //show users who are online
    exports.usersonline = function(req,res,next){
      var sql="SELECT * FROM `user` WHERE online ='online'";
      db_connection.query(sql, function(err, rows){
        req.usersonline = rows;
        //console.log(rows);
        return next();
           });

           }



  //use this url as middleware
  //build the function to select all messages and let serve as middle ware

  exports.rendermassagedata = function(req, res) {
      res.render('chatroom.ejs', {
          user_data: req.message,
          message_data: req.data,
          username: req.session_username,
          users_info: req.users,
          users_online: req.usersonline

      });
  }


     exports.updateuser = function(req,res,next){
      var userId = req.session.userId;

       var sql="UPDATE user SET `online` = 'online' WHERE `user`.`id` = +'"+userId+"'";
       db_connection.query(sql, function(err, rows){
          //console.log(err);
         // console.log(userId);
          return next();
            });

            }


  // sesion destroy userlogged
          exports.sessiondestroy = function(req,res,next){
             req.session.destroy(function(){
                console.log("user logged out.")
                //send a broadcast message
             });
             res.redirect('/login');
           }

  //lets update the status of the user after login into the database

  // update the user on logut
          exports.updateuserlogout = function(req,res,next){
          var userId = req.session.userId;

        var sql="UPDATE user SET `online` = 'offline' WHERE `user`.`id` = +'"+userId+"'";
        db_connection.query(sql, function(err, rows){
           //console.log(err);
           console.log(userId);
         return next();
             });
             }

    //lets update the status of the user after login into the database

    exports.updateuser = function(req,res,next){

     var userId = req.session.userId;

      var sql="UPDATE user SET `online` = 'online' WHERE `user`.`id` = +'"+userId+"'";
      db_connection.query(sql, function(err, rows){
         //console.log(err);
        // console.log(userId);
         return next();
           });

           }

  //call for the dashboard

  exports.dashboard = function(req, res, next){
  var user =  req.session.user,
  userId = req.session.userId;
  if(userId == null){
  res.redirect("/login");
  return;
  }


  var sql="SELECT * FROM `user` WHERE `id`='"+userId+"'";
     db_connection.query(sql, function(err, results){

     //console.log(results);

    // message = results[0].id;

     res.render('profile.ejs', {message:message});

  });
  };
