const http=require('http');
const express=require('express');
const app=express();
const morgan= require('morgan');
const bodyParser=require('body-parser');
var passport=require('passport');
var path = require('path');
var cors = require('cors');

var mongoose=require('mongoose');
var Blogs=require('./models/blogs');
var Users = require('./models/user');


var usersRouter = require('./routes/users');
var blogRouter = require('./routes/blogRouter');

var authenticate=require('./authenticate');

const hostname='localhost';
const port=3444;

var config=require('./config');

var url=config.mongoUrl;
var connect=mongoose.connect(url,{
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex:true
});
connect.then((db)=>{
    console.log("sucessfully connected to the database");
  },(err)=>{console.log(err);})
  

app.use(cors());
app.use(morgan('dev'));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname+'/public'));
app.use(bodyParser.json());

app.use(passport.initialize());
app.use(passport.session());

app.use('/blogs',blogRouter);
app.use('/users', usersRouter);


app.use((req,res,next)=>{
    console.log(req.headers);
    res.statusCode=200;
    res.setHeader('Content-Type','text/html');
    res.end('<html><body><h1>This is an express server</h1></body></html>');
});


const server=http.createServer(app);

server.listen(port,hostname,()=>{
    console.log(`Server running at http://${hostname}:${port}`);
});
 