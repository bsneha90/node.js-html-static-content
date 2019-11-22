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

function removeFirstCharacterOf(str) {
	return str.slice(1, str.length);
}

function generateHTMLLinkForFile(file, folder) {
	const parent =  "/" + folder + "/";
	console.log(parent,"parent");
	return '<a href="' + parent+file + '">' + file + '</a><br\>'
}

function handleFolder(requestURL, response) {
	const folder = removeFirstCharacterOf(requestURL);
	console.log(folder, 'folder');
	const files = fs.readdirSync(folder);

	const fileLinks = files.map((f)=> {
		return generateHTMLLinkForFile(f, folder)
	} )
	const htmlContent = '<html> <body>'+ fileLinks.join('')+
		'</body> </html>'
	response.writeHeader(200, {"Content-Type": "text/html"});
	response.write(htmlContent);
	response.end();

}

app.get('/login', function (req, res) {
	res.send('Hello Login!');
});
app.get('/', function (req,response) {
	handleFolder("/public", response);
})

const mainFolder ="public";

app.get('*', function (request, response) {
	const requestURL = request.url;

	function handleHTMLFiles() {
			var fileName = removeFirstCharacterOf(requestURL);
			sendFileContent(response,fileName, "text/html");
	}
	function handleDownloadabelFiles() {
		response.download(`${__dirname}${requestURL}`);
	}

	const isAHTMLFile = requestURL.indexOf('.html') >0;
	console.log("isAHTMLFile", isAHTMLFile);
	const isFileDownloadable = requestURL.indexOf('.pdf') >0;
	if(isAHTMLFile)
		handleHTMLFiles();
	else if(isFileDownloadable)
		handleDownloadabelFiles();
	else
		handleFolder(requestURL, response);

})

app.use(finalParagraphInterceptor);


app.listen(5000, function () {
	console.log('Dev app listening on port 5000!');
});




