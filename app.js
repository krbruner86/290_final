var express = require('express');
var app = express();

var handlebars = require('express-handlebars').create({defaultLayout:'main'});
var bodyParser = require('body-parser');

// used for processing the filesystem to display pictures
var fs = require('fs');

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 4384);

// configuration for CORS so that /contact can be POSTed
app.use((req, res, next) => {
    res.append('Access-Control-Allow-Origin', 'localhost:80');
    res.append('Access-Control-Allow-Methods', 'GET,POST');
    res.append('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

// routes
app.get('/',function(req,res){
    res.render('index');
});

app.get('/services',function(req,res){
    res.render('services');
});

app.get('/projects',function(req,res){

    //build an array of pictures from the directory
    var photos = [];
    var dir = '/images/projects/';

    // go through directory and add images
    fs.readdir('./public/images/projects', function (err, files) {
        if (err)
            throw err;
        for (var i in files) {
            photos.push({'name':dir + files[i]});
        }
    });
    var context = {};
    context.dataList = photos;
    res.render('projects', context);
});

app.get('/contact',function(req, res){
    res.render('contact');
});

app.use(function(req,res){
    res.status(404);
    res.render('404');
});

app.use(function(err, req, res){
    console.error(err.stack);
    res.type('plain/text');
    res.status(500);
    res.render('500');
});

app.listen(app.get('port'), function(){
    console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});