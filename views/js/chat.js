    //chat.js library
    //making connection for the client

    var socket = io.connect('http://localhost:1080');
    var currentDate = new Date().toLocaleString(); 


          //making the message input respond to enter keyboard click
          var message = document.getElementById("message");

          addEventListener("keyup", function(event) {
          event.preventDefault();
          if (event.keyCode === 13) {
            document.getElementById("message").click();
            var input = message.value;
           if(input==""){
                alert('Please enter a message to be sent');
                }

                 feedback.innerHTML = " ";
                      socket.emit('chat', {
                      message: message.value,
                      handle: handle.value
                  });
                   document.getElementById("message").value = '';
                 }
                });


    //querying the dom
    var   message = document.getElementById('message'),
          handle = document.getElementById('handle'),
          btn = document.getElementById('send'),
          output = document.getElementById('output'),
          feedback = document.getElementById('feedback');

          btn.addEventListener('click', function(){
          var input = message.value;
          if(input==""){
          alert('Please enter a message');
          }else{


    		socket.emit('chat', {
    			message: message.value,
    			handle: handle.value
    		});
    		
                //clear the input field
                   document.getElementById("message").value = '';
             }
          });


          //add event message on message id
          message.addEventListener('keypress', function(){
              feedback.innerHTML = " ";
     	 	socket.emit('typing', handle.value);

          });

    //lsten for events

    socket.on('chat', function(data){
          output.innerHTML +='<p><strong>'+ data.handle +':</strong>' +currentDate+ '</p>' + '<p>' + data.message + '</p>';

    });

    //listen for the typing message
    socket.on('typing',function(data){

    	feedback.innerHTML='<p><em>'+data+' is typing a message...</em></p>';
    });

    //broadcating that user has entered  the chatroom
    var   username = document.getElementById('handle');

    socket.emit('adduser', username.value);
    //listen for the typing message
    socket.on('adduser',function(data){

      feedback.innerHTML='<p><em>'+data+' has joined chat...</em></p>';
    });

  //get socke to broadcast all messages

    socket.on('showmessages',function(data){

      feedback.innerHTML='<p><em>'+data+' </em></p>';
    });
