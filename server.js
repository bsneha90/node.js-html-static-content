// var http = require('http');
var fs = require("fs");
var express = require('express');
var app = express();
var interceptor = require('express-interceptor');

var finalParagraphInterceptor = interceptor(function(req, res){
	return {
		// Only HTML responses will be intercepted
		isInterceptable: function(){
			return /text\/html/.test(res.get('Content-Type'));
		},
		// Appends a paragraph at the end of the response body
		intercept: function(body, send) {
			if(req.url === '/admin.html')
				res.redirect("/login")
		}
	};
})
app.get('/login', function (req, res) {
	res.send('Hello Login!');
});
app.get('*', function (req, res) {
	console.log(req.url);
	var s= req.url;

	sendFileContent(res, s.slice(1, s.length), "text/html");
});

app.use(finalParagraphInterceptor);

//app.use(express.static(__dirname + '/public/'));

// app.get('/', function (req, res) {
// 	res.send('Hello Dev!');
// });
//
// app.get('/index', function (req, response, next) {
// 	console.log(JSON.stringify(req.cookies))
// 	response.redirect('/');
// 	next();
// 	//sendFileContent(response, "index.html", "text/html");
// })
//
// app.use(function(req, res, next) {
// 	console.log(req.user);
// 	if (req.user===undefined)
// 	{
// 		res.redirect('/login');
// 	}
// 	next();
// });

app.listen(5000, function () {
	console.log('Dev app listening on port 5000!');
});
// http.createServer(function(request, response) {
//
// 	if(request.url === "/index"){
// 		sendFileContent(response, "index.html", "text/html");
// 	}
// 	else if(request.url === "/"){
// 		response.writeHead(200, {'Content-Type': 'text/html'});
// 		response.write('<b>Hey there!</b><br /><br />This is the default response. Requested URL is: ' + request.url);
// 	}
// 	else if(/^\/[a-zA-Z0-9\/]*.js$/.test(request.url.toString())){
// 		sendFileContent(response, request.url.toString().substring(1), "text/javascript");
// 	}
// 	else if(/^\/[a-zA-Z0-9\/]*.css$/.test(request.url.toString())){
// 		sendFileContent(response, request.url.toString().substring(1), "text/css");
// 	}
// 	else{
// 		console.log("Requested URL is: " + request.url);
// 		response.end();
// 	}
// }).listen(3000);

function sendFileContent(response, fileName, contentType){
	fs.readFile(fileName, function(err, data){
		if(err){
			response.writeHead(404);
			response.write("Not Found!");
		}
		else{
			response.writeHead(200, {'Content-Type': contentType});
			response.write(data);
		}
		response.end();
	});
}

