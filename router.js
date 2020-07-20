const Address = require('./country');
const renderer = require('./renderer');
const querystring = require('querystring');

const home = (req, res) => { 
    if (req.url === "/") { 
        if (req.method.toLowerCase() === 'get') { 
            res.writeHead(200, {'Content-Type': 'text/html'});
            renderer.view('header', {}, res); //shows the header.html
            renderer.view('search', {}, res); //shows the search.html
            renderer.view('footer', {}, res); //shows the footer.html
            res.end();
        }
        else { //if url == '/' and POST
            req.on('data', postBody => { //extract the 'text' typed by the user. In that case, it's an IncomingMessage object
                let query = querystring.parse(postBody.toString()); //since data is a buffer (or stream), it needs to be converted to a string in order to be readable. The querystring parses the querystring and returns an object (i.e.: 'cep=22290030' will return '22290030'). More info at https://www.w3schools.com/nodejs/ref_querystring.asp
                res.writeHead(303, {'Location': '/' + query.cep}); //redirect the page to the /'text' informed 
                res.end();
            });
        }    
    }    
}

const countryDetails = (req, res) => {
    let country = req.url.replace('/','');
    if (country.length > 0) {
        res.writeHead(200, {'Content-Type': 'text/html'});
        renderer.view('header', {}, res);
        let getAddress = new Address(country); 
        getAddress.on('end', countryJSON => {
            let lang = [];
            countryJSON[0].languages.forEach(el => lang.push(el.name));
            let values = {
                country: countryJSON[0].name,
                capital: countryJSON[0].capital,
                flag: countryJSON[0].flag,
                currency: countryJSON[0].currencies[0].name,
                border: countryJSON[0].borders,
                timezone: countryJSON[0].timezones,
                language: lang
            }
            
            renderer.view('address', values, res);//shows the content of address.html with the values obtained above
            renderer.view('footer', {}, res); 
            res.end();
        });
        getAddress.on('error', error => {
            renderer.view('error', {errorMessage: error.message}, res);
            renderer.view('search', {}, res);
            renderer.view('footer', {}, res);
            res.end();
        });
    }
}

module.exports.home = home;
module.exports.countryDetails = countryDetails;