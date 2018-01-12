
/*
* GET home page.
*/
exports.index = function(req, res){
    var message = '';
    var all_messages ="";
  res.render('index',{message: message});
  //res.render('index',{all_messages:all_messages});
}

