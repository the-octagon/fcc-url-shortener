/*
Example creation output
{ "original_url":"http://foo.com:80", "short_url":"https://little-url.herokuapp.com/8170" }
*/

var express = require('express');
var app = express();
var savedLinks = [];
//TODO if text file exists, open and read in savedLinks 


//accept new urls and send short url
app.get('/new/:url(*)', function (req, res) {
  var url = req.params.url;
  var id = savedLinks.length;
  var newLink = {"original_url": url, "short_url": "https://api-projects-theoctagon.c9users.io/" + id}
  savedLinks.push(newLink);
  //TODO insert pushing to a textfile
  res.send(newLink);
})

//accept short urls for redirect
app.get('/:id', function (req, res) {
  var id = req.params.id;
  
  try {
      res.redirect(savedLinks[id].original_url);
  } catch (err) {
      console.log(err);
      res.send("You have entered an invalid short url.");
  }
})

app.listen(8080, function () {
  console.log('Timestamp server is running');
})
