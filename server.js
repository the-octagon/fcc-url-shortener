var express = require('express');
var validUrl = require('valid-url');
var fs = require('fs');

var app = express();
//object used to save linkss similar to an array, but simpler to read in from a file
var savedLinks = {};

//read in from file on opening, preserving links accross server restart
try {
    savedLinks = fs.readFileSync('./savedLinks','utf8');
    savedLinks = JSON.parse(savedLinks);
} catch (err) {
    console.log(err);
}

//accept new urls and send short url
app.get('/new/:url(*)', function (req, res) {
  var url = req.params.url;
  
  //validate url
  if (!validUrl.isWebUri(url)) {
        res.send("That is not a valid url.");
        return 0;
  }
  //will not check to see if address is already shortened, in the vein of bit.ly or similar which provides tracking metrics for individual users
  
  //new id is object length, thus next possible address
  var id = Object.keys(savedLinks).length;
  var newLink = {"original_url": url, "short_url": "https://api-projects-theoctagon.c9users.io/" + id}
  
  savedLinks[id] = url;
  fs.writeFileSync("./savedLinks", JSON.stringify(savedLinks), 'utf8');
  
  res.send(newLink);
})


//accept short urls for redirect
app.get('/:id', function (req, res) {
  var id = req.params.id;
  
  try {
      res.redirect(savedLinks[id]);
  } catch (err) {
      res.send("You have entered an invalid short url.");
  }
});

//print man page if no parameters passed
app.get('/', function (req, res) {
    res.send('<h3>Example creation usage:</h3>https://api-projects-theoctagon.c9users.io/new/https://www.google.com<br>https://api-projects-theoctagon.c9users.io/new/http://foo.com:80<br><h3>Example creation output</h3>{ "original_url":"http://foo.com:80", "short_url":"https://api-projects-theoctagon.c9users.io/8170" }<br><h3>Usage:</h3>https://api-projects-theoctagon.c9users.io/2871<br><h3>Will redirect to:</h3>https://www.google.com/');
});

app.listen(8080, function () {
  console.log('URL shortener server is running');
})