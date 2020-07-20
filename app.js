const router = require('./router');
const http = require('http');

http.createServer((req,res) => {
    router.home(req,res);
    router.countryDetails(req,res);
}).listen(3030);
console.log('Server is up on http://localhost:3030. Have fun!');
