const express =  require('express');
const app = express();
const path = require('path');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const upload = require('express-fileupload');
const session= require('express-session');
const flash = require('connect-flash');
const {mongoDbUrl} = require('./config/database');
const passport = require('passport');

mongoose.connect(mongoDbUrl, { useNewUrlParser: true } ).then(db=> {
    console.log('Mongodb Connected');
}).catch(err => console.log(err));


app.use(express.static(path.join(__dirname,'public')));


const {select,generateTime,postBody} = require('./helpers/handlebars-helpers')

//handlebars template engine setup
app.engine('handlebars',exphbs({defaultLayout: 'home',helpers:{select: select, generateTime:generateTime,postBody:postBody}}));
app.set('view engine','handlebars');

//file upload

app.use(upload());


//Body parser

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

//method override
app.use(methodOverride('_method'));

//session

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}));

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

app.use((req,res,next)=>{
    res.locals.user = req.user || null;
    res.locals.success_message = req.flash('success_message');
    res.locals.error_message = req.flash('error_message');
    res.locals.error = req.flash('error');
    next();
});



//routes of the application
const home = require('./routes/home/index');
const admin = require('./routes/admin/index');
const posts = require('./routes/admin/posts');
const categories = require('./routes/admin/categories');
const comments = require('./routes/admin/comments');
const superAdmin = require('./routes/superAdmin/super');

app.use('/',home);
app.use('/admin',admin);
app.use('/admin/posts',posts);
app.use('/admin/categories',categories);
app.use('/admin/comments',comments);
app.use('/super/admin',superAdmin);


//server setup
const port = process.env.PORT || 9000;

app.listen(port,()=>{
    console.log(`listening on port ${port}`);
});
