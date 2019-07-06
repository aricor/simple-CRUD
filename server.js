var express = require('express');
var http = require('http');
var mysql = require('mysql');
var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended: true}));

var dateFormat = require('dateformat');
var now = new Date();

app.set('view engine', 'ejs');

app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js'));
app.use('/js', express.static(__dirname + '/node_modules/tether/dist/js'));
app.use('/js', express.static(__dirname + '/node_modules/jquery/dist'));
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));

const con = mysql.createConnection({
    host :'localhost',
    user : 'root',
    password : 'vitgia123',
    database : 'crud'
})

const sideTitle = "simple CRUD"
const baseURL = "http://localhost:4000/"

app.get('/', function(req,res){
    con.query("SELECT * FROM todo ORDER BY id_todo ASC", function(err,result){
        res.render('pages/index',{
            siteTitle : "CRUD",
            pageTitle : "TODO LIST",
            items : result    
        });

  });

});

app.get('/todo/add', function (req, res){
    res.render('pages/add-new.ejs',{
        siteTitle : "CRUD",
        pageTitle : "ADD NEW",
        items : ''    
    });
});

app.post('/todo/add',function (req, res){
    var query = "INSERT INTO `todo` (todostuff) VALUES (";
    query += " '"+req.body.todostuff+"')";
    con.query(query, function(err, result) {
        res.redirect(baseURL);
    });
});

app.get('/todo/update/:id_todo', function(req, res){
    con.query("SELECT * FROM todo WHERE id_todo ='"+req.params.id_todo + "'", function(err, result) {
        res.render('pages/update', {
            siteTitle : "CRUD",
            pageTitle : "Updating: " + result[0].todostuff,
            item : result
        });
    });
});

app.post('/todo/update/:id_todo', function(req, res){
    var query = "UPDATE `todo` SET";
        query += " `todostuff` = '"+req.body.todostuff+"'";
        query += " WHERE `todo`.`id_todo` =" +req.body.id_todo+"";
    con.query(query, function(err, result){
            if (result.affectedRows)
                res.redirect(baseURL);
        });
});

app.get('/todo/delete/:id_todo', function(req, res){
    con.query("DELETE FROM todo WHERE id_todo ='"+req.params.id_todo + "'", function(err, result) {
        if (result.affectedRows)
            res.redirect(baseURL);
    });
});

var server = app.listen(4000, function(){
    console.log("Server started on port 4000");
});
