var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var mongoose = require('mongoose');
var serveStatic = require('serve-static');
var morgan = require('morgan');
var logger = morgan('dev');
// var cookieParser = require('cookie-parser');
var session = require('express-session');
var mongoStore = require('connect-mongo')(session);
var dburl = 'mongodb://127.0.0.1:27017/ikanMovie';
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); //参数为true时 可以将post的name转换成对象来处理
app.use(logger);
mongoose.Promise = global.Promise;

app.locals.moment = require('moment');
app.set('views', './app/views/pages/');
app.set('view engine', 'jade');
app.use(serveStatic('public'));

// app.use(cookieParser());
app.use(

    session({
        secret: 'gony',
        resave: false,
        saveUninitialized: true,
        store: new mongoStore({
            url: dburl,
            collection: 'sessions'
        })
    })

)
// console.log(app.get('env'));
if ('development'==app.get('env')) {
    app.set('showStackError',true);
    morgan(':method :url :status :res[content-length] - :response-time ms')
    app.locals.pretty = true;
    mongoose.set('debug', true);
}
require('./config/route.js')(app);
app.listen(3000);
mongoose.connect(dburl, { useMongoClient: true });
console.log('启动服务成功....');
