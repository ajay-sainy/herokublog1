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
app.use('/', express.static('public'));

mongoose.connect("mongodb://test:test@ds021943.mlab.com:21943/blog");

//TODO : Authenticate

Resource.register(app, '/articles');

// Resource.route('tags', function(req, res, next) {
//   res.send('I have a recommendation for you!');
// });

app.get('/tags/:tag', function (req, res) {
    var article = mongoose.model('article', mongoose.Schema);
    // find each person with a last name matching 'Ghost'
    var query = article.find({ tags: req.params.tag });

    // execute the query at a later time
    query.exec(function (err, articles) {
      if (err) return handleError(err);
        res.json(articles);
    })
});

app.listen(port, function (err) {
	if (err) { 
		console.error("Error creating server :" + err.message);
	}
	console.log("API listening at port ", port);
});