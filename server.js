var express = require('express'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    morgan = require('morgan'),
    restful = require('node-restful'),
    mongoose = restful.mongoose,
    app = express(),
    port = process.env.PORT || 3000;


app.use(morgan('dev'));
app.use(bodyParser.urlencoded({
    'extended': 'true'
}));
app.use(bodyParser.json());
app.use(bodyParser.json({
    type: 'application/vnd.api+json'
}));
app.use(methodOverride());
app.use('/', express.static('public'));

mongoose.connect("mongodb://test:test@ds021943.mlab.com:21943/blog");
// mongoose.connect("mongodb://localhost/blogdb");
//TODO : Authenticate
/** Article Schema start**/
var Article = app.resource = restful.model('article', mongoose.Schema({
        title: String,
        tags: [],
        content: mongoose.Schema.Types.Mixed,
        imageURL:String,
        author: String,
        creationDate: {
            type: Date,
            default: Date.now
        },
        lastUpdateDate: {
            type: Date,
            default: Date.now
        }
    }))
    .methods(['get', 'post','delete']);

Article.register(app, '/articles');
/***************************** Article Schema start **************************************/

/***************************** Subscription Schema start **************************************/
var SubscriptionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        validate: {
          validator: function(v) {
            var emailRegex =/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            console.log(v);
            return emailRegex.test(v); // Assuming email has a text attribute
            
          },
          message: '{VALUE} is invalid email id'
        },
    },
    creationDate: {
        type: Date,
        default: Date.now
    }
});

var Subscription = mongoose.model('Subscription', SubscriptionSchema);

Subscription.register(app, '/subsciptions');


app.post('/subscribe', function(req, res) {
    var data = {
        email: req.body.email,
        name: req.body.name
    };

    console.log('subscribe data - ' + data);

    var newSubscription = new Subscription(data);

    SubscriptionSchema.pre("save", function(next) {
        var self = this;
        console.log('self ' + self);
        Subscription.findOne({
            email: self.email
        }, 'email', function(err, results) {
            console.log(err, results);
            if (err) {
                next(err)
            } else if (results) {
                console.log('results ' + results);
                self.invalidate("userEmail", "User Email must be unique")
                next(new Error("User Email must be unique"))
            } else {
                next()
            }
        })
    });


    newSubscription.save(function(err) {
        console.log(' err ' + err);
        if (err) {
            return res.send({
                "status": 500,
                "error": err.message
            });
        } else {
            return res.send({
                "status": 200
            });
        }
    });
});


app.get('/subscriptions', function(req, res) {
    var Subscription = mongoose.model('Subscription', mongoose.Schema);

    var query = Subscription.find({
        
    });

    query.exec(function(err, articles) {
        if (err) return handleError(err);
        res.json(articles);
    })
});
/***************************** Subscription Schema End **************************************/

/***************************** Contact US Schema End **************************************/
var ContactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,        
        validate: {
          validator: function(v) {
            var emailRegex =/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            console.log(v);
            return emailRegex.test(v); // Assuming email has a text attribute
            
          },
          message: '{VALUE} is invalid email id'
        },
    },
    message:{
        type: String,
        required: true,
        trim: true
    },
    creationDate: {
        type: Date,
        default: Date.now
    }
});

var Contact = mongoose.model('Contact', SubscriptionSchema);

Contact.register(app, '/contact');

app.post('/contact', function(req, res) {
    var data = {
        email: req.body.email,
        name: req.body.name,
        message:req.body.message
    };

    var newMessage = new Contact(data);
   
    newMessage.save(function(err) {        
        if (err) {
            return res.send({
                "status": 500,
                "error": err.message
            });
        } else {
            return res.send({
                "status": 200
            });
        }
    });
});

/***************************** Contact US Schema End **************************************/


app.get('/tags/:tag', function(req, res) {
    var article = mongoose.model('article', mongoose.Schema);

    var query = article.find({
        tags: { $regex : new RegExp(req.params.tag, "i") }
    });

    query.exec(function(err, articles) {
        if (err) return handleError(err);
        res.json(articles);
    })
});

app.get('/articles/:limit?/:skip?', function(req, res) {
    var article = mongoose.model('article', mongoose.Schema);

    var query = article.find({});

    query
        .limit(parseInt(req.params.limit))
        .skip(parseInt((req.params.skip)))
        .exec(function(err, articles) {
            if (err) return console.error(err);
            res.json(articles);
        })
});

app.get('/articlesCount',function(req,res) {    
    getArticlesCount(function (count) {
        res.send(JSON.stringify({ count: count }));
    });
});

function getArticlesCount(cb) {
    var article = mongoose.model('article', mongoose.Schema);
    article.count({}, function(err, count) {
        console.log( "Number of docs: ", count );
        if(err) {
            console.log( "Error in count ", count );
            count = 0;
        }
        cb(count);
    });
}

app.listen(port, function(err) {
    if (err) {
        console.error("Error creating server :" + err.message);
    }
    console.log("API listening at port ", port);
});