
	var mysql = require("mysql");

	var connection = mysql.createConnection({
	  host     : 'localhost',
	  user     : 'root',
	  password : '',
	  database : 'fsechatroom'
	});

	connection.connect(function(err){
	if(!err) {
	    console.log("Database is connected and works great");
	} else {
	    console.log("Error connecting database");
	}
	});


	module.exports = connection;