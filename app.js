const router = require('./router');
const http = require('http');
const port = process.env.PORT || 3030;

http.createServer((req,res) => {
    router.home(req,res);
    router.countryDetails(req,res);
}).listen(port);
console.log(`Server is up on http://localhost:${port}. Have fun!`);
