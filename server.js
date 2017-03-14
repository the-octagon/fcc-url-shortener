var express = require('express');
var validUrl = require('valid-url');
var mongoUrl = "mongodb://localhost:27017/url_shortener";
var mongo = require('mongodb').MongoClient;
var shortid = require("shortid");
var app = express();
shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_');
//var document = {"firstName": firstName, "lastName": lastName};

/*mongo.connect(url, function(err, db) {
    if (err) { return err;}
	var docs = db.collection('docs');
	docs.insert(JSON.stringify(document), function(err, data) {
		if (err) {
			return err;
		}
		console.log(document);
		db.close();
	});
});*/

//accept new urls and send short url
app.get('/new/:url(*)', function (req, res) {
  var url = req.params.url;
  
  //validate url
  if (!validUrl.isWebUri(url)) {
        res.send({"error":"Wrong url format, make sure you have a valid protocol and real site."});
        return 0;
  }
  //will not check to see if address is already shortened, in the vein of bit.ly or similar which provides tracking metrics for individual users
  
  //new id is object length, thus next possible address
  //var id = Object.keys(savedLinks).length;
  var newId = shortid.generate();
  var newLink = {original_url: url, short_url: "https://api-projects-theoctagon.c9users.io/" + newId};
  
  
  mongo.connect(mongoUrl, function(err, db) {
    if (err) { console.log(err); return err;}
	  var urls = db.collection('urls');
	  urls.insert({_id: newId, original_url:newLink.original_url, short_url:newLink.short_url}, function(err, data) {
  		if (err) {
  		  console.log("error");
			  return err;
		  }
		  console.log(data);
		
  		db.close();
  	});
  });
  
  res.send(newLink);
})


//accept short urls for redirect
app.get('/:id', function (req, res) {
  var id = req.params.id;
  
  mongo.connect(mongoUrl, function(err, db) {
    if (err) { console.log(err); return err;}
	  var urls = db.collection('urls');
    urls.findOne({_id: id}, function(err, doc) {
      if (err) { console.log(err); return err;}
      if (doc) {
        res.redirect(doc.original_url);
      } else {
        res.send({"error":"This url is not on the database."});
      }
      
      

      db.close();
    });
  });
      
  /*if (savedLinks.hasOwnProperty(id)) {
      res.redirect(savedLinks[id]);
  } else {
      res.send({"error":"This url is not on the database."});
  }*/
});

//print man page if no parameters passed
app.get('/', function (req, res) {
    res.send('<h3>Example creation usage:</h3>https://api-projects-theoctagon.c9users.io/new/https://www.google.com<br>https://api-projects-theoctagon.c9users.io/new/http://foo.com:80<br><h3>Example creation output</h3>{ "original_url":"http://foo.com:80", "short_url":"https://api-projects-theoctagon.c9users.io/8170" }<br><h3>Usage:</h3>https://api-projects-theoctagon.c9users.io/2871<br><h3>Will redirect to:</h3>https://www.google.com/');
});

app.listen(8080, function () {
  console.log('URL shortener server is running');
});