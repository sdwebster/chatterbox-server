/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/

//give requestHandler this closure variable. When we create a new server with a call to
//requestHandler, that server can start accumulating a memory store of POSTS
var allMessages = [];
// NOTE: if you want the serer to work on the first try without running any tests, you
// have to create a dummy message here and push it into allMessages so there will be
// at least one message

var requestHandler = function(request, response) {

  // Request and Response come from node's http module.
  //
  // They include information about both the incoming request, such as
  // headers and URL, and about the outgoing response, such as its status
  // and content.
  //
  // Documentation for both request and response can be found in the HTTP section at
  // http://nodejs.org/documentation/api/

  // Do some basic logging.
  //
  // Adding more logging to your server can be an easy way to get passive
  // debugging help, but you should always be careful about leaving stray
  // console.logs in your code.
  console.log("Serving request type " + request.method + " for url " + request.url);

  // See the note below about CORS headers.
  var headers = defaultCorsHeaders;

  // Tell the client we are sending them plain text.
  //
  // You will need to change this if you are sending something
  // other than plain text, like JSON or HTML.
  headers['Content-Type'] = "application/json";

  // .writeHead() writes to the request line and headers of the response,
  // which includes the status and all headers.

  //Default value response back to client
  var serverResponse = {};

  //Tests for valid URL
  if (request.url.substring(0,9) !== '/classes/') {
    //Add 404 status code for failed request
    response.writeHead(404, headers);
    response.end('');
  } else {
    if (request.method === "DELETE"){

    } else if (request.method === "GET"){
      //Add 200 status code for GET request
      response.writeHead(200, headers);
      //Add data to response
      serverResponse = {
        results: allMessages
      };
    } else if (request.method === "POST"){
      response.writeHead(201, headers);
      //As POSTed data comes in, build up a string with the message details
      var jsonString = '';
      request.on('data', function (chunk){
        jsonString += chunk;
      });

      //When entire string received, parse string into a js object
      request.on('end', function(){
        var newMessage = JSON.parse(jsonString);
        // Assign objectId so that client can detect whether posts have changed and need to be re-rendered
        newMessage.objectId = allMessages.length;
        allMessages.push(newMessage);

      });
    } else if (request.method === "PUT"){
      response.writeHead(201, headers);

    } else if (request.method === "OPTIONS"){
      response.writeHead(201, headers);

    } else {
      response.writeHead(404, headers);
    }
  }
  // Make sure to always call response.end() - Node may not send
  // anything back to the client until you do. The string you pass to
  // response.end() will be the body of the response - i.e. what shows
  // up in the browser.
  //
  // Calling .end "flushes" the response's internal buffer, forcing
  // node to actually send all the data over to the client.
  response.end(JSON.stringify(serverResponse));
};

// These headers will allow Cross-Origin Resource Sharing (CORS).
// This code allows this server to talk to websites that
// are on different domains, for instance, your chat client.
//
// Your chat client is running from a url like file://your/chat/client/index.html,
// which is considered a different domain.
//
// Another way to get around this restriction is to serve you chat
// client from this domain by setting up static file serving.
var defaultCorsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10 // Seconds.
};

exports.requestHandler = requestHandler;
