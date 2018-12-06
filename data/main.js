var http = require("http");
const port = 3000
const ip = 'localhost'

var obj = require("../data/tabela_univariada.json");

http.createServer(function (req, res) {
   // Send the HTTP header
   // HTTP Status: 200 : OK
   // Content Type: text/plain
   res.writeHead(200, {'Content-Type': 'text/plain'});

   // Send the response body as "Hello World"
   res.end(var);
}).listen(8081);

// Console will print the message
console.log('Server running at http://127.0.0.1:8081/');
