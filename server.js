var express = require('express'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    morgan = require('morgan'),
    restful = require('node-restful'),
    mongoose = restful.mongoose,
    app = express(),
    port = process.env.PORT || 3000;

var Resource = app.resource = restful.model('article', mongoose.Schema({
    title: String,
    tags : [],
    conent : mongoose.Schema.Types.Mixed,
    author : String,
    creationDate: { type: Date, default: Date.now },
    lastUpdateDate: { type: Date, default: Date.now }
  }))
  .methods(['get', 'post', 'put', 'delete']);
  
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({'extended':'true'}));
app.use(bodyParser.json());
app.use(bodyParser.json({type:'application/vnd.api+json'}));
app.use(methodOverride());
app.use('/static', express.static('public'));

mongoose.connect("mongodb://test:test@ds021943.mlab.com:21943/blog");



//TODO : Authenticate
Resource.register(app, '/articles');

app.listen(port, function (err) {
	if (err) { 
		console.error("Error creating server :" + err.message);
	}

	console.log("API listening at port ", port);
});